'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'hasyx';
import type { VerbWithProgress, PracticeResult } from '@/lib/verbs/verbs-service';

interface UseIrregularVerbsTrainerOptions {
  mode?: 'form-to-meaning' | 'sentence-to-form';
  verbs?: VerbWithProgress[];
}

interface UseIrregularVerbsTrainerReturn {
  currentVerb: VerbWithProgress | null;
  mode: 'form-to-meaning' | 'sentence-to-form';
  isComplete: boolean;
  results: PracticeResult[];
  submitAnswer: (answer: string, wasCorrect: boolean) => Promise<void>;
  nextVerb: () => void;
  reset: () => void;
  setMode: (mode: 'form-to-meaning' | 'sentence-to-form') => void;
}

export function useIrregularVerbsTrainer(
  options: UseIrregularVerbsTrainerOptions = {}
): UseIrregularVerbsTrainerReturn {
  const { data: session, status } = useSession();
  const [verbs, setVerbs] = useState<VerbWithProgress[]>(options.verbs || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'form-to-meaning' | 'sentence-to-form'>(
    options.mode || 'form-to-meaning'
  );
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (options.verbs) {
      setVerbs(options.verbs);
      setCurrentIndex(0);
      setResults([]);
      setStartTime(Date.now());
    }
  }, [options.verbs]);

  const currentVerb = verbs[currentIndex] || null;
  const isComplete = currentIndex >= verbs.length;

  const submitAnswer = useCallback(
    async (answer: string, wasCorrect: boolean) => {
      if (!currentVerb || status !== 'authenticated' || !session?.user?.id || isSubmitting) return;

      setIsSubmitting(true);
      const responseTime = Math.round((Date.now() - startTime) / 1000);

      try {
        const result: PracticeResult = {
          verbId: currentVerb.id,
          wasCorrect,
          responseTime,
          practiceMode: mode,
        };

        // Record in API
        await fetch('/api/verbs/practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });

        setResults((prev) => [...prev, result]);
        setStartTime(Date.now());
      } catch (error) {
        console.error('[useIrregularVerbsTrainer] Error submitting answer:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentVerb, status, session?.user?.id, mode, startTime, isSubmitting]
  );

  const nextVerb = useCallback(() => {
    if (currentIndex < verbs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStartTime(Date.now());
    }
  }, [currentIndex, verbs.length]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setResults([]);
    setStartTime(Date.now());
  }, []);

  return {
    currentVerb,
    mode,
    isComplete,
    results,
    submitAnswer,
    nextVerb,
    reset,
    setMode,
  };
}

