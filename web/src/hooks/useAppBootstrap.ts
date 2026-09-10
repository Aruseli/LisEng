import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useSession } from '@/lib/compat/hasyx'
import { queryKeys } from '@/lib/query-keys'
import {
  fetchVerbCatalog,
  fetchVerbGroups,
  fetchVerbProgress,
  fetchVerbStats,
} from '@/lib/verbs/verbs-queries'

/**
 * Фоновый прогрев данных сессии после авторизации.
 * Дашборд (план + словарь) грузится через AppDataProvider сам;
 * здесь параллельно догружаем verbs-данные, чтобы /verbs и /progress
 * открывались мгновенно из кэша. Не блокирует рендер.
 */
export function useAppBootstrap() {
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    if (status !== 'authenticated' || !userId) return
    startedRef.current = true

    // Инертный каталог — вечный staleTime, как в useIrregularVerbsData
    void queryClient.prefetchQuery({
      queryKey: queryKeys.verbCatalog(),
      staleTime: Infinity,
      queryFn: fetchVerbCatalog,
    })
    // Прогресс — с теми же фильтрами, что запрашивает /verbs (includeExamples: true),
    // иначе экран получил бы из кэша каталог без примеров
    void queryClient.prefetchQuery({
      queryKey: queryKeys.verbs(userId),
      staleTime: 300_000,
      queryFn: () => fetchVerbProgress({ includeExamples: true }),
    })
    void queryClient.prefetchQuery({
      queryKey: [...queryKeys.verbs(userId), 'groups'],
      staleTime: 300_000,
      queryFn: fetchVerbGroups,
    })
    void queryClient.prefetchQuery({
      queryKey: [...queryKeys.verbs(userId), 'stats'],
      staleTime: 300_000,
      queryFn: fetchVerbStats,
    })
  }, [status, userId, queryClient])
}
