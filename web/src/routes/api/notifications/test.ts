import { createFileRoute } from '@tanstack/react-router'

import { jsonError, requireUserId } from '#/lib/server/route-utils'
import { runSql, sqlRows } from '#/lib/hasura/run-sql'
import { configureWebPush } from '#/lib/push'

export const Route = createFileRoute('/api/notifications/test')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who
        try {
          const webpush = configureWebPush()
          const result = await runSql(
            `SELECT endpoint, p256dh, auth FROM public.push_subscriptions WHERE user_id = '${who.userId}';`,
            true,
          )
          const list = sqlRows(result as string[][])
          const payload = JSON.stringify({ title: 'LisEng', body: 'Тестовое уведомление: всё работает.' })
          let sent = 0
          for (const row of list) {
            try {
              await webpush.sendNotification(
                { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
                payload,
              )
              sent++
            } catch (err: any) {
              if (err?.statusCode === 404 || err?.statusCode === 410) {
                await runSql(`DELETE FROM public.push_subscriptions WHERE endpoint = '${row.endpoint.replace(/'/g, "''")}';`)
              }
            }
          }
          return Response.json({ sent })
        } catch (e: any) {
          return jsonError(e?.message ?? 'test failed', 500)
        }
      },
    },
  },
})
