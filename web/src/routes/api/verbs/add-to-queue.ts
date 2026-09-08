import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/add-to-queue')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const body = await request.json()
          const { verbId } = body

          if (!verbId) {
            return jsonError('Missing required field: verbId', 400)
          }

          const verbsService = new VerbsService(getAdminClient())
          await verbsService.addToReviewQueue(who.userId, verbId)

          return Response.json({ success: true })
        } catch (error: any) {
          console.error('[POST /api/verbs/add-to-queue] Error:', error)
          return jsonError(error?.message || 'Failed to add verb to queue', 500)
        }
      },
    },
  },
})
