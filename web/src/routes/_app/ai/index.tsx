import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { AiSessionView } from '@/components/app/ai/AiSessionView'
import { useAppData, type PlanTask } from '@/lib/app-data'

type Search = { taskId?: string }

export const Route = createFileRoute('/_app/ai/')({
  component: AiPracticePage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    taskId: typeof s.taskId === 'string' ? s.taskId : undefined,
  }),
})

function AiPracticePage() {
  const { taskId } = Route.useSearch()
  const { tasks, userId, currentLevel } = useAppData()
  const task = useMemo<PlanTask | null>(() => {
    if (taskId) return tasks.find((t) => String(t.id) === taskId) ?? null
    return tasks.find((t) => t.ai_enabled) ?? null
  }, [taskId, tasks])

  return <AiSessionView userId={userId} currentLevel={currentLevel} task={task} kind="practice" />
}
