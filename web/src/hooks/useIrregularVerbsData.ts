import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/compat/hasyx';
import type { VerbWithProgress, GroupProgress } from '@/lib/verbs/verbs-service';
import {
  fetchVerbCatalog,
  fetchVerbGroups,
  fetchVerbProgress,
  type VerbFrequency,
} from '@/lib/verbs/verbs-queries';
import { queryKeys } from '@/lib/query-keys';

interface UseIrregularVerbsDataOptions {
  group?: number;
  frequency?: VerbFrequency;
  includeProgress?: boolean;
  includeExamples?: boolean;
}

interface UseIrregularVerbsDataReturn {
  verbs: VerbWithProgress[];
  groups: GroupProgress[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  filterByGroup: (group: number | undefined) => void;
  filterByFrequency: (freq: VerbFrequency | undefined) => void;
}

export function useIrregularVerbsData(
  options: UseIrregularVerbsDataOptions = {}
): UseIrregularVerbsDataReturn {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [filters, setFilters] = useState<UseIrregularVerbsDataOptions>(options);
  const enabled = status === 'authenticated' && Boolean(userId);

  const catalogQuery = useQuery({
    queryKey: queryKeys.verbCatalog(),
    staleTime: Infinity,
    enabled,
    queryFn: fetchVerbCatalog,
  });

  const progressQuery = useQuery({
    queryKey: queryKeys.verbs(userId ?? ''),
    staleTime: 300_000,
    enabled: enabled && Boolean(filters.includeProgress),
    queryFn: () =>
      fetchVerbProgress({
        group: filters.group,
        frequency: filters.frequency,
        includeExamples: filters.includeExamples,
      }),
  });

  const groupsQuery = useQuery({
    queryKey: [...queryKeys.verbs(userId ?? ''), 'groups'],
    staleTime: 300_000,
    enabled,
    queryFn: fetchVerbGroups,
  });

  const verbs = progressQuery.data ?? catalogQuery.data ?? [];

  const refresh = useCallback(() => {
    void catalogQuery.refetch();
    void progressQuery.refetch();
    void groupsQuery.refetch();
  }, [catalogQuery, progressQuery, groupsQuery]);

  return {
    verbs,
    groups: groupsQuery.data ?? [],
    isLoading: (catalogQuery.isLoading || progressQuery.isLoading) && verbs.length === 0,
    error: (progressQuery.error as Error | null)?.message ?? (catalogQuery.error as Error | null)?.message ?? null,
    refresh,
    filterByGroup: (group) => setFilters((prev) => ({ ...prev, group })),
    filterByFrequency: (freq) => setFilters((prev) => ({ ...prev, frequency: freq })),
  };
}
