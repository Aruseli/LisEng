'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/app/Buttons/Button';
import { useListeningPlayer } from '@/hooks/useListeningPlayer';

interface ListeningPlayerProps {
  transcript: string;
  audioUrl?: string | null;
  className?: string;
  infoSlot?: ReactNode;
  speechLanguage?: string;
  speechRate?: number;
  speechPitch?: number;
}

export function ListeningPlayer({
  transcript,
  audioUrl,
  className = '',
  infoSlot,
  speechLanguage = 'en-US',
  speechRate = 0.95,
  speechPitch = 1,
}: ListeningPlayerProps) {
  const {
    isSpeaking,
    playWithTTS,
    stopTTS,
    isTranscriptVisible,
    toggleTranscript,
  } = useListeningPlayer({
    transcript,
    speechLanguage,
    speechRate,
    speechPitch,
  });

  const handlePlay = () => {
    if (audioUrl) {
      return;
    }
    playWithTTS();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {audioUrl ? (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
          Ваш браузер не поддерживает аудио элемент.
        </audio>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-primary bg-emerald-50 p-4 text-sm text-primary-deep">
            <p>Аудио дорожка генерируется из транскрипта. Нажмите кнопку ниже, чтобы прослушать текст с помощью синтезатора речи вашего браузера.</p>
          </div>
          <Button
            onClick={handlePlay}
            variant={isSpeaking ? 'destructive' : 'secondary'}
          >
            {isSpeaking ? 'Остановить озвучку' : 'Прослушать текст'}
          </Button>
        </div>
      )}

      {infoSlot}

      <Button variant="link" onClick={toggleTranscript}>
        {isTranscriptVisible ? 'Скрыть' : 'Показать'} транскрипт
      </Button>

      {isTranscriptVisible && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}


