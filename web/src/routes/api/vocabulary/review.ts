import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import {
  updateVocabularyCardReview,
  updateProgressMetrics,
  getActiveStageProgress,
} from '@/lib/hasura-queries'
import { applyReview, getQualityScore } from '@/lib/srs'

export const Route = createFileRoute('/api/vocabulary/review')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const cardId: string | undefined = body.cardId
          const userId: string | undefined = body.userId
          const wasCorrect: boolean | undefined = body.wasCorrect
          const responseTimeSeconds: number | undefined = body.responseTimeSeconds

          if (!cardId || !userId || typeof wasCorrect !== 'boolean') {
            return Response.json(
              { error: 'cardId, userId, and wasCorrect are required' },
              { status: 400 },
            )
          }

          const hasyx = getAdminClient()

          // 1. Получаем данные карточки (correct_count нужен ДО обновления —
          // words_learned инкрементируем только за первый правильный ответ по карточке)
          const card = await hasyx.select({
            table: 'vocabulary_cards',
            pk_columns: { id: cardId },
            returning: ['id', 'word', 'translation', 'correct_count'],
          })

          const cardData = Array.isArray(card) ? card[0] : card
          if (!cardData) {
            return Response.json({ error: 'Card not found' }, { status: 404 })
          }
          const previousCorrectCount: number = cardData.correct_count ?? 0

          // 2. Обновляем счётчики карточки и создаем запись в review_history
          await updateVocabularyCardReview(hasyx, cardId, userId, wasCorrect, responseTimeSeconds)

          // 3. FSRS: обновляем srs_state (единый источник истины для scheduling)
          const quality = getQualityScore(wasCorrect, responseTimeSeconds)
          const updatedState = await applyReview(hasyx, userId, 'vocabulary_card', cardId, quality)

          // 4. Обновляем last_reviewed_at (next_review_date — legacy, не пишем)
          await hasyx.update({
            table: 'vocabulary_cards',
            pk_columns: { id: cardId },
            _set: {
              last_reviewed_at: new Date().toISOString(),
            },
          })

          // 5. words_learned — только первый правильный ответ по карточке
          // (п.5 Этапа 1 roadmap: иначе повторные свайпы раздувают метрику)
          if (wasCorrect && previousCorrectCount === 0) {
            const today = new Date().toISOString().split('T')[0]

            // Обновляем progress_metrics
            await updateProgressMetrics(hasyx, userId, today, {
              wordsLearned: 1,
            })

            // Обновляем stage_progress
            const activeStageProgress = await getActiveStageProgress(hasyx, userId)
            if (activeStageProgress?.id) {
              await hasyx.update({
                table: 'stage_progress',
                pk_columns: { id: activeStageProgress.id },
                _set: {
                  words_learned: (activeStageProgress.words_learned || 0) + 1,
                },
              })
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
            ],
          })

          const updatedCardData = Array.isArray(updatedCard) ? updatedCard[0] : updatedCard

          return Response.json({
            success: true,
            card: updatedCardData
              ? { ...updatedCardData, next_review_date: updatedState.due.toISOString().split('T')[0] }
              : updatedCardData,
          })
        } catch (error: any) {
          console.error('[vocabulary/review] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to review vocabulary card' },
            { status: 500 },
          )
        }
      },
    },
  },
})
