
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/compat/hasyx';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';
import { invalidateVerbQueries } from '@/lib/query-keys';

interface UseVerbFromLessonReturn {
  addToReviewQueue: (verbId: string) => Promise<void>;
  showVerbCard: (verbId: string) => Promise<VerbWithProgress | null>;
  isAdding: boolean;
  currentVerb: VerbWithProgress | null;
}

export function useVerbFromLesson(): UseVerbFromLessonReturn {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [currentVerb, setCurrentVerb] = useState<VerbWithProgress | null>(null);

  const addToReviewQueue = useCallback(
    async (verbId: string) => {
      if (status !== 'authenticated' || !session?.user?.id || isAdding) return;

      setIsAdding(true);
      try {
        const response = await fetch('/api/verbs/add-to-queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verbId }),
        });

        if (!response.ok) {
          throw new Error('Failed to add verb to queue');
        }
        await invalidateVerbQueries(queryClient, session?.user?.id);
      } catch (error) {
        console.error('[useVerbFromLesson] Error adding to queue:', error);
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [status, session?.user?.id, isAdding, queryClient]
  );

  const showVerbCard = useCallback(
    async (verbId: string): Promise<VerbWithProgress | null> => {
      if (status !== 'authenticated' || !session?.user?.id) return null;

      try {
        const response = await fetch(`/api/verbs/${verbId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch verb');
        }

        const data = await response.json();
        const verb: VerbWithProgress = data.verb;
        setCurrentVerb(verb);
        return verb;
      } catch (error) {
        console.error('[useVerbFromLesson] Error fetching verb:', error);
        return null;
      }
    },
    [status, session?.user?.id]
  );

  return {
    addToReviewQueue,
    showVerbCard,
    isAdding,
    currentVerb,
  };
}

