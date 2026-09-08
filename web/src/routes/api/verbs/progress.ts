import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/progress')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const verbsService = new VerbsService(getAdminClient())
          const searchParams = new URL(request.url).searchParams
          const type = searchParams.get('type')

          if (type === 'groups') {
            const groups = await verbsService.getGroupProgress(who.userId)
            return Response.json({ groups })
          }

          if (type === 'weak') {
            const limit = parseInt(searchParams.get('limit') || '10')
            const weakVerbs = await verbsService.getWeakVerbs(who.userId, limit)
            return Response.json({ verbs: weakVerbs })
          }

          return jsonError('Invalid type parameter', 400)
        } catch (error: any) {
          console.error('[GET /api/verbs/progress] Error:', error)
          return jsonError(error?.message || 'Failed to fetch progress', 500)
        }
      },
    },
  },
})
