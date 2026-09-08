import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { VerbsService } from '#/lib/verbs/verbs-service'

export const Route = createFileRoute('/api/verbs/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const verbsService = new VerbsService(getAdminClient())
          const searchParams = new URL(request.url).searchParams
          const group = searchParams.get('group')
          const frequency = searchParams.get('frequency') as
            | 'must_know'
            | 'high'
            | 'medium'
            | 'low'
            | null
          const includeProgress = searchParams.get('includeProgress') === 'true'
          const includeExamples = searchParams.get('includeExamples') === 'true'

          const verbs = await verbsService.getVerbs({
            group: group ? parseInt(group) : undefined,
            frequency: frequency || undefined,
            userId: includeProgress ? who.userId : undefined,
            includeProgress,
            includeExamples,
          })

          return Response.json({ verbs })
        } catch (error: any) {
          console.error('[GET /api/verbs] Error:', error)
          return jsonError(error?.message || 'Failed to fetch verbs', 500)
        }
      },
    },
  },
})
