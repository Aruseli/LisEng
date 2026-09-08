/**
 * Шим совместимости для UI-кода, портированного с hasyx.
 * Даёт те же хуки (useSession/useHasyx/useSubscription) поверх
 * better-auth + HasuraClient + TanStack Query.
 */
import { useQuery } from '@tanstack/react-query'

import { useSession as useAuthSession } from '#/lib/auth-client'
import { getUserClient } from '#/lib/hasura/hooks'
import type { QueryOptions } from '#/lib/hasura/client'

/**
 * Форма ответа как у hasyx/next-auth: { data: session, status }.
 * status: 'loading' | 'authenticated' | 'unauthenticated'
 */
export function useSession() {
  const { data, isPending } = useAuthSession()
  return {
    data,
    status: isPending ? ('loading' as const) : data ? ('authenticated' as const) : ('unauthenticated' as const),
  }
}

/** Клиент Hasura от имени пользователя (JWT), интерфейс идентичен hasyx-клиенту */
export function useHasyx() {
  return getUserClient()
}

const SUBSCRIPTION_POLL_MS = 30_000

/**
 * Замена hasyx useSubscription: поллинг через TanStack Query (30 сек).
 * Для текущего продукта (streaks) этого достаточно; при необходимости
 * реального времени можно заменить на graphql-ws напрямую к Hasura.
 */
export function useSubscription(options: QueryOptions) {
  const enabled = !!options.where || options.where === undefined
  const { data, isLoading, error } = useQuery({
    queryKey: ['hasura-sub', options],
    queryFn: () => getUserClient().select(options),
    refetchInterval: SUBSCRIPTION_POLL_MS,
    enabled,
  })
  return { data, loading: isLoading, error }
}
