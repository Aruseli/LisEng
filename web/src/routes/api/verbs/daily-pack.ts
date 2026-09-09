import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/daily-pack')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const body = await request.json().catch(() => ({}))
          const count = Math.min(5, Math.max(3, Number(body.count) || 4))
          const verbsService = new VerbsService(getAdminClient())
          const verbs = await verbsService.pickDailyPack(who.userId, count)

          return Response.json({ verbs })
        } catch (error: any) {
          console.error('[POST /api/verbs/daily-pack] Error:', error)
          return jsonError(error?.message || 'Failed to pick daily verbs', 500)
        }
      },
    },
  },
})
