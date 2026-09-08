import { createFileRoute } from '@tanstack/react-router'

import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { runSql } from '#/lib/hasura/run-sql'

function esc(value: string) {
  return value.replace(/'/g, "''")
}

export const Route = createFileRoute('/api/notifications/subscribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who
        const body = await request.json().catch(() => ({}))
        const endpoint = body.endpoint as string | undefined
        const keys = body.keys as { p256dh?: string; auth?: string } | undefined
        if (!endpoint || !keys?.p256dh || !keys?.auth) return jsonError('invalid subscription', 400)
        try {
          await runSql(`
            INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth)
            VALUES ('${who.userId}', '${esc(endpoint)}', '${esc(keys.p256dh)}', '${esc(keys.auth)}')
            ON CONFLICT (endpoint) DO UPDATE SET
              p256dh = EXCLUDED.p256dh,
              auth = EXCLUDED.auth,
              user_id = EXCLUDED.user_id,
              updated_at = now();
          `)
          return Response.json({ ok: true })
        } catch (e: any) {
          return jsonError(e?.message ?? 'subscribe failed', 500)
        }
      },
    },
  },
})
