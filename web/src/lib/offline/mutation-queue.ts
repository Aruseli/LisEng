import type { QueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { getOfflineDb, type OfflineMutationType } from './db'

/**
 * Очередь офлайн-мутаций (IndexedDB через Dexie).
 * Background Sync на iOS не поддерживается, поэтому флашим на
 * online / visibilitychange / старте приложения (useOfflineSync).
 */

const ENDPOINTS: Record<OfflineMutationType, string> = {
  vocabulary_review: '/api/vocabulary/review',
  verb_practice: '/api/verbs/practice',
}

export async function enqueueMutation(
  type: OfflineMutationType,
  payload: Record<string, unknown>,
): Promise<void> {
  await getOfflineDb().mutationQueue.put({
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: Date.now(),
  })
}

export async function getPendingMutationCount(): Promise<number> {
  return getOfflineDb().mutationQueue.count()
}

let flushing = false

/**
 * Отправляет накопленные мутации по порядку (FIFO по createdAt).
 * Удаляет из очереди только успешные; при сетевой/серверной ошибке
 * прерывается — остаток дождётся следующего флаша.
 * Возвращает число успешно отправленных мутаций.
 */
export async function flushMutationQueue(
  queryClient?: QueryClient,
  userId?: string | null,
): Promise<number> {
  if (flushing) return 0
  flushing = true
  try {
    const db = getOfflineDb()
    const items = await db.mutationQueue.orderBy('createdAt').toArray()
    let flushed = 0

    for (const item of items) {
      try {
        const res = await fetch(ENDPOINTS[item.type], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        })
        if (!res.ok) break
        await db.mutationQueue.delete(item.id)
        flushed++
      } catch {
        // Сеть всё ещё недоступна
        break
      }
    }

    if (flushed > 0 && queryClient) {
      const tasks = [
        queryClient.invalidateQueries({ queryKey: ['vocabulary'] }),
      ]
      if (userId) {
        tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.verbs(userId) }))
      }
      await Promise.all(tasks)
    }

    return flushed
  } finally {
    flushing = false
  }
}
