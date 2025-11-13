'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from 'hasyx';

import type { DailyPlanResult } from '@/lib/plan/daily-plan-service';

interface DashboardData {
  plan: DailyPlanResult | null;
  user: any;
  vocabularyCards: any[];
  progressMetrics: any[];
  lastUpdatedAt: string | null;
}

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

interface UseDashboardDataOptions {
  date?: string;
  autoRefresh?: boolean;
}

export function useDashboardData(
  userId?: string | null,
  options: UseDashboardDataOptions = {}
) {
  const client = useClient();
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: Boolean(userId),
    error: null,
  });
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetDate = useMemo(() => {
    if (options.date) return options.date;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [options.date]);

  const fetchDashboard = useCallback(async () => {
    if (!client || !userId) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const planResponse = await fetch(
        `/api/plan/today?userId=${encodeURIComponent(userId)}&date=${encodeURIComponent(
          targetDate
        )}`
      );

      if (!planResponse.ok) {
        const errorBody = await planResponse.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось получить план на сегодня');
      }

      const { plan } = (await planResponse.json()) as { plan: DailyPlanResult };

      const [userProfile, vocabularyCards, progressMetrics] = await Promise.all([
        client.select({
          table: 'users',
          pk_columns: { id: userId },
          returning: [
            'id',
            'name',
            'current_level',
            'target_level',
            'daily_goal_minutes',
            'study_place',
            'study_time',
          ],
        }),
        client.select({
          table: 'vocabulary_cards',
          where: {
            user_id: { _eq: userId },
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
        }),
        client.select({
          table: 'progress_metrics',
          where: {
            user_id: { _eq: userId },
          },
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

      setState({
        isLoading: false,
        error: null,
        data: {
          plan,
          user: userProfile,
          vocabularyCards: Array.isArray(vocabularyCards) ? vocabularyCards : [],
          progressMetrics: Array.isArray(progressMetrics) ? progressMetrics : [],
          lastUpdatedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message ?? 'Не удалось обновить данные дашборда',
      }));
    }
  }, [client, targetDate, userId]);

  const scheduleAutoRefresh = useCallback(() => {
    if (!options.autoRefresh) {
      return;
    }
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      fetchDashboard().catch(() => {
        // Ошибку уже обработали в fetchDashboard
      });
    }, 60_000);
  }, [fetchDashboard, options.autoRefresh]);

  useEffect(() => {
    if (!client || !userId) {
      return;
    }
    fetchDashboard().then(scheduleAutoRefresh).catch(() => {
      // Ошибку обрабатывает fetchDashboard
    });

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [client, userId, fetchDashboard, scheduleAutoRefresh]);

  const regeneratePlan = useCallback(
    async (params?: { forceAi?: boolean }) => {
      if (!userId) return;

      try {
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

        await fetchDashboard();
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error?.message ?? 'Ошибка при генерации плана',
        }));
      }
    },
    [fetchDashboard, targetDate, userId]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      if (!client) return;

      setState((prev) => {
        if (!prev.data?.plan) {
          return prev;
        }
        const updatedTasks = prev.data.plan.tasks.map((task: any) =>
          task.id === taskId ? { ...task, status: 'completed' } : task
        );
        return {
          ...prev,
          data: {
            ...prev.data,
            plan: {
              ...prev.data.plan,
              tasks: updatedTasks,
            },
          },
        };
      });

      try {
        await client.update({
          table: 'daily_tasks',
          pk_columns: { id: taskId },
          _set: {
            status: 'completed',
            completed_at: new Date().toISOString(),
          },
          returning: ['id'],
        });
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error?.message ?? 'Не удалось отметить задание выполненным',
        }));
        await fetchDashboard();
      }
    },
    [client, fetchDashboard]
  );

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refresh: fetchDashboard,
    regeneratePlan,
    completeTask,
    targetDate,
  };
}


