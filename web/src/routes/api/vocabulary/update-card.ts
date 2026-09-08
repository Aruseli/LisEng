import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/vocabulary/update-card')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        const body = await request.json().catch(() => ({}))
        const cardId = typeof body.cardId === 'string' ? body.cardId : ''
        const translation = typeof body.translation === 'string' ? body.translation.trim() : ''
        const example =
          typeof body.example === 'string'
            ? body.example.trim()
            : typeof body.example_sentence === 'string'
              ? body.example_sentence.trim()
              : ''

        if (!cardId) return jsonError('cardId is required', 400)
        if (!translation) return jsonError('translation is required', 400)

        try {
          const db = getAdminClient()
          const existing = await db.select({
            table: 'vocabulary_cards',
            pk_columns: { id: cardId },
            returning: ['id', 'user_id', 'word'],
          })
          const row = Array.isArray(existing) ? existing[0] : existing
          if (!row?.id || row.user_id !== who.userId) {
            return jsonError('Card not found', 404)
          }

          const updated = await db.update({
            table: 'vocabulary_cards',
            pk_columns: { id: cardId },
            _set: {
              translation,
              example_sentence: example || null,
            },
            returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
          })
          const card = Array.isArray(updated) ? updated[0] : updated

          const sessions = await db.select({
            table: 'active_recall_sessions',
            where: {
              user_id: { _eq: who.userId },
              recall_item_id: { _eq: cardId },
            },
            returning: ['id'],
          })
          const sessionList = Array.isArray(sessions) ? sessions : sessions ? [sessions] : []
          for (const session of sessionList) {
            if (!session?.id) continue
            await db.update({
              table: 'active_recall_sessions',
              pk_columns: { id: session.id },
              _set: {
                correct_response: translation,
                context_prompt: example || row.word,
              },
            })
          }

          return Response.json({ card })
        } catch (error: any) {
          return jsonError(error?.message ?? 'Failed to update card', 500)
        }
      },
    },
  },
})
