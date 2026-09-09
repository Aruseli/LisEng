import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { readServerEnv } from '#/lib/server/env'
import { DailyPlanService } from '@/lib/plan/daily-plan-service'
import {
  LessonSnapshotService,
  ShuHaRiService,
  ProgressInsightsService,
  ScheduleService,
} from '@/lib/lesson-snapshots'

export const Route = createFileRoute('/api/plan/generate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const hasuraEventSecret =
            request.headers.get('x-hasura-event-secret') ||
            request.headers.get('X-Hasura-Event-Secret')
          const expectedSecret = readServerEnv().HASURA_EVENT_SECRET

          if (hasuraEventSecret && expectedSecret && hasuraEventSecret !== expectedSecret) {
            return Response.json(
              { error: 'Unauthorized: invalid event secret' },
              { status: 401 },
            )
          }

          const body = await request.json().catch(() => ({}))

          const userId: string | undefined = body.userId
          const targetDate: string | undefined = body.date
          const regenerate: boolean = Boolean(body.regenerate)
          const forceAi: boolean = Boolean(body.forceAi)

          if (!userId) {
            return Response.json({ error: 'userId is required' }, { status: 400 })
          }

          const hasyx = getAdminClient()

          // Создаем зависимые сервисы
          const scheduleService = new ScheduleService(hasyx)
          const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)
          const lessonSnapshotService = new LessonSnapshotService(hasyx)
          const progressInsightsService = new ProgressInsightsService(
            hasyx,
            lessonSnapshotService,
            shuHaRiService,
            scheduleService,
          )

          const dailyPlanService = new DailyPlanService(hasyx, progressInsightsService)
          const plan = await dailyPlanService.generateDailyPlan({
            userId,
            targetDate,
            regenerate,
            forceAi,
          })

          return Response.json({ plan })
        } catch (error: any) {
          console.error('[plan/generate] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to generate plan' },
            { status: 500 },
          )
        }
      },
    },
  },
})
