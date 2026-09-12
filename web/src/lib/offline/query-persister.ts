import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from '@tanstack/react-query-persist-client'
import { useSyncExternalStore } from 'react'
import type { Query, QueryClient } from '@tanstack/react-query'

import { getOfflineDb } from './db'

/**
 * Персистентность кэша TanStack Query в IndexedDB (Dexie, таблица kv).
 * Даёт мгновенный офлайн-старт: дашборд/словарь/глаголы рендерятся
 * из восстановленного кэша, сеть догоняет при появлении.
 *
 * Защита от протухших due-карточек:
 *  - maxAge 24ч — старше суток кэш выбрасывается;
 *  - buster — при смене версии приложения кэш инвалидируется целиком;
 *  - shouldDehydrateQuery — персистим только избранные ключи.
 *
 * Гейт гидрации: useQueryCacheRestored() сообщает, когда кэш восстановлен.
 * Без гейта запросы монтируются раньше окончания restore, видят пустой
 * кэш и уходят в сеть — спиннер даже при персистнутых данных.
 */

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CACHE_BUSTER = 'liseng-v4'

/** Ключи, которые разрешено персистить (префиксное сравнение сегментов). */
const PERSISTED_PREFIXES: ReadonlyArray<readonly string[]> = [
  ['verbs'], // каталог (инертный) + прогресс/группы/статистика пользователя
  ['plan'],
  ['vocabulary'],
]

function shouldDehydrateQuery(query: Query): boolean {
  if (query.state.status !== 'success') return false
  const key = query.queryKey as readonly unknown[]
  return PERSISTED_PREFIXES.some((prefix) =>
    prefix.every((segment, i) => key[i] === segment),
  )
}

// --- Состояние восстановления кэша (module-level синглтон) ---

// На сервере (SSR) гейт не нужен — считаем кэш сразу «восстановленным»
let restored = typeof window === 'undefined'
const restoreListeners = new Set<() => void>()

function markRestored() {
  if (restored) return
  restored = true
  restoreListeners.forEach((listener) => listener())
}

function subscribeRestore(listener: () => void): () => void {
  restoreListeners.add(listener)
  return () => restoreListeners.delete(listener)
}

/** true, когда кэш из IndexedDB восстановлен (на SSR — всегда true). */
export function useQueryCacheRestored(): boolean {
  return useSyncExternalStore(
    subscribeRestore,
    () => restored,
    () => true,
  )
}

let started = false

/**
 * Подключает персистер к queryClient. Идемпотентно.
 * Вызывать только на клиенте (в root-provider есть guard по window).
 */
export function setupQueryPersistence(queryClient: QueryClient): void {
  if (started || typeof window === 'undefined') return
  started = true

  const persister = createAsyncStoragePersister({
    storage: {
      getItem: async (key: string) => {
        const record = await getOfflineDb().kv.get(key)
        return (record?.value as string) ?? null
      },
      setItem: async (key: string, value: string) => {
        await getOfflineDb().kv.put({ key, value })
      },
      removeItem: async (key: string) => {
        await getOfflineDb().kv.delete(key)
      },
    },
  })

  const persistOptions = {
    queryClient,
    persister,
    maxAge: CACHE_MAX_AGE_MS,
    buster: CACHE_BUSTER,
    dehydrateOptions: { shouldDehydrateQuery },
  } as const

  // Сначала восстановление (promise → гейт), затем подписка на запись
  void persistQueryClientRestore(persistOptions)
    .catch((error) => console.warn('[offline] cache restore failed:', error))
    .finally(markRestored)
  persistQueryClientSubscribe(persistOptions)
}
