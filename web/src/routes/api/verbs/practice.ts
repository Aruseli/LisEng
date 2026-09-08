import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService, PracticeResult } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/practice')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const body = await request.json()
          const { verbId, wasCorrect, responseTime, practiceMode } = body

          if (!verbId || typeof wasCorrect !== 'boolean') {
            return jsonError('Missing required fields: verbId, wasCorrect', 400)
          }

          const verbsService = new VerbsService(getAdminClient())
          const result: PracticeResult = {
            verbId,
            wasCorrect,
            responseTime,
            practiceMode: practiceMode || 'form-to-meaning',
          }

          await verbsService.recordPracticeResult(who.userId, verbId, result)

          return Response.json({ success: true })
        } catch (error: any) {
          console.error('[POST /api/verbs/practice] Error:', error)
          return jsonError(error?.message || 'Failed to record practice result', 500)
        }
      },
    },
  },
})
