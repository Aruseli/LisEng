'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ListeningQuestion, AnswerMetrics } from '@/types/level-test';
import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';
import { usePronunciationAnalysis } from '@/components/speachComponents/hooks_usePronunciationAnalysis';
import { Button } from '../Buttons/Button';
import { ListeningPlayer } from '@/components/app/listening/ListeningPlayer';

interface ListeningQuestionViewProps {
  question: ListeningQuestion;
  answer?: number[];
  onAnswer: (answer: number[], metadata?: AnswerMetrics) => void;
}

export function ListeningQuestionView({
  question,
  answer,
  onAnswer,
}: ListeningQuestionViewProps) {
  const normalizedAnswer = useMemo(() => (Array.isArray(answer) ? answer : []), [answer]);
  const [localAnswers, setLocalAnswers] = useState<number[]>(normalizedAnswer);
  const [pronunciationError, setPronunciationError] = useState<string | null>(null);
  const pronunciation = usePronunciationAnalysis();

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
      const accuracyValue = pronunciation.analyze(question.transcript, text);
      onAnswer(localAnswers, {
        recognizedText: text,
        pronunciationAccuracy: accuracyValue,
      });
    },
    onError: (message) => setPronunciationError(message),
  });

  useEffect(() => {
    setLocalAnswers(normalizedAnswer);
  }, [normalizedAnswer]);

  const handleSubQuestionAnswer = (subIndex: number, optionIndex: number) => {
    const newAnswers = [...localAnswers];
    newAnswers[subIndex] = optionIndex;
    setLocalAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const accuracyColor = useMemo(() => {
    if (pronunciation.accuracy == null) return 'text-gray-600';
    if (pronunciation.accuracy >= 80) return 'text-green-600';
    if (pronunciation.accuracy >= 60) return 'text-amber-600';
    return 'text-red-600';
  }, [pronunciation.accuracy]);

  const handleStartPronunciation = async () => {
    setPronunciationError(null);
    await startRecording();
  };

  const handleStopPronunciation = () => {
    stopRecording();
  };

  const handleResetPronunciation = () => {
    resetRecognition();
    pronunciation.reset();
    setPronunciationError(null);
    onAnswer(localAnswers, undefined);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Аудирование
      </h3>
      
      <div className="space-y-4">
        <ListeningPlayer
          transcript={question.transcript}
          audioUrl={question.audioUrl}
          className="space-y-3"
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-blue-100 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Практика произношения</p>
            <p className="text-xs text-gray-500">
              Повторите услышанный текст и получите мгновенную оценку произношения.
            </p>
          </div>
          <button
            onClick={handleResetPronunciation}
            className="text-xs font-medium text-gray-500 underline disabled:opacity-40"
            disabled={!recognizedText && pronunciation.accuracy == null}
          >
            Сбросить
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={isRecording ? handleStopPronunciation : handleStartPronunciation}
            variant={isRecording ? 'destructive' : 'default'}
            disabled={isProcessing}
          >
            {isRecording ? 'Остановить запись' : 'Записать речь'}
          </Button>
          {isProcessing && (
            <span className="text-sm text-gray-600">Обрабатываем аудио...</span>
          )}
          {pronunciationError && (
            <span className="text-sm text-red-600">{pronunciationError}</span>
          )}
          {error && !pronunciationError && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>

        {recognizedText && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-600">Распознанный текст</p>
            <p className="text-sm text-gray-800">{recognizedText}</p>
          </div>
        )}

        {pronunciation.accuracy !== null && (
          <div className="space-y-3">
            <p className={`text-sm font-semibold ${accuracyColor}`}>
              Точность произношения: {pronunciation.accuracy}%
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
              {pronunciation.words.map((word, index) => (
                <div
                  key={`${word.text}-${index}`}
                  className={`rounded-lg border px-2 py-1 ${
                    word.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <p className="font-medium text-gray-900">{word.text}</p>
                  <p className="text-[11px] text-gray-600">
                    {Math.round(word.similarity * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {question.questions.map((subQuestion, subIndex) => (
          <div key={subIndex} className="space-y-3">
            <p className="text-base font-medium text-gray-900">
              {subIndex + 1}. {subQuestion.question}
            </p>
            <div className="space-y-2">
              {subQuestion.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleSubQuestionAnswer(subIndex, optionIndex)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition ${
                    localAnswers[subIndex] === optionIndex
                      ? 'border-primary bg-emerald-50 text-primary-deep'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



