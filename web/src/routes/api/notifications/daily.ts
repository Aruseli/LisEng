import { createFileRoute } from '@tanstack/react-router'

import { readLiveEnv, readServerEnv } from '#/lib/server/env'
import { jsonError } from '#/lib/server/route-utils'
import { runSql, sqlRows } from '#/lib/hasura/run-sql'
import { configureWebPush } from '#/lib/push'

export const Route = createFileRoute('/api/notifications/daily')({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
})

async function handle(request: Request) {
  // Ручной запуск: ?secret= / x-cron-secret против HASURA_EVENT_SECRET.
  // Vercel Cron: Authorization: Bearer $CRON_SECRET.
  const secret = readServerEnv().HASURA_EVENT_SECRET || readLiveEnv('NOTIFICATIONS_CRON_SECRET')
  const got = new URL(request.url).searchParams.get('secret') || request.headers.get('x-cron-secret')
  const cronSecret = process.env.CRON_SECRET
  const bearer = request.headers.get('authorization')
  const authorized =
    (secret && got === secret) ||
    (cronSecret && bearer === `Bearer ${cronSecret}`)
  if (!authorized) return jsonError('Unauthorized', 401)
  try {
    const webpush = configureWebPush()
    const result = await runSql(`SELECT endpoint, p256dh, auth FROM public.push_subscriptions;`, true)
    const list = sqlRows(result as string[][])
    const payload = JSON.stringify({ title: 'LisEng', body: 'Сегодня есть план занятий' })
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
    return jsonError(e?.message ?? 'daily failed', 500)
  }
}
