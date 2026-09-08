import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { DashboardTab } from '@/components/app/dashboard/DashboardTab'
import { useAppData } from '@/lib/app-data'
import { getTaskLocation } from '@/lib/task-routes'

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const data = useAppData()

  return (
    <DashboardTab
      loading={data.isLoading}
      userName={data.userName}
      currentLevel={data.currentLevel ?? 'A2'}
      targetLevel={data.targetLevel}
      todayMinutes={data.todayMinutes}
      goalMinutes={data.goalMinutes}
      tasks={data.tasks}
      onCompleteTask={(id) => data.completeTask(String(id))}
      onStartTask={(task) => {
        const loc = getTaskLocation(task)
        navigate({ to: loc.to as any, params: loc.params as any, search: loc.search as any })
      }}
      onStartAICoach={() => navigate({ to: '/ai' })}
      planSummary={data.dashboard?.plan?.summary ?? ''}
      planFocus={data.dashboard?.plan?.focus ?? []}
      requirementChecks={data.dashboard?.plan?.requirementChecks ?? []}
    />
  )
}
