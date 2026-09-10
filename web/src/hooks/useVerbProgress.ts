import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/compat/hasyx';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';
import { fetchVerbStats, type VerbProgressStats } from '@/lib/verbs/verbs-queries';
import { queryKeys } from '@/lib/query-keys';

interface ReviewSchedule {
  date: string;
  verbCount: number;
}

interface UseVerbProgressReturn {
  progress: VerbProgressStats | null;
  weakVerbs: VerbWithProgress[];
  upcomingReviews: ReviewSchedule[];
  isLoading: boolean;
  refresh: () => void;
}

export function useVerbProgress(): UseVerbProgressReturn {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const enabled = status === 'authenticated' && Boolean(userId);

  const query = useQuery({
    queryKey: [...queryKeys.verbs(userId ?? ''), 'stats'],
    staleTime: 300_000,
    enabled,
    queryFn: fetchVerbStats,
  });

  return {
    progress: query.data?.progress ?? null,
    weakVerbs: query.data?.weakVerbs ?? [],
    upcomingReviews: [] as ReviewSchedule[],
    isLoading: query.isLoading,
    refresh: () => {
      void query.refetch();
    },
  };
}
