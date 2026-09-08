import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { LevelTestModal } from '@/components/app/LevelTestModal'
import { useAppData } from '@/lib/app-data'

export const Route = createFileRoute('/_app/level-test')({
  component: LevelTestPage,
})

function LevelTestPage() {
  const { userId, regeneratePlan } = useAppData()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <LevelTestModal
        userId={userId}
        onComplete={() => {
          void regeneratePlan()
          navigate({ to: '/' })
        }}
        onSkip={() => navigate({ to: '/' })}
      />
    </div>
  )
}
