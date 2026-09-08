/**
 * Хуки TanStack Query поверх Hasura-клиента.
 * Совместимы по опциям с hasyx useQuery: принимают options-объект генератора.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'

import { createUserClient } from './index'
import { getHasuraToken } from './token'
import type { QueryOptions } from './client'

let userClient: ReturnType<typeof createUserClient> | null = null

/** Клиент от имени текущего пользователя (JWT из token store) */
export function getUserClient() {
  if (!userClient) userClient = createUserClient(getHasuraToken)
  return userClient
}

/**
 * Запрос через генератор: useHasuraQuery({ table: 'streaks', where: {...}, returning: [...] })
 * queryKey строится из options автоматически.
 */
export function useHasuraQuery<T = any>(
  options: QueryOptions,
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey: ['hasura', options],
    queryFn: () => getUserClient().select<T>(options),
    ...queryOptions,
  })
}

type MutationKind = 'insert' | 'update' | 'delete' | 'upsert'

/**
 * Мутация через генератор с автоинвалидацией всех hasura-запросов этой таблицы.
 */
export function useHasuraMutation<T = any>(
  kind: MutationKind,
  mutationOptions?: Omit<UseMutationOptions<T, Error, QueryOptions>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()
  return useMutation<T, Error, QueryOptions>({
    mutationFn: (options) => getUserClient()[kind]<T>(options),
    onSuccess: (data, variables, ctx, mutation) => {
      // Инвалидация всех запросов по этой таблице
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey[0] === 'hasura' &&
          (q.queryKey[1] as QueryOptions | undefined)?.table === variables.table,
      })
      mutationOptions?.onSuccess?.(data, variables, ctx, mutation)
    },
    ...(mutationOptions
      ? Object.fromEntries(Object.entries(mutationOptions).filter(([k]) => k !== 'onSuccess'))
      : {}),
  })
}
