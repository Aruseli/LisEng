import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { getUserProfile } from '@/lib/hasura-queries'
import { createNewCard, saveState } from '@/lib/srs'
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service'

export const Route = createFileRoute('/api/vocabulary/add-word')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        const body = await request.json().catch(() => ({}))
        const word = String(body.word ?? '')
          .toLowerCase()
          .trim()
        const translation = typeof body.translation === 'string' ? body.translation.trim() : ''
        const example = typeof body.example === 'string' ? body.example.trim() : ''

        if (!word) return jsonError('word is required', 400)

        try {
          const db = getAdminClient()
          const existing = await db.select({
            table: 'vocabulary_cards',
            where: { user_id: { _eq: who.userId }, word: { _eq: word } },
            limit: 1,
            returning: ['id'],
          })
          const found = Array.isArray(existing) ? existing[0] : existing
          if (found?.id) {
            return Response.json({ error: 'already exists', cardId: found.id }, { status: 409 })
          }

          const today = new Date().toISOString().split('T')[0]
          const profile = await getUserProfile(db, who.userId)
          const level = profile?.current_level || 'A2'

          if (translation) {
            const inserted = await db.insert({
              table: 'vocabulary_cards',
              object: {
                user_id: who.userId,
                word,
                translation,
                example_sentence: example || null,
                next_review_date: today, // legacy NOT NULL колонка; scheduling — в srs_state
                difficulty: 'new',
                added_date: today,
              },
              returning: ['id', 'word', 'translation', 'example_sentence'],
            })
            const card = Array.isArray(inserted) ? inserted[0] : inserted
            if (card?.id) {
              // FSRS: новое состояние без фиктивных повторений, due = сегодня
              await saveState(db, who.userId, 'vocabulary_card', card.id, createNewCard(new Date()))
            }
            return Response.json({ card, created: true })
          }

          const service = new VocabularyGenerationService(db)
          const stored = await service.generateCardsForUser({
            userId: who.userId,
            level,
            words: [word],
            context: example || null,
          })
          const created = stored[0]
          if (!created?.id) {
            return jsonError('Не удалось сгенерировать перевод. Впишите перевод вручную или попробуйте ещё раз.', 502)
          }
          if (!created.translation || created.translation.toLowerCase() === created.word.toLowerCase()) {
            return jsonError('Не удалось сгенерировать перевод. Впишите перевод вручную или попробуйте ещё раз.', 502)
          }

          const full = await db.select({
            table: 'vocabulary_cards',
            pk_columns: { id: created.id },
            returning: ['id', 'word', 'translation', 'example_sentence'],
          })
          const card = Array.isArray(full) ? full[0] : full
          return Response.json({ card, created: true })
        } catch (error: any) {
          const message = String(error?.message ?? '')
          if (
            message.includes('Не удалось сгенерировать') ||
            message.includes('OpenRouter') ||
            message.includes('AI') ||
            message.includes('OPENROUTER')
          ) {
            return jsonError(
              'Не удалось сгенерировать перевод. Впишите перевод вручную или попробуйте ещё раз.',
              502,
            )
          }
          return jsonError(error?.message ?? 'Failed to add word', 500)
        }
      },
    },
  },
})
