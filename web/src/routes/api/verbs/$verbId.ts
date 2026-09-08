import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/$verbId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const { verbId } = params
          const verbsService = new VerbsService(getAdminClient())
          const verb = await verbsService.getVerbWithDetails(verbId, who.userId)

          if (!verb) {
            return jsonError('Verb not found', 404)
          }

          return Response.json({ verb })
        } catch (error: any) {
          console.error('[GET /api/verbs/:verbId] Error:', error)
          return jsonError(error?.message || 'Failed to fetch verb', 500)
        }
      },
    },
  },
})
