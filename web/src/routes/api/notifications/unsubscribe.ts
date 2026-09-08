import { createFileRoute } from '@tanstack/react-router'

import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { runSql } from '#/lib/hasura/run-sql'

function esc(value: string) {
  return value.replace(/'/g, "''")
}

export const Route = createFileRoute('/api/notifications/unsubscribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who
        const body = await request.json().catch(() => ({}))
        const endpoint = body.endpoint as string | undefined
        if (!endpoint) return jsonError('endpoint required', 400)
        try {
          await runSql(
            `DELETE FROM public.push_subscriptions WHERE user_id = '${who.userId}' AND endpoint = '${esc(endpoint)}';`,
          )
          return Response.json({ ok: true })
        } catch (e: any) {
          return jsonError(e?.message ?? 'unsubscribe failed', 500)
        }
      },
    },
  },
})
