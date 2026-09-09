
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/compat/hasyx';
import type { VerbWithProgress, GroupProgress } from '@/lib/verbs/verbs-service';
import { queryKeys } from '@/lib/query-keys';

interface UseIrregularVerbsDataOptions {
  group?: number;
  frequency?: 'must_know' | 'high' | 'medium' | 'low';
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
  filterByFrequency: (freq: 'must_know' | 'high' | 'medium' | 'low' | undefined) => void;
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
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('includeExamples', 'true');
      const response = await fetch(`/api/verbs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch verbs');
      const data = await response.json();
      return (data.verbs || []) as VerbWithProgress[];
    },
  });

  const progressQuery = useQuery({
    queryKey: queryKeys.verbs(userId ?? ''),
    staleTime: 30_000,
    enabled: enabled && Boolean(filters.includeProgress),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.group) params.append('group', filters.group.toString());
      if (filters.frequency) params.append('frequency', filters.frequency);
      params.append('includeProgress', 'true');
      params.append('includeExamples', filters.includeExamples ? 'true' : 'false');
      const response = await fetch(`/api/verbs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch verbs');
      const data = await response.json();
      return (data.verbs || []) as VerbWithProgress[];
    },
  });

  const groupsQuery = useQuery({
    queryKey: [...queryKeys.verbs(userId ?? ''), 'groups'],
    staleTime: 30_000,
    enabled,
    queryFn: async () => {
      const response = await fetch('/api/verbs/progress?type=groups');
      if (!response.ok) throw new Error('Failed to fetch groups progress');
      const data = await response.json();
      return (data.groups || []) as GroupProgress[];
    },
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
