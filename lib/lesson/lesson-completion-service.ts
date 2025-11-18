import { Hasyx } from 'hasyx';

import { LessonContentService, LessonMaterials } from '@/lib/lesson/lesson-content-service';
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service';
import { completeTask, getUserProfile } from '@/lib/hasura-queries';
import { calculateSM2, getQualityScore, initializeSM2 } from '@/lib/lesson-snapshots/sm2-algorithm';

interface PronunciationResultPayload {
  accuracy: number | null;
  lowAccuracyWords: string[];
  flaggedWords: string[];
  script?: string | null;
}

interface FlashcardResult {
  cardId: string;
  wasCorrect: boolean;
  responseTime?: number;
  userSentence?: string;
}

interface CompleteLessonOptions {
  userId: string;
  taskId: string;
  pronunciation?: PronunciationResultPayload | null;
  flashcardResults?: FlashcardResult[];
}

export class LessonCompletionService {
  private readonly lessonContentService: LessonContentService;
  private readonly vocabularyService: VocabularyGenerationService;

  constructor(private readonly hasyx: Hasyx) {
    this.lessonContentService = new LessonContentService(hasyx);
    this.vocabularyService = new VocabularyGenerationService(hasyx);
  }

  async completeLesson(options: CompleteLessonOptions) {
    const task = await this.getTask(options.taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.user_id !== options.userId) {
      throw new Error('Task does not belong to user');
    }

    const lesson = await this.lessonContentService.getOrGenerateLesson({
      userId: options.userId,
      task,
    });

    const snapshotId = await this.createSnapshot({
      task,
      lesson,
      pronunciation: options.pronunciation ?? null,
    });

    const flaggedWords = this.normalizeWords(options.pronunciation);
    if (flaggedWords.length > 0) {
      const user = await getUserProfile(this.hasyx, options.userId);
      await this.vocabularyService.generateCardsFromWords({
        userId: options.userId,
        level: user?.current_level || 'A2',
        words: flaggedWords,
        sourceSnapshotId: snapshotId,
        context: options.pronunciation?.script ?? null,
      });
    }

    // Обработка результатов флэш-карточек и обновление Active Recall
    if (options.flashcardResults && options.flashcardResults.length > 0) {
      await this.updateActiveRecall({
        userId: options.userId,
        snapshotId,
        flashcardResults: options.flashcardResults,
      });
    }

    await completeTask(this.hasyx, options.taskId);

    return {
      snapshotId,
      flaggedWords,
    };
  }

  private async getTask(taskId: string) {
    const task = await this.hasyx.select({
      table: 'daily_tasks',
      pk_columns: { id: taskId },
      returning: [
        'id',
        'user_id',
        'type',
        'title',
        'description',
        'type_specific_payload',
        'duration_minutes',
      ],
    });

    if (!task) {
      return null;
    }

    if (Array.isArray(task)) {
      return task[0] ?? null;
    }

    return task;
  }

  private normalizeWords(pronunciation?: PronunciationResultPayload | null): string[] {
    if (!pronunciation) {
      return [];
    }
    const words = [...(pronunciation.flaggedWords ?? []), ...(pronunciation.lowAccuracyWords ?? [])]
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(words)).slice(0, 12);
  }

  private async createSnapshot(params: {
    task: any;
    lesson: LessonMaterials;
    pronunciation: PronunciationResultPayload | null;
  }): Promise<string | null> {
    const { task, lesson, pronunciation } = params;

    const result = await this.hasyx.insert({
      table: 'lesson_snapshots',
      object: {
        user_id: task.user_id,
        task_id: task.id,
        lesson_type: task.type,
        duration_seconds: (task.duration_minutes ?? 0) * 60,
        content_snapshot: {
          lesson,
          pronunciation,
        },
        problem_areas: this.buildProblemAreas(pronunciation),
        performance_score:
          typeof pronunciation?.accuracy === 'number' ? pronunciation.accuracy : null,
        methodology_tags: pronunciation ? ['pronunciation_practice'] : [],
      },
      returning: ['id'],
    });

    if (Array.isArray(result)) {
      return result[0]?.id ?? null;
    }
    return result?.id ?? null;
  }

  private buildProblemAreas(pronunciation: PronunciationResultPayload | null) {
    if (!pronunciation) {
      return [];
    }
    const words = this.normalizeWords(pronunciation);
    const timestamp = new Date().toISOString();
    return words.map((word) => ({
      type: 'unknown_word',
      content: word,
      context: 'Pronunciation practice',
      severity: 'medium',
      timestamp,
    }));
  }

  private async updateActiveRecall(params: {
    userId: string;
    snapshotId: string | null;
    flashcardResults: FlashcardResult[];
  }) {
    const { userId, snapshotId, flashcardResults } = params;

    for (const result of flashcardResults) {
      // Получаем текущую карточку
      const card = await this.hasyx.select({
        table: 'vocabulary_cards',
        pk_columns: { id: result.cardId },
        returning: ['id', 'word', 'translation'],
      });

      if (!card || (Array.isArray(card) && card.length === 0)) {
        continue;
      }

      const cardData = Array.isArray(card) ? card[0] : card;

      // Ищем существующую запись Active Recall для этой карточки
      const existingRecall = await this.hasyx.select({
        table: 'active_recall_sessions',
        where: {
          user_id: { _eq: userId },
          recall_item_id: { _eq: result.cardId },
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

      // Рассчитываем качество ответа
      const quality = getQualityScore(result.wasCorrect, result.responseTime);

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
        await this.hasyx.update({
          table: 'active_recall_sessions',
          pk_columns: { id: existingRecallData.id },
          _set: {
            quality,
            ease_factor: sm2Result.easeFactor,
            interval_days: sm2Result.interval,
            repetitions: sm2Result.repetitions,
            next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
            recall_success: result.wasCorrect,
            recall_time_seconds: result.responseTime,
            user_response: result.userSentence,
            correct_response: cardData.translation,
            context_prompt: `Вспомни перевод слова "${cardData.word}"`,
            updated_at: new Date().toISOString(),
          },
        });
      } else {
        await this.hasyx.insert({
          table: 'active_recall_sessions',
          object: {
            user_id: userId,
            lesson_snapshot_id: snapshotId,
            recall_type: 'vocabulary',
            recall_item_id: result.cardId,
            recall_item_type: 'vocabulary_card',
            quality,
            ease_factor: sm2Result.easeFactor,
            interval_days: sm2Result.interval,
            repetitions: sm2Result.repetitions,
            next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
            recall_attempts: 1,
            recall_success: result.wasCorrect,
            recall_time_seconds: result.responseTime,
            user_response: result.userSentence,
            correct_response: cardData.translation,
            context_prompt: `Вспомни перевод слова "${cardData.word}"`,
          },
        });
      }

      // Обновляем next_review_date в vocabulary_cards
      await this.hasyx.update({
        table: 'vocabulary_cards',
        pk_columns: { id: result.cardId },
        _set: {
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          last_reviewed_at: new Date().toISOString(),
        },
      });
    }
  }
}


