import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/review')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const verbsService = new VerbsService(getAdminClient())
          const searchParams = new URL(request.url).searchParams
          const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
          const limit = parseInt(searchParams.get('limit') || '20')

          const verbs = await verbsService.getVerbsForReview(who.userId, date, limit)

          return Response.json({ verbs })
        } catch (error: any) {
          console.error('[GET /api/verbs/review] Error:', error)
          return jsonError(error?.message || 'Failed to fetch review verbs', 500)
        }
      },
    },
  },
})
