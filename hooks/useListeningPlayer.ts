'use client';

import { useState } from 'react';

import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';

interface UseListeningPlayerOptions {
  transcript: string;
  speechLanguage?: string;
  speechRate?: number;
  speechPitch?: number;
}

export function useListeningPlayer({
  transcript,
  speechLanguage = 'en-US',
  speechRate = 1,
  speechPitch = 1,
}: UseListeningPlayerOptions) {
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

  const { isSpeaking, speak, cancel } = useSpeechSynthesis({
    language: speechLanguage,
    rate: speechRate,
    pitch: speechPitch,
  });

  const toggleTranscript = () => setIsTranscriptVisible((prev) => !prev);
  const playWithTTS = () => {
    if (!transcript.trim()) {
      return;
    }
    if (isSpeaking) {
      cancel();
    } else {
      speak(transcript);
    }
  };

  const stopTTS = () => {
    if (isSpeaking) {
      cancel();
    }
  };

  return {
    isSpeaking,
    playWithTTS,
    stopTTS,
    isTranscriptVisible,
    toggleTranscript,
  };
}


