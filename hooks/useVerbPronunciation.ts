'use client';

import { useCallback } from 'react';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';

interface UseVerbPronunciationReturn {
  speakInfinitive: (verb: string) => void;
  speakPast: (verb: string) => void;
  speakParticiple: (verb: string) => void;
  isSpeaking: boolean;
  cancel: () => void;
}

export function useVerbPronunciation(): UseVerbPronunciationReturn {
  const { speak, cancel, isSpeaking } = useSpeechSynthesis({
    language: 'en-US',
    rate: 0.9,
    pitch: 1,
  });

  const speakInfinitive = useCallback(
    (verb: string) => {
      if (!verb.trim()) return;
      speak(verb);
    },
    [speak]
  );

  const speakPast = useCallback(
    (verb: string) => {
      if (!verb.trim()) return;
      // Handle "was/were" case
      const pastForm = verb.includes('/') ? verb.split('/')[0] : verb;
      speak(pastForm);
    },
    [speak]
  );

  const speakParticiple = useCallback(
    (verb: string) => {
      if (!verb.trim()) return;
      // Handle "got/gotten" case
      const participleForm = verb.includes('/') ? verb.split('/')[0] : verb;
      speak(participleForm);
    },
    [speak]
  );

  return {
    speakInfinitive,
    speakPast,
    speakParticiple,
    isSpeaking,
    cancel,
  };
}

