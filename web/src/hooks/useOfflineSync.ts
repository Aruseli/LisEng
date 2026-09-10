import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useSession } from '@/lib/compat/hasyx'
import { flushMutationQueue } from '@/lib/offline/mutation-queue'

/**
 * Синхронизация офлайн-очереди мутаций.
 * Background Sync API на iOS не поддерживается, поэтому флашим:
 *  - при старте приложения;
 *  - на событии online;
 *  - при возврате во вкладку (visibilitychange).
 * Заодно запрашиваем persistent storage против эвикции IndexedDB на iOS.
 */
export function useOfflineSync() {
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (status !== 'authenticated' || !userId) return

    const flush = () => {
      void flushMutationQueue(queryClient, userId)
    }

    flush()

    window.addEventListener('online', flush)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') flush()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Просим систему не выкидывать IndexedDB под давлением памяти
    void navigator.storage?.persist?.().catch(() => {})

    return () => {
      window.removeEventListener('online', flush)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [status, userId, queryClient])
}
