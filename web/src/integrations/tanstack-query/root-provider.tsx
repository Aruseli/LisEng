import { QueryClient } from '@tanstack/react-query'

import { setupQueryPersistence } from '@/lib/offline/query-persister'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 2 минуты: возврат на дашборд/словарь в пределах staleTime не дёргает рефетч
        staleTime: 120_000,
        refetchOnWindowFocus: true,
      },
    },
  })

  // Офлайн-персистентность кэша (IndexedDB через Dexie); на SSR — no-op
  if (typeof window !== 'undefined') {
    setupQueryPersistence(queryClient)
  }

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
