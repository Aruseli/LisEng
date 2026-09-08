import { createFileRoute } from '@tanstack/react-router'

import { ProgressTab } from '@/components/app/progress/ProgressTab'
import { useAppData } from '@/lib/app-data'

export const Route = createFileRoute('/_app/progress')({
  component: ProgressPage,
})

function ProgressPage() {
  const { isLoading, progressData, achievements, dashboard } = useAppData()
  return (
    <ProgressTab
      loading={isLoading}
      progressData={progressData}
      achievements={achievements}
      readiness={dashboard?.plan?.readiness ?? false}
      requirementChecks={dashboard?.plan?.requirementChecks ?? []}
    />
  )
}
