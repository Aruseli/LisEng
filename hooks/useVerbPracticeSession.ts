'use client';

import { useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface SessionStats {
  verbsPracticed: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  durationMinutes: number;
}

interface UseVerbPracticeSessionReturn {
  startSession: () => void;
  endSession: () => Promise<void>;
  recordResult: (verbId: string, wasCorrect: boolean) => void;
  sessionStats: SessionStats;
  isActive: boolean;
}

export function useVerbPracticeSession(): UseVerbPracticeSessionReturn {
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    verbsPracticed: 0,
    correctCount: 0,
    incorrectCount: 0,
    accuracy: 0,
    durationMinutes: 0,
  });
  const startTimeRef = useRef<number | null>(null);

  const startSession = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    setSessionStats({
      verbsPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
      durationMinutes: 0,
    });
  }, []);

  const recordResult = useCallback((verbId: string, wasCorrect: boolean) => {
    setSessionStats((prev) => {
      const newPracticed = prev.verbsPracticed + 1;
      const newCorrect = wasCorrect ? prev.correctCount + 1 : prev.correctCount;
      const newIncorrect = !wasCorrect ? prev.incorrectCount + 1 : prev.incorrectCount;
      const newAccuracy = newPracticed > 0 ? newCorrect / newPracticed : 0;

      return {
        verbsPracticed: newPracticed,
        correctCount: newCorrect,
        incorrectCount: newIncorrect,
        accuracy: newAccuracy,
        durationMinutes: prev.durationMinutes,
      };
    });
  }, []);

  const endSession = useCallback(async () => {
    if (!isActive || !session?.user?.id || !startTimeRef.current) return;

    const durationMs = Date.now() - startTimeRef.current;
    const durationMinutes = Math.round(durationMs / 60000) || 1;

    const finalStats = {
      ...sessionStats,
      durationMinutes,
    };

    try {
      // Save session to database
      await fetch('/api/verbs/practice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verbsPracticed: finalStats.verbsPracticed,
          accuracy: finalStats.accuracy,
          durationMinutes: finalStats.durationMinutes,
        }),
      });
    } catch (error) {
      console.error('[useVerbPracticeSession] Error saving session:', error);
    }

    setIsActive(false);
    startTimeRef.current = null;
  }, [isActive, session?.user?.id, sessionStats]);

  return {
    startSession,
    endSession,
    recordResult,
    sessionStats,
    isActive,
  };
}

