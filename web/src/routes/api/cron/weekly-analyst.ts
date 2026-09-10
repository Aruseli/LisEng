import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { runWeeklyAnalyst } from '#/lib/ai/weekly-analyst-service'
import { readLiveEnv, readServerEnv } from '#/lib/server/env'
import { jsonError } from '#/lib/server/route-utils'

/**
 * Еженедельный агент-аналитик (Этап 5 roadmap).
 * Дёргается Vercel Cron (vercel.json, вс 03:00 UTC) или вручную:
 *   curl '/api/cron/weekly-analyst?secret=...'
 */
export const Route = createFileRoute('/api/cron/weekly-analyst')({
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
  const secret =
    readServerEnv().HASURA_EVENT_SECRET || readLiveEnv('NOTIFICATIONS_CRON_SECRET')
  const got =
    new URL(request.url).searchParams.get('secret') ||
    request.headers.get('x-cron-secret')
  const cronSecret = process.env.CRON_SECRET
  const bearer = request.headers.get('authorization')
  const authorized =
    (secret && got === secret) ||
    (cronSecret && bearer === `Bearer ${cronSecret}`)
  if (!authorized) return jsonError('Unauthorized', 401)

  try {
    const report = await runWeeklyAnalyst(getAdminClient())
    return Response.json(report)
  } catch (error: any) {
    console.error('[API /cron/weekly-analyst] Error:', error)
    return jsonError(error?.message ?? 'weekly-analyst failed', 500)
  }
}
