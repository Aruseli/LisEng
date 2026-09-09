
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/compat/hasyx';
import type { VerbWithProgress, GroupProgress } from '@/lib/verbs/verbs-service';
import { queryKeys } from '@/lib/query-keys';

interface VerbProgressStats {
  totalVerbs: number;
  learnedVerbs: number;
  masteredVerbs: number;
  weakVerbs: number;
  groups: GroupProgress[];
}

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
    enabled,
    queryFn: async () => {
      const [groupsResponse, weakResponse] = await Promise.all([
        fetch('/api/verbs/progress?type=groups'),
        fetch('/api/verbs/progress?type=weak&limit=10'),
      ]);
      if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
      if (!weakResponse.ok) throw new Error('Failed to fetch weak verbs');
      const groupsData = await groupsResponse.json();
      const weakData = await weakResponse.json();
      const groups: GroupProgress[] = groupsData.groups || [];
      const weak: VerbWithProgress[] = weakData.verbs || [];
      return {
        progress: {
          totalVerbs: groups.reduce((sum, g) => sum + g.total, 0),
          learnedVerbs: groups.reduce((sum, g) => sum + g.learned, 0),
          masteredVerbs: groups.reduce((sum, g) => sum + g.mastered, 0),
          weakVerbs: weak.length,
          groups,
        } as VerbProgressStats,
        weakVerbs: weak,
      };
    },
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
