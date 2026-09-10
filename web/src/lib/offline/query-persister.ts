import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
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
 */

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CACHE_BUSTER = 'liseng-v3'

/** Ключи, которые разрешено персистить (префиксное сравнение первого сегмента/пары). */
const PERSISTED_PREFIXES: ReadonlyArray<readonly string[]> = [
  ['verbs', 'catalog'], // инертный каталог
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

  persistQueryClient({
    queryClient,
    persister,
    maxAge: CACHE_MAX_AGE_MS,
    buster: CACHE_BUSTER,
    dehydrateOptions: { shouldDehydrateQuery },
  })
}
