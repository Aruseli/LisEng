import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { AiSessionView } from '@/components/app/ai/AiSessionView'
import { useAppData, type PlanTask } from '@/lib/app-data'

export const Route = createFileRoute('/_app/ai/voice/$taskId')({
  component: VoicePage,
})

function VoicePage() {
  const { taskId } = Route.useParams()
  const { tasks, userId, currentLevel } = useAppData()
  const task = useMemo<PlanTask | null>(
    () =>
      tasks.find((t) => String(t.id) === taskId) ??
      ({ id: taskId, type: 'ai_practice', title: 'Запись голосовых сообщений', status: 'pending' } as PlanTask),
    [tasks, taskId],
  )
  return <AiSessionView userId={userId} currentLevel={currentLevel} task={task} kind="voice" />
}
