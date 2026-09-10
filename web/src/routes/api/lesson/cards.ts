import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

type Card = {
  id: string
  word: string
  translation: string
  exampleSentence?: string | null
  difficulty?: string | null
}

export const Route = createFileRoute('/api/lesson/cards')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who
        const taskId = new URL(request.url).searchParams.get('taskId')
        if (!taskId) return jsonError('taskId is required', 400)

        try {
          const db = getAdminClient()
          const task = await db.select({
            table: 'daily_tasks',
            pk_columns: { id: taskId },
            returning: ['id', 'user_id', 'type', 'type_specific_payload'],
          })
          const row = Array.isArray(task) ? task[0] : task
          if (!row || row.user_id !== who.userId) return jsonError('Task not found', 404)

          const payload = (row.type_specific_payload ?? {}) as Record<string, any>
          const insightType = payload.insight_type
          const insightReference = payload.insight_reference
          const isVocabulary = row.type === 'vocabulary'

          const mapCard = (c: any): Card => ({
            id: c.id,
            word: c.word,
            translation: c.translation,
            exampleSentence: c.example_sentence,
            difficulty: c.difficulty,
          })

          if (insightType === 'sm2_due' && insightReference) {
            // FSRS: reference указывает на srs_state (vocabulary), legacy — на active_recall_sessions
            const srsState = await db.select({
              table: 'srs_state',
              pk_columns: { id: insightReference },
              returning: ['item_id', 'item_type'],
            })
            const srsData = Array.isArray(srsState) ? srsState[0] : srsState
            if (srsData?.item_type === 'vocabulary_card' && srsData.item_id) {
              const card = await db.select({
                table: 'vocabulary_cards',
                pk_columns: { id: srsData.item_id },
                returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
              })
              const cardData = Array.isArray(card) ? card[0] : card
              if (cardData) {
                return Response.json({ cards: [mapCard(cardData)], canGenerateLevelPack: false })
              }
            }

            // Legacy fallback: grammar/прочие recall-записи
            const recall = await db.select({
              table: 'active_recall_sessions',
              pk_columns: { id: insightReference },
              returning: ['recall_item_id', 'recall_type'],
            })
            const recallData = Array.isArray(recall) ? recall[0] : recall
            if (recallData?.recall_type === 'vocabulary' && recallData.recall_item_id) {
              const card = await db.select({
                table: 'vocabulary_cards',
                pk_columns: { id: recallData.recall_item_id },
                returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
              })
              const cardData = Array.isArray(card) ? card[0] : card
              if (cardData) {
                return Response.json({ cards: [mapCard(cardData)], canGenerateLevelPack: false })
              }
            }
          }

          const today = new Date().toISOString().split('T')[0]
          // FSRS: due из srs_state (источник истины)
          const dueStates = await db.select({
            table: 'srs_state',
            where: {
              user_id: { _eq: who.userId },
              item_type: { _eq: 'vocabulary_card' },
              due: { _lte: today },
            },
            order_by: [{ due: 'asc' }],
            limit: 10,
            returning: ['item_id'],
          })
          const states = Array.isArray(dueStates) ? dueStates : dueStates ? [dueStates] : []
          const dueIds = states.map((s: any) => s.item_id)
          const reviewCards = dueIds.length
            ? await db.select({
                table: 'vocabulary_cards',
                where: {
                  id: { _in: dueIds },
                },
                returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
              })
            : []
          const cardList = Array.isArray(reviewCards) ? reviewCards : reviewCards ? [reviewCards] : []
          const byId = new Map(cardList.map((c: any) => [c.id, c]))
          const list = dueIds.map((id: string) => byId.get(id)).filter(Boolean)
          if (list.length > 0) {
            return Response.json({
              cards: list.map(mapCard),
              canGenerateLevelPack: false,
            })
          }

          return Response.json({
            cards: [],
            canGenerateLevelPack: isVocabulary,
          })
        } catch (error: any) {
          return jsonError(error?.message ?? 'Failed to load cards', 500)
        }
      },
    },
  },
})
