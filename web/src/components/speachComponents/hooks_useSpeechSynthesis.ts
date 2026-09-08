import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  speak: (text: string) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const {
    language = 'en-US',
    rate = 0.9,
    pitch = 1,
    volume = 1,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Инициализация
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;

      // Загрузка голосов
      const loadVoices = () => {
        const availableVoices = synthRef.current!.getVoices();
        setVoices(availableVoices);

        // Выбираем первый английский голос по умолчанию
        const defaultVoice = availableVoices.find(
          (voice) => voice.lang.startsWith('en')
        ) || availableVoices[0];
        
        setSelectedVoice(defaultVoice);
      };

      // Голоса могут загружаться асинхронно
      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;

      return () => {
        if (synthRef.current) {
          synthRef.current.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) {
      const errorMessage = 'Speech synthesis not supported in this browser';
      console.error(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    // Останавливаем предыдущее озвучивание перед началом нового
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    if (!text.trim()) {
      console.warn('Empty text provided to speak');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      // Игнорируем ошибку "interrupted", так как она возникает при нормальной отмене
      if (event.error !== 'interrupted') {
        const errorMessage = `Speech error: ${event.error}`;
        console.error(errorMessage);
        if (onError) onError(errorMessage);
      }
    };

    try {
      synthRef.current.speak(utterance);
    } catch (error: any) {
      setIsSpeaking(false);
      // Игнорируем ошибки, связанные с прерыванием
      if (error?.message && !error.message.includes('interrupted')) {
        console.error('Failed to speak:', error);
        if (onError) onError(error.message);
      }
    }
  }, [language, rate, pitch, volume, selectedVoice, onEnd, onError]);

  const cancel = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.resume();
    }
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    isSpeaking,
    speak,
    cancel,
    pause,
    resume,
    voices,
    selectedVoice,
    setVoice,
  };
};