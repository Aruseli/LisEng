import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import {
  getActiveStageProgress,
  getStageRequirements,
  getWeeklyStructureForStage,
  getLatestProgressMetric,
  updateStageProgressStats,
} from '@/lib/hasura-queries'
import { StageProgressionService } from '@/lib/stage-progression'

export const Route = createFileRoute('/api/plan/requirement-checks')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { searchParams } = new URL(request.url)
          const userId = searchParams.get('userId') ?? undefined
          const stageId = searchParams.get('stageId') ?? undefined

          if (!userId || !stageId) {
            return Response.json(
              { error: 'userId and stageId are required' },
              { status: 400 },
            )
          }

          const hasyx = getAdminClient()

          // Получаем данные для вычисления requirementChecks
          const [stageProgress, requirements, weeklyStructure, latestMetrics] =
            await Promise.all([
              getActiveStageProgress(hasyx, userId),
              getStageRequirements(hasyx, stageId),
              getWeeklyStructureForStage(hasyx, stageId),
              getLatestProgressMetric(hasyx, userId),
            ])

          if (!stageProgress || !Array.isArray(requirements) || requirements.length === 0) {
            return Response.json({ requirementChecks: [] })
          }

          const averageAccuracyFromMetrics =
            StageProgressionService.calculateAverageAccuracy(latestMetrics ?? {})

          const stageProgressData = {
            tasks_completed: stageProgress.tasks_completed ?? 0,
            tasks_total:
              stageProgress.tasks_total ??
              (Array.isArray(weeklyStructure) ? weeklyStructure.length : 0),
            words_learned: stageProgress.words_learned ?? 0,
            errors_pending: stageProgress.errors_pending ?? 0,
            average_accuracy:
              stageProgress.average_accuracy ?? averageAccuracyFromMetrics ?? 0,
            status: (stageProgress.status ??
              'in_progress') as Parameters<
              typeof StageProgressionService.checkStageRequirements
            >[0]['status'],
          }

          // Обновляем average_accuracy если нужно
          if (
            stageProgress?.id &&
            typeof averageAccuracyFromMetrics === 'number' &&
            !stageProgress.average_accuracy
          ) {
            await updateStageProgressStats(hasyx, stageProgress.id, {
              averageAccuracy: averageAccuracyFromMetrics,
            })
          }

          const requirementChecks = StageProgressionService.checkStageRequirements(
            stageProgressData,
            requirements,
          )

          return Response.json({ requirementChecks })
        } catch (error: any) {
          console.error('[plan/requirement-checks] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to load requirement checks' },
            { status: 500 },
          )
        }
      },
    },
  },
})
