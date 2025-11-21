'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';

interface UseVerbFromLessonReturn {
  addToReviewQueue: (verbId: string) => Promise<void>;
  showVerbCard: (verbId: string) => Promise<VerbWithProgress | null>;
  isAdding: boolean;
  currentVerb: VerbWithProgress | null;
}

export function useVerbFromLesson(): UseVerbFromLessonReturn {
  const { data: session } = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [currentVerb, setCurrentVerb] = useState<VerbWithProgress | null>(null);

  const addToReviewQueue = useCallback(
    async (verbId: string) => {
      if (!session?.user?.id || isAdding) return;

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
      } catch (error) {
        console.error('[useVerbFromLesson] Error adding to queue:', error);
        throw error;
      } finally {
        setIsAdding(false);
      }
    },
    [session?.user?.id, isAdding]
  );

  const showVerbCard = useCallback(
    async (verbId: string): Promise<VerbWithProgress | null> => {
      if (!session?.user?.id) return null;

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
    [session?.user?.id]
  );

  return {
    addToReviewQueue,
    showVerbCard,
    isAdding,
    currentVerb,
  };
}

