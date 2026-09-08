import { Navigate, Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'

import { AddWordFab } from '@/components/app/AddWordFab'
import { Header } from '@/components/app/Header'
import { Navigation } from '@/components/app/Navigation'
import { RitualScreen } from '@/components/app/RitualScreen'
import { AppDataProvider, useAppData } from '@/lib/app-data'
import { useSession } from '@/lib/compat/hasyx'
import { useRitualStore } from '@/store/ritualStore'

export const Route = createFileRoute('/_app')({
  component: AppLayoutGate,
})

function AppLayoutGate() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user?.id) {
    return <Navigate to="/login" />
  }

  return (
    <AppDataProvider>
      <AuthenticatedShell />
    </AppDataProvider>
  )
}

function AuthenticatedShell() {
  const { userName, streak, isLoading, error, currentLevel, regeneratePlan } = useAppData()
  const { ritualCompleted, completeRitual } = useRitualStore()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!ritualCompleted || isLoading) return
    if (!currentLevel && pathname !== '/level-test') {
      navigate({ to: '/level-test' })
    }
  }, [ritualCompleted, isLoading, currentLevel, pathname, navigate])

  if (!ritualCompleted) {
    return <RitualScreen onComplete={completeRitual} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} streak={streak} />
      <Navigation onRefresh={() => void regeneratePlan()} isLoading={isLoading} />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24">
        {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <Outlet />
      </main>
      <AddWordFab />
    </div>
  )
}
