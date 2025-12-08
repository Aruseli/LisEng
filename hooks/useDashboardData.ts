'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHasyx } from 'hasyx';

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

export const useDashboardData = (
  userId?: string | null,
  options: UseDashboardDataOptions = {}
) => {
  const hasyx = useHasyx();
  // Используем sessionStorage для сохранения данных между навигациями
  const storageKey = userId ? `dashboard_data_${userId}` : null;
  const [state, setState] = useState<DashboardState>(() => {
    // Пытаемся восстановить данные из sessionStorage
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Проверяем, что данные не устарели (не старше 5 минут)
          if (parsed.lastUpdatedAt) {
            const age = Date.now() - new Date(parsed.lastUpdatedAt).getTime();
            if (age < 5 * 60 * 1000) { // 5 минут
              return {
                data: parsed,
                isLoading: false,
                error: null,
              };
            }
          }
        }
      } catch (e) {
        // Игнорируем ошибки парсинга
      }
    }
    return {
      data: null,
      isLoading: Boolean(userId),
      error: null,
    };
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
    if (!hasyx || !userId) {
      return;
    }

    // Не показываем загрузку, если данные уже есть (оптимистичное обновление)
    const hasExistingData = state.data !== null;
    setState((prev) => ({ ...prev, isLoading: !hasExistingData, error: null }));

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
        hasyx.select({
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
        hasyx.select({
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
        hasyx.select({
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

      const newData = {
        plan,
        user: userProfile,
        vocabularyCards: Array.isArray(vocabularyCards) ? vocabularyCards : [],
        progressMetrics: Array.isArray(progressMetrics) ? progressMetrics : [],
        lastUpdatedAt: new Date().toISOString(),
      };

      setState({
        isLoading: false,
        error: null,
        data: newData,
      });

      // Сохраняем данные в sessionStorage для восстановления при навигации
      if (storageKey && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (e) {
          // Игнорируем ошибки сохранения (например, если storage переполнен)
        }
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message ?? 'Не удалось обновить данные дашборда',
      }));
    }
  }, [hasyx, targetDate, userId]);

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

  // Используем useRef для отслеживания последнего загруженного userId/targetDate
  const lastFetchedRef = useRef<{ userId?: string | null; targetDate?: string }>({});
  
  // Устанавливаем lastFetchedRef при восстановлении данных из sessionStorage
  useEffect(() => {
    if (state.data && userId && !lastFetchedRef.current.userId) {
      lastFetchedRef.current = { 
        userId, 
        targetDate: state.data.plan?.date || targetDate 
      };
    }
  }, [state.data, userId, targetDate]);
  
  useEffect(() => {
    if (!hasyx || !userId) {
      return;
    }
    
    // Проверяем видимость вкладки - не обновляем данные, если вкладка не видна
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }
    
    // Если данные уже загружены из sessionStorage и соответствуют текущему userId/targetDate,
    // не загружаем их повторно
    if (state.data && 
        lastFetchedRef.current.userId === userId && 
        lastFetchedRef.current.targetDate === targetDate) {
      return;
    }
    
    // Загружаем данные только если изменился userId или targetDate
    // ИЛИ если данных нет вообще
    const shouldFetch = 
      lastFetchedRef.current.userId !== userId || 
      lastFetchedRef.current.targetDate !== targetDate ||
      state.data === null;
    
    if (shouldFetch) {
      lastFetchedRef.current = { userId, targetDate };
      fetchDashboard().catch(() => {
        // Ошибку обрабатывает fetchDashboard
      });
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [hasyx, userId, targetDate, fetchDashboard, state.data]);

  const regeneratePlan = useCallback(
    async (params?: { forceAi?: boolean }) => {
      if (!userId) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

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
          isLoading: false,
          error: error?.message ?? 'Ошибка при генерации плана',
        }));
      }
    },
    [fetchDashboard, targetDate, userId]
  );

  // Функция для сохранения данных в sessionStorage
  const saveToStorage = useCallback((data: DashboardData | null) => {
    if (storageKey && typeof window !== 'undefined' && data) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        // Игнорируем ошибки сохранения
      }
    }
  }, [storageKey]);

  const refreshRequirementChecks = useCallback(async () => {
    if (!hasyx || !userId || !state.data?.plan?.stage?.id) {
      return;
    }

    try {
      // Получаем обновленные requirementChecks через API
      const response = await fetch(
        `/api/plan/requirement-checks?userId=${encodeURIComponent(userId)}&stageId=${encodeURIComponent(
          state.data.plan.stage.id
        )}`
      );

      if (response.ok) {
        const { requirementChecks } = await response.json();
        setState((prev) => {
          if (!prev.data?.plan) {
            return prev;
          }
          const newData = {
            ...prev.data,
            plan: {
              ...prev.data.plan,
              requirementChecks: requirementChecks || [],
            },
          };
          saveToStorage(newData);
          return {
            ...prev,
            data: newData,
          };
        });
      }
    } catch (error) {
      console.warn('Failed to refresh requirement checks:', error);
    }
  }, [hasyx, userId, state.data?.plan?.stage?.id, saveToStorage]);

  const refreshProgressMetrics = useCallback(async () => {
    if (!hasyx || !userId) {
      return;
    }

    try {
      const progressMetrics = await hasyx.select({
        table: 'progress_metrics',
        where: { user_id: { _eq: userId } },
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
      });

      setState((prev) => {
        if (!prev.data) {
          return prev;
        }
        const newData = {
          ...prev.data,
          progressMetrics: Array.isArray(progressMetrics) ? progressMetrics : [],
        };
        saveToStorage(newData);
        return {
          ...prev,
          data: newData,
        };
      });
    } catch (error) {
      console.warn('Failed to refresh progress metrics:', error);
    }
  }, [hasyx, userId, saveToStorage]);

  const completeTask = useCallback(
    async (taskId: string) => {
      if (!hasyx) return;

      setState((prev) => {
        if (!prev.data?.plan) {
          return prev;
        }
        const updatedTasks = prev.data.plan.tasks.map((task: any) =>
          task.id === taskId ? { ...task, status: 'completed' } : task
        );
        const newData = {
          ...prev.data,
          plan: {
            ...prev.data.plan,
            tasks: updatedTasks,
          },
        };
        saveToStorage(newData);
        return {
          ...prev,
          data: newData,
        };
      });

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

        // Обновляем только requirementChecks после завершения задания
        await refreshRequirementChecks();
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error?.message ?? 'Не удалось отметить задание выполненным',
        }));
        await fetchDashboard();
      }
    },
    [hasyx, refreshRequirementChecks, fetchDashboard, saveToStorage]
  );

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refresh: fetchDashboard,
    regeneratePlan,
    completeTask,
    refreshRequirementChecks,
    refreshProgressMetrics,
    targetDate,
  };
}


