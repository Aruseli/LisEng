
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useHasyx } from '@/lib/compat/hasyx';
import { useHasuraReady } from '@/lib/hasura/useHasuraToken';
import { queryKeys } from '@/lib/query-keys';

import type { DailyPlanResult } from '@/lib/plan/daily-plan-service';
import type { RequirementCheck } from '@/lib/stage-progression';

interface DashboardData {
  plan: DailyPlanResult | null;
  user: any;
  vocabularyCards: any[];
  progressMetrics: any[];
  lastUpdatedAt: string | null;
}

interface UseDashboardDataOptions {
  date?: string;
  autoRefresh?: boolean;
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useDashboardData = (
  userId?: string | null,
  options: UseDashboardDataOptions = {}
) => {
  const hasyx = useHasyx();
  const hasuraReady = useHasuraReady();
  const queryClient = useQueryClient();

  const targetDate = useMemo(() => options.date || todayIso(), [options.date]);
  const enabled = Boolean(hasyx && userId && hasuraReady);

  const planQuery = useQuery({
    queryKey: queryKeys.plan(userId ?? '', targetDate),
    enabled,
    queryFn: async () => {
      const planResponse = await fetch(
        `/api/plan/today?userId=${encodeURIComponent(userId!)}&date=${encodeURIComponent(targetDate)}`
      );
      if (!planResponse.ok) {
        const errorBody = await planResponse.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось получить план на сегодня');
      }
      const { plan } = (await planResponse.json()) as { plan: DailyPlanResult };

      const [userProfile, progressMetrics] = await Promise.all([
        hasyx.select({
          table: 'users',
          pk_columns: { id: userId! },
          returning: [
            'id',
            'name',
            'current_level',
            'target_level',
            'daily_goal_minutes',
            'study_place',
            'study_time',
            'instruction_language',
          ],
        }),
        hasyx.select({
          table: 'progress_metrics',
          where: { user_id: { _eq: userId! } },
          order_by: [{ date: 'desc' }],
          limit: 8,
          returning: [
            'date',
            'words_learned',
            'tasks_completed',
            'study_minutes',
            'accuracy_grammar',
            'accuracy_vocabulary',
            'accuracy_listening',
            'accuracy_reading',
            'accuracy_writing',
          ],
        }),
      ]);

      return {
        plan,
        user: userProfile,
        progressMetrics: Array.isArray(progressMetrics) ? progressMetrics : [],
        lastUpdatedAt: new Date().toISOString(),
      };
    },
  });

  const vocabQuery = useQuery({
    queryKey: queryKeys.vocabulary(userId ?? ''),
    enabled,
    queryFn: async () => {
      const vocabularyCards = await hasyx.select({
        table: 'vocabulary_cards',
        where: {
          user_id: { _eq: userId! },
          next_review_date: { _lte: targetDate },
        },
        order_by: [{ next_review_date: 'asc' }],
        limit: 20,
        returning: [
          'id',
          'word',
          'translation',
          'example_sentence',
          'next_review_date',
          'difficulty',
        ],
      });
      return Array.isArray(vocabularyCards) ? vocabularyCards : [];
    },
  });

  const stageId = planQuery.data?.plan?.stage?.id;
  const requirementsQuery = useQuery({
    queryKey: queryKeys.stageRequirements(userId ?? ''),
    enabled: enabled && Boolean(stageId),
    queryFn: async () => {
      const response = await fetch(
        `/api/plan/requirement-checks?userId=${encodeURIComponent(userId!)}&stageId=${encodeURIComponent(stageId!)}`
      );
      if (!response.ok) {
        throw new Error('Не удалось получить требования этапа');
      }
      const body = await response.json();
      return (body.requirementChecks ?? []) as RequirementCheck[];
    },
  });

  const data = useMemo<DashboardData | null>(() => {
    if (!planQuery.data) return null;
    const requirementChecks = requirementsQuery.data ?? planQuery.data.plan?.requirementChecks ?? [];
    return {
      plan: planQuery.data.plan
        ? { ...planQuery.data.plan, requirementChecks }
        : null,
      user: planQuery.data.user,
      vocabularyCards: vocabQuery.data ?? [],
      progressMetrics: planQuery.data.progressMetrics,
      lastUpdatedAt: planQuery.data.lastUpdatedAt,
    };
  }, [planQuery.data, vocabQuery.data, requirementsQuery.data]);

  const regenerateMutation = useMutation({
    mutationFn: async (params?: { forceAi?: boolean }) => {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: targetDate,
          regenerate: true,
          forceAi: params?.forceAi ?? false,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось сгенерировать план');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plan'] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.stageRequirements(userId ?? '') });
    },
  });

  const fetchDashboard = useCallback(async () => {
    await Promise.all([
      planQuery.refetch(),
      vocabQuery.refetch(),
      requirementsQuery.refetch(),
    ]);
  }, [planQuery, vocabQuery, requirementsQuery]);

  const regeneratePlan = useCallback(
    async (params?: { forceAi?: boolean }) => {
      if (!userId) return;
      await regenerateMutation.mutateAsync(params);
    },
    [regenerateMutation, userId]
  );

  const refreshRequirementChecks = useCallback(async () => {
    if (!userId) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.stageRequirements(userId) });
  }, [queryClient, userId]);

  const refreshVocabulary = useCallback(async () => {
    if (!userId) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary(userId) });
  }, [queryClient, userId]);

  const refreshProgressMetrics = useCallback(async () => {
    if (!userId) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.plan(userId, targetDate) });
  }, [queryClient, userId, targetDate]);

  const completeTask = useCallback(
    async (taskId: string) => {
      if (!hasyx || !userId) return;

      queryClient.setQueryData(
        queryKeys.plan(userId, targetDate),
        (prev: typeof planQuery.data) => {
          if (!prev?.plan) return prev;
          return {
            ...prev,
            plan: {
              ...prev.plan,
              tasks: prev.plan.tasks.map((task: any) =>
                task.id === taskId ? { ...task, status: 'completed' } : task
              ),
            },
          };
        }
      );

      try {
        await hasyx.update({
          table: 'daily_tasks',
          pk_columns: { id: taskId },
          _set: {
            status: 'completed',
            completed_at: new Date().toISOString(),
          },
          returning: ['id'],
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.plan(userId, targetDate) }),
          queryClient.invalidateQueries({ queryKey: queryKeys.stageRequirements(userId) }),
        ]);
      } catch (error) {
        console.error('Failed to complete task:', error);
        await fetchDashboard();
      }
    },
    [hasyx, queryClient, userId, targetDate, fetchDashboard]
  );

  const isLoading =
    enabled &&
    (planQuery.isLoading || vocabQuery.isLoading) &&
    !data;
  const error =
    (planQuery.error as Error | null)?.message ??
    (vocabQuery.error as Error | null)?.message ??
    (regenerateMutation.error as Error | null)?.message ??
    null;

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboard,
    regeneratePlan,
    completeTask,
    refreshRequirementChecks,
    refreshProgressMetrics,
    refreshVocabulary,
    targetDate,
  };
}
