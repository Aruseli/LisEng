import type { QueryClient } from '@tanstack/react-query'

export const queryKeys = {
  plan: (userId: string, date: string) => ['plan', userId, date] as const,
  stageRequirements: (userId: string) => ['stage-requirements', userId] as const,
  verbs: (userId: string) => ['verbs', userId] as const,
  verbCatalog: () => ['verbs', 'catalog'] as const,
  vocabulary: (userId: string) => ['vocabulary', userId] as const,
}

export async function invalidateLessonQueries(queryClient: QueryClient, userId?: string | null) {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: ['plan'] }),
    queryClient.invalidateQueries({ queryKey: ['stage-requirements'] }),
    queryClient.invalidateQueries({ queryKey: ['vocabulary'] }),
  ]
  if (userId) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.verbs(userId) }))
  }
  await Promise.all(tasks)
}

export async function invalidateVerbQueries(queryClient: QueryClient, userId?: string | null) {
  // ВАЖНО: не инвалидируем голый ['verbs'] — по префиксу он сносит и вечный
  // каталог ['verbs', 'catalog']. Инвалидируем только пользовательские данные:
  // ['verbs', userId] покрывает progress, groups и stats.
  if (userId) {
    await queryClient.invalidateQueries({ queryKey: queryKeys.verbs(userId) })
  }
}
