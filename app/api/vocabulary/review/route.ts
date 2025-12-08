import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import {
  updateVocabularyCardReview,
  updateProgressMetrics,
  getActiveStageProgress,
} from '@/lib/hasura-queries';
import { calculateSM2, getQualityScore, initializeSM2 } from '@/lib/lesson-snapshots/sm2-algorithm';

const generate = Generator(schema as any);

function createAdminClient(): HasyxApolloClient {
  const url = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  if (!url || !secret) {
    throw new Error('Hasura admin credentials are not configured');
  }

  return createApolloClient({
    url,
    secret,
    ws: false,
  }) as HasyxApolloClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const cardId: string | undefined = body.cardId;
    const userId: string | undefined = body.userId;
    const wasCorrect: boolean | undefined = body.wasCorrect;
    const responseTimeSeconds: number | undefined = body.responseTimeSeconds;

    if (!cardId || !userId || typeof wasCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'cardId, userId, and wasCorrect are required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    // 1. Обновляем карточку и создаем запись в review_history
    await updateVocabularyCardReview(hasyx, cardId, userId, wasCorrect, responseTimeSeconds);

    // 2. Получаем данные карточки для обновления active_recall_sessions
    const card = await hasyx.select({
      table: 'vocabulary_cards',
      pk_columns: { id: cardId },
      returning: ['id', 'word', 'translation'],
    });

    const cardData = Array.isArray(card) ? card[0] : card;
    if (!cardData) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // 3. Обновляем active_recall_sessions используя SM-2 алгоритм
    const existingRecall = await hasyx.select({
      table: 'active_recall_sessions',
      where: {
        user_id: { _eq: userId },
        recall_item_id: { _eq: cardId },
        recall_item_type: { _eq: 'vocabulary_card' },
      },
      order_by: [{ created_at: 'desc' }],
      limit: 1,
      returning: [
        'id',
        'quality',
        'ease_factor',
        'interval_days',
        'repetitions',
        'next_review_date',
      ],
    });

    const existingRecallData = Array.isArray(existingRecall) ? existingRecall[0] : existingRecall;

    // Рассчитываем качество ответа (0-5)
    const quality = getQualityScore(wasCorrect, responseTimeSeconds);

    // Получаем текущие параметры SM-2
    const currentParams = existingRecallData
      ? {
          quality,
          easeFactor: existingRecallData.ease_factor ?? 2.5,
          interval: existingRecallData.interval_days ?? 1,
          repetitions: existingRecallData.repetitions ?? 0,
        }
      : {
          ...initializeSM2(),
          quality,
        };

    // Рассчитываем новые параметры SM-2
    const sm2Result = calculateSM2(currentParams);

    // Создаем или обновляем запись Active Recall
    if (existingRecallData) {
      await hasyx.update({
        table: 'active_recall_sessions',
        pk_columns: { id: existingRecallData.id },
        _set: {
          quality,
          ease_factor: sm2Result.easeFactor,
          interval_days: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          recall_success: wasCorrect,
          recall_time_seconds: responseTimeSeconds,
          context_prompt: `Вспомни перевод слова "${cardData.word}"`,
          updated_at: new Date().toISOString(),
        },
      });
    } else {
      await hasyx.insert({
        table: 'active_recall_sessions',
        object: {
          user_id: userId,
          lesson_snapshot_id: null, // standalone vocabulary review
          recall_type: 'vocabulary',
          recall_item_id: cardId,
          recall_item_type: 'vocabulary_card',
          quality,
          ease_factor: sm2Result.easeFactor,
          interval_days: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          recall_attempts: 1,
          recall_success: wasCorrect,
          recall_time_seconds: responseTimeSeconds,
          correct_response: cardData.translation,
          context_prompt: `Вспомни перевод слова "${cardData.word}"`,
        },
      });
    }

    // 4. Обновляем next_review_date в vocabulary_cards на основе SM-2
    await hasyx.update({
      table: 'vocabulary_cards',
      pk_columns: { id: cardId },
      _set: {
        next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
        last_reviewed_at: new Date().toISOString(),
      },
    });

    // 5. При правильном ответе обновляем words_learned
    if (wasCorrect) {
      const today = new Date().toISOString().split('T')[0];

      // Обновляем progress_metrics
      await updateProgressMetrics(hasyx, userId, today, {
        wordsLearned: 1,
      });

      // Обновляем stage_progress
      const activeStageProgress = await getActiveStageProgress(hasyx, userId);
      if (activeStageProgress?.id) {
        await hasyx.update({
          table: 'stage_progress',
          pk_columns: { id: activeStageProgress.id },
          _set: {
            words_learned: (activeStageProgress.words_learned || 0) + 1,
          },
        });
      }
    }

    // Получаем обновленную карточку для ответа
    const updatedCard = await hasyx.select({
      table: 'vocabulary_cards',
      pk_columns: { id: cardId },
      returning: [
        'id',
        'word',
        'translation',
        'correct_count',
        'incorrect_count',
        'difficulty',
        'next_review_date',
      ],
    });

    return NextResponse.json({
      success: true,
      card: Array.isArray(updatedCard) ? updatedCard[0] : updatedCard,
    });
  } catch (error: any) {
    console.error('[vocabulary/review] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to review vocabulary card' },
      { status: 500 }
    );
  }
}

