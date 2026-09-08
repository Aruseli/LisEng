/**
 * Шим совместимости для UI-кода, портированного с hasyx.
 */
import { useQuery } from '@tanstack/react-query'

import { useSession as useAuthSession } from '#/lib/auth-client'
import { getUserClient } from '#/lib/hasura/hooks'
import { useHasuraReady } from '#/lib/hasura/useHasuraToken'
import type { QueryOptions } from '#/lib/hasura/client'

export function useSession() {
  const { data, isPending } = useAuthSession()
  return {
    data,
    status: isPending ? ('loading' as const) : data ? ('authenticated' as const) : ('unauthenticated' as const),
  }
}

export function useHasyx() {
  return getUserClient()
}

const SUBSCRIPTION_POLL_MS = 30_000

export function useSubscription(options: QueryOptions) {
  const ready = useHasuraReady()
  const hasWhere = options.where !== undefined
  const enabled = ready && (hasWhere ? true : options.where === undefined)
  const { data, isLoading, error } = useQuery({
    queryKey: ['hasura-sub', options],
    queryFn: () => getUserClient().select(options),
    refetchInterval: SUBSCRIPTION_POLL_MS,
    enabled: enabled && !!options.where,
  })
  return { data, loading: isLoading, error }
}
