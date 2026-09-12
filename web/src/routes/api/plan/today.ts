import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { DailyPlanService } from '@/lib/plan/daily-plan-service'
import {
  LessonSnapshotService,
  ShuHaRiService,
  ProgressInsightsService,
  ScheduleService,
} from '@/lib/lesson-snapshots'

export const Route = createFileRoute('/api/plan/today')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url)
          const userId = searchParams.get('userId') ?? undefined
          const targetDate = searchParams.get('date') ?? undefined
          // Клиент выставляет autogen=1, когда запрашивает свою сегодняшнюю
          // (локальную) дату — тогда при пустом дне план генерируется сам
          const autogen = searchParams.get('autogen') === '1'

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

          const service = new DailyPlanService(hasyx, progressInsightsService)
          const plan = await service.getDailyPlan(userId, targetDate ?? undefined, { autogen })

          return Response.json({ plan })
        } catch (error: any) {
          console.error('[plan/today] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to load plan' },
            { status: 500 },
          )
        }
      },
    },
  },
})
