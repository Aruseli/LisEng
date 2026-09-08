import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { getKumonProgress } from '#/lib/hasura-queries'
import { requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/progress/kumon')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const hasyx = getAdminClient()

          const kumonProgress = await getKumonProgress(hasyx, who.userId)
          const progressArray = Array.isArray(kumonProgress)
            ? kumonProgress
            : [kumonProgress].filter(Boolean)

          return Response.json({ skills: progressArray })
        } catch (error: any) {
          console.error('[progress/kumon] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to load Kumon progress' },
            { status: 500 },
          )
        }
      },
    },
  },
})
