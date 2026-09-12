import type { VerbWithProgress, GroupProgress } from './verbs-service'

/**
 * Общие queryFn для verbs-данных.
 * Вынесены из хуков, чтобы переиспользовать в useDashboardData (загрузка при старте сессии).
 * Авторизация — по сессионной cookie, userId нужен только в queryKey.
 */

export type VerbFrequency = 'must_know' | 'high' | 'medium' | 'low'

export interface VerbProgressFilters {
  group?: number
  frequency?: VerbFrequency
  includeExamples?: boolean
}

export interface VerbProgressStats {
  totalVerbs: number
  learnedVerbs: number
  masteredVerbs: number
  weakVerbs: number
  groups: GroupProgress[]
}

export interface VerbStatsResult {
  progress: VerbProgressStats
  weakVerbs: VerbWithProgress[]
}

/** Инертный каталог неправильных глаголов (с примерами). Меняется только при деплое сидов. */
export async function fetchVerbCatalog(): Promise<VerbWithProgress[]> {
  const params = new URLSearchParams()
  params.append('includeExamples', 'true')
  const response = await fetch(`/api/verbs?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch verbs')
  const data = await response.json()
  return (data.verbs || []) as VerbWithProgress[]
}

/** Каталог, соединённый с прогрессом пользователя. */
export async function fetchVerbProgress(
  filters: VerbProgressFilters = {},
): Promise<VerbWithProgress[]> {
  const params = new URLSearchParams()
  if (filters.group) params.append('group', filters.group.toString())
  if (filters.frequency) params.append('frequency', filters.frequency)
  params.append('includeProgress', 'true')
  params.append('includeExamples', filters.includeExamples ? 'true' : 'false')
  const response = await fetch(`/api/verbs?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch verbs')
  const data = await response.json()
  return (data.verbs || []) as VerbWithProgress[]
}

/** Прогресс по группам глаголов. */
export async function fetchVerbGroups(): Promise<GroupProgress[]> {
  const response = await fetch('/api/verbs/progress?type=groups')
  if (!response.ok) throw new Error('Failed to fetch groups progress')
  const data = await response.json()
  return (data.groups || []) as GroupProgress[]
}

/** Сводная статистика: группы + слабые глаголы. */
export async function fetchVerbStats(): Promise<VerbStatsResult> {
  const [groupsResponse, weakResponse] = await Promise.all([
    fetch('/api/verbs/progress?type=groups'),
    fetch('/api/verbs/progress?type=weak&limit=10'),
  ])
  if (!groupsResponse.ok) throw new Error('Failed to fetch groups')
  if (!weakResponse.ok) throw new Error('Failed to fetch weak verbs')
  const groupsData = await groupsResponse.json()
  const weakData = await weakResponse.json()
  const groups: GroupProgress[] = groupsData.groups || []
  const weak: VerbWithProgress[] = weakData.verbs || []
  return {
    progress: {
      totalVerbs: groups.reduce((sum, g) => sum + g.total, 0),
      learnedVerbs: groups.reduce((sum, g) => sum + g.learned, 0),
      masteredVerbs: groups.reduce((sum, g) => sum + g.mastered, 0),
      weakVerbs: weak.length,
      groups,
    },
    weakVerbs: weak,
  }
}
