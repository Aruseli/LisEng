import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service'
import { getUserProfile } from '@/lib/hasura-queries'

export const Route = createFileRoute('/api/vocabulary/generate-cards')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const userId: string | undefined = body.userId
          const level: string | undefined = body.level
          const words: string[] | undefined = body.words
          const context: string | undefined = body.context // Контекст предложения для слова/фразы
          const contexts: string[] | undefined = body.contexts // Массив контекстов для каждого слова

          if (!userId) {
            return Response.json({ error: 'userId is required' }, { status: 400 })
          }

          const hasyx = getAdminClient()

          const profile = await getUserProfile(hasyx, userId)
          const derivedLevel = level || profile?.current_level || 'A2'

          const service = new VocabularyGenerationService(hasyx)
          const stored = await service.generateCardsForUser({
            userId,
            level: derivedLevel,
            words,
            snapshotInsights: null,
            context: context ?? null,
            contexts: contexts ?? null,
          })

          return Response.json({
            created: stored.length,
            cards: stored,
          })
        } catch (error: any) {
          console.error('[vocabulary/generate-cards] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to generate vocabulary cards' },
            { status: 500 },
          )
        }
      },
    },
  },
})
