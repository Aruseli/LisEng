'use client';

import { useEffect, useState } from 'react';
import type { SpeakingQuestion, AnswerMetrics } from '@/types/level-test';
import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';
import { Button } from '../Buttons/Button';

interface SpeakingQuestionViewProps {
  question: SpeakingQuestion;
  answer?: string;
  onAnswer: (answer: string, metadata?: AnswerMetrics) => void;
}

export function SpeakingQuestionView({
  question,
  answer = '',
  onAnswer,
}: SpeakingQuestionViewProps) {
  const [transcript, setTranscript] = useState(answer);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    isRecording,
    isProcessing,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    resetRecognition,
  } = useSpeechRecognition({
    onTranscriptionComplete: (text) => {
      setTranscript(text);
      onAnswer(text, { recognizedText: text });
    },
    onError: (message) => setErrorMessage(message),
  });

  useEffect(() => {
    setTranscript(answer);
  }, [answer]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  useEffect(() => {
    if (
      isRecording &&
      question.recordingTimeLimit &&
      recordingTime >= question.recordingTimeLimit
    ) {
      stopRecording();
    }
  }, [isRecording, question.recordingTimeLimit, recordingTime, stopRecording]);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleReset = () => {
    setTranscript('');
    resetRecognition();
    setErrorMessage(null);
    onAnswer('', undefined);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Говорение
      </h3>
      
      <div className="p-4 bg-emerald-50 border border-primary rounded-xl">
        <p className="text-base text-gray-700">{question.prompt}</p>
        {question.expectedLength && (
          <p className="text-sm text-gray-600 mt-2">
            Ожидаемая длина ответа: около {question.expectedLength} слов
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            variant={isRecording ? 'destructive' : 'default'}
            disabled={isProcessing}
          >
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-white'}`}></span>
            {isRecording ? 'Остановить запись' : 'Начать запись'}
          </Button>

          <div className="text-lg font-mono text-gray-700">
            {formatTime(recordingTime)}
            {question.recordingTimeLimit && ` / ${formatTime(question.recordingTimeLimit)}`}
          </div>
        </div>

        {isProcessing && (
          <p className="text-sm text-gray-500 text-center">Обрабатываем запись...</p>
        )}

        {(error || errorMessage) && (
          <p className="text-sm text-red-600 text-center">
            {errorMessage || error}
          </p>
        )}

        {transcript && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Транскрипция:</p>
            <p className="text-sm text-gray-600">{transcript}</p>
            <div className="mt-3 flex gap-3">
              <Button
                onClick={handleReset}
                variant="link"
              >
                Очистить
              </Button>
              {recognizedText && (
                <span className="text-xs text-gray-500">
                  Распознанных слов: {recognizedText.split(/\s+/).filter(Boolean).length}
                </span>
              )}
            </div>
          </div>
        )}

        {!transcript && !isRecording && (
          <p className="text-sm text-gray-500 text-center">
            Нажмите "Начать запись" и ответьте на вопрос
          </p>
        )}
      </div>
    </div>
  );
}



