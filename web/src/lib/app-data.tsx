/**
 * Общие данные приложения (план, пользователь, стрик) для layout и страниц.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { useDashboardData } from '@/hooks/useDashboardData'
import { useSession } from '@/lib/compat/hasyx'
import type { TaskView } from '@/components/app/dashboard/DashboardTab'

type VocabularyCardRaw = {
  id: string
  word: string
  translation: string
  example_sentence?: string | null
  next_review_date?: string | null
  difficulty?: string | null
}

type ProgressMetricRaw = {
  date: string
  words_learned: number
  tasks_completed: number
  study_minutes?: number | null
}

export type PlanTask = TaskView & {
  stage_id?: string | null
  task_date?: string | null
}

export type PlanAchievement = {
  id?: string
  type: string
  title: string
  description?: string | null
  icon?: string | null
  unlocked_at?: string
}

type AppDataValue = {
  userId: string
  userName: string
  currentLevel: string | null
  targetLevel: string
  streak: number
  isLoading: boolean
  error: string | null
  dashboard: ReturnType<typeof useDashboardData>['data']
  tasks: PlanTask[]
  todayMinutes: number
  goalMinutes: number
  vocabularyCards: Array<{
    id: string
    word: string
    translation: string
    exampleSentence?: string | null
    nextReview?: string | null
    difficulty?: string | null
  }>
  progressData: Array<{
    week: string
    words: number
    tasks: number
    studyMinutes?: number
  }>
  achievements: PlanAchievement[]
  completeTask: (taskId: string) => void
  regeneratePlan: ReturnType<typeof useDashboardData>['regeneratePlan']
  refreshRequirementChecks: ReturnType<typeof useDashboardData>['refreshRequirementChecks']
  refreshProgressMetrics: ReturnType<typeof useDashboardData>['refreshProgressMetrics']
  refreshVocabulary: ReturnType<typeof useDashboardData>['refreshVocabulary']
}

const AppDataContext = createContext<AppDataValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? ''
  const dash = useDashboardData(userId || null, { autoRefresh: false })

  const tasks = useMemo<PlanTask[]>(() => (dash.data?.plan?.tasks ?? []) as PlanTask[], [dash.data?.plan?.tasks])

  const todayMinutes = useMemo(
    () =>
      tasks.filter((t) => t.status === 'completed').reduce((sum, t) => sum + (t.duration_minutes ?? 0), 0),
    [tasks],
  )

  const vocabularyCards = useMemo(() => {
    const cards = (dash.data?.vocabularyCards ?? []) as VocabularyCardRaw[]
    return cards.map((card) => ({
      id: card.id,
      word: card.word,
      translation: card.translation,
      exampleSentence: card.example_sentence,
      nextReview: card.next_review_date,
      difficulty: card.difficulty,
    }))
  }, [dash.data?.vocabularyCards])

  const progressData = useMemo(() => {
    const metrics = (dash.data?.progressMetrics ?? []) as ProgressMetricRaw[]
    return metrics.map((metric) => ({
      week: metric.date,
      words: metric.words_learned,
      tasks: metric.tasks_completed,
      studyMinutes: metric.study_minutes ?? undefined,
    }))
  }, [dash.data?.progressMetrics])

  const achievements = useMemo<PlanAchievement[]>(
    () => (dash.data?.plan?.achievements ?? []) as PlanAchievement[],
    [dash.data?.plan?.achievements],
  )

  const streak = dash.data?.plan?.streak?.current_streak ?? 0

  const value: AppDataValue = {
    userId,
    userName: dash.data?.user?.name ?? session?.user?.name ?? 'Ученик',
    currentLevel: dash.data?.user?.current_level ?? null,
    targetLevel: dash.data?.user?.target_level ?? 'B2',
    streak,
    isLoading: dash.isLoading,
    error: dash.error,
    dashboard: dash.data,
    tasks,
    todayMinutes,
    goalMinutes: dash.data?.user?.daily_goal_minutes ?? 40,
    vocabularyCards,
    progressData,
    achievements,
    completeTask: (id) => dash.completeTask(id),
    regeneratePlan: dash.regeneratePlan,
    refreshRequirementChecks: dash.refreshRequirementChecks,
    refreshProgressMetrics: dash.refreshProgressMetrics,
    refreshVocabulary: dash.refreshVocabulary,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
