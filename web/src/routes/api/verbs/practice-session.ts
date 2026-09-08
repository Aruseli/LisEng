import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/verbs/practice-session')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const body = await request.json()
          const { verbsPracticed, accuracy, durationMinutes } = body

          if (typeof verbsPracticed !== 'number' || typeof accuracy !== 'number') {
            return jsonError('Missing required fields: verbsPracticed, accuracy', 400)
          }

          await getAdminClient().insert({
            table: 'verb_practice_sessions',
            object: {
              user_id: who.userId,
              session_date: new Date().toISOString().split('T')[0],
              verbs_practiced: verbsPracticed,
              accuracy: Math.round(accuracy * 100) / 100,
              duration_minutes: durationMinutes || 1,
            },
          })

          return Response.json({ success: true })
        } catch (error: any) {
          console.error('[POST /api/verbs/practice-session] Error:', error)
          return jsonError(error?.message || 'Failed to save practice session', 500)
        }
      },
    },
  },
})
