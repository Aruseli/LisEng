import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import {
  LessonSnapshotService,
  ProgressInsightsService,
  ScheduleService,
  ShuHaRiService,
} from '#/lib/lesson-snapshots'
import { requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/progress/insights')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const hasyx = getAdminClient()

          // Создаем экземпляры зависимых сервисов
          const scheduleService = new ScheduleService(hasyx)
          const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)
          const lessonSnapshotService = new LessonSnapshotService(hasyx)

          // Создаем сервис инсайтов
          const insightsService = new ProgressInsightsService(
            hasyx,
            lessonSnapshotService,
            shuHaRiService,
            scheduleService,
          )

          // Получаем полную картину прогресса
          const progressInsights = await insightsService.getProgressInsights(who.userId)

          return Response.json({
            success: true,
            insights: progressInsights,
          })
        } catch (error: any) {
          console.error('[progress/insights] Error:', error)
          return Response.json(
            {
              error: error.message,
              stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 },
          )
        }
      },

      /**
       * Получить инсайты для генерации плана (используется DailyPlanService)
       */
      POST: async ({ request }) => {
        try {
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const { days = 30 } = await request.json()

          const hasyx = getAdminClient()

          // Создаем экземпляры зависимых сервисов
          const scheduleService = new ScheduleService(hasyx)
          const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)
          const lessonSnapshotService = new LessonSnapshotService(hasyx)

          // Создаем сервис инсайтов
          const insightsService = new ProgressInsightsService(
            hasyx,
            lessonSnapshotService,
            shuHaRiService,
            scheduleService,
          )

          // Получаем инсайты для генерации плана
          const snapshotInsights = await insightsService.getSnapshotInsights(who.userId, days)

          return Response.json({
            success: true,
            snapshotInsights,
          })
        } catch (error: any) {
          console.error('[progress/insights POST] Error:', error)
          return Response.json(
            {
              error: error.message,
              stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
