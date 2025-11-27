'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'hasyx';
import type { VerbWithProgress, GroupProgress } from '@/lib/verbs/verbs-service';

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
  const [progress, setProgress] = useState<VerbProgressStats | null>(null);
  const [weakVerbs, setWeakVerbs] = useState<VerbWithProgress[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<ReviewSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    // Не загружаем данные, пока сессия загружается или пользователь не авторизован
    if (status === 'loading' || status === 'unauthenticated' || !session?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch groups progress
      const groupsResponse = await fetch('/api/verbs/progress?type=groups');
      if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
      const groupsData = await groupsResponse.json();
      const groups: GroupProgress[] = groupsData.groups || [];

      // Fetch weak verbs
      const weakResponse = await fetch('/api/verbs/progress?type=weak&limit=10');
      if (!weakResponse.ok) throw new Error('Failed to fetch weak verbs');
      const weakData = await weakResponse.json();
      const weak: VerbWithProgress[] = weakData.verbs || [];

      // Calculate totals
      const totalVerbs = groups.reduce((sum, g) => sum + g.total, 0);
      const learnedVerbs = groups.reduce((sum, g) => sum + g.learned, 0);
      const masteredVerbs = groups.reduce((sum, g) => sum + g.mastered, 0);

      setProgress({
        totalVerbs,
        learnedVerbs,
        masteredVerbs,
        weakVerbs: weak.length,
        groups,
      });

      setWeakVerbs(weak);

      // Calculate upcoming reviews (next 7 days)
      const today = new Date();
      const reviewSchedule: ReviewSchedule[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const reviewResponse = await fetch(`/api/verbs/review?date=${dateStr}&limit=100`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          reviewSchedule.push({
            date: dateStr,
            verbCount: reviewData.verbs?.length || 0,
          });
        }
      }
      setUpcomingReviews(reviewSchedule);
    } catch (error: any) {
      console.error('[useVerbProgress] Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    weakVerbs,
    upcomingReviews,
    isLoading,
    refresh: fetchProgress,
  };
}

