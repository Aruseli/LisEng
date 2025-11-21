'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { IrregularVerb, VerbWithProgress, GroupProgress } from '@/lib/verbs/verbs-service';

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
  const { data: session } = useSession();
  const [verbs, setVerbs] = useState<VerbWithProgress[]>([]);
  const [groups, setGroups] = useState<GroupProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseIrregularVerbsDataOptions>(options);

  const fetchVerbs = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.group) params.append('group', filters.group.toString());
      if (filters.frequency) params.append('frequency', filters.frequency);
      if (filters.includeProgress) params.append('includeProgress', 'true');
      if (filters.includeExamples) params.append('includeExamples', 'true');

      const response = await fetch(`/api/verbs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch verbs');
      }

      const data = await response.json();
      setVerbs(data.verbs || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load verbs');
      console.error('[useIrregularVerbsData] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, filters]);

  const fetchGroups = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    try {
      const response = await fetch('/api/verbs/progress?type=groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups progress');
      }

      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err: any) {
      console.error('[useIrregularVerbsData] Error fetching groups:', err);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchVerbs();
    fetchGroups();
  }, [fetchVerbs, fetchGroups]);

  const filterByGroup = useCallback((group: number | undefined) => {
    setFilters((prev) => ({ ...prev, group }));
  }, []);

  const filterByFrequency = useCallback((freq: 'must_know' | 'high' | 'medium' | 'low' | undefined) => {
    setFilters((prev) => ({ ...prev, frequency: freq }));
  }, []);

  const refresh = useCallback(() => {
    fetchVerbs();
    fetchGroups();
  }, [fetchVerbs, fetchGroups]);

  return {
    verbs,
    groups,
    isLoading,
    error,
    refresh,
    filterByGroup,
    filterByFrequency,
  };
}

