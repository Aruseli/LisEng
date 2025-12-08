'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../Buttons/Button';
import { Mic, MicOff, Send, CheckCircle2 } from 'lucide-react';
import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface SpeakingRolePlayTabProps {
  topic: string;
  messages: Message[];
  isLoading: boolean;
  suggestedPrompt?: string | null;
  targetWords?: string[];
  taskId?: string;
  userId?: string;
  refreshRequirementChecks?: () => Promise<void>;
  refreshProgressMetrics?: () => Promise<void>;
  onSendMessage: (message: string) => Promise<void> | void;
  onComplete?: () => void;
}

export function SpeakingRolePlayTab({
  topic,
  messages,
  isLoading,
  suggestedPrompt,
  targetWords = [],
  taskId,
  userId,
  refreshRequirementChecks,
  refreshProgressMetrics,
  onSendMessage,
  onComplete,
}: SpeakingRolePlayTabProps) {
  const [sessionStartTime] = useState<Date>(new Date());
  const [usedTargetWords, setUsedTargetWords] = useState<Set<string>>(new Set());
  const lastSpokenMessageRef = useRef<string | null>(null);

  // Голосовое распознавание
  const {
    isRecording,
    isProcessing,
    recognizedText,
    error: recognitionError,
    startRecording,
    stopRecording,
    resetRecognition,
  } = useSpeechRecognition({
    onTranscriptionComplete: async (text) => {
      if (text.trim()) {
        // Проверяем использование targetWords
        const lowerText = text.toLowerCase();
        const foundWords = targetWords.filter((word) =>
          lowerText.includes(word.toLowerCase())
        );
        if (foundWords.length > 0) {
          setUsedTargetWords((prev) => {
            const newSet = new Set(prev);
            foundWords.forEach((word) => newSet.add(word));
            return newSet;
          });
        }
        // Отправляем транскрипцию в AI
        await onSendMessage(text);
        resetRecognition();
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  // Озвучивание ответов AI
  const { speak, isSpeaking, cancel } = useSpeechSynthesis({
    language: 'en-US',
    rate: 0.9,
    onEnd: () => {
      // После озвучивания можно автоматически начать запись снова
    },
  });

  // Автоматически озвучиваем ответы AI (только новые сообщения)
  useEffect(() => {
    if (messages.length > 0 && !isLoading && !isRecording && !isProcessing) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.role === 'assistant' &&
        lastMessage.content &&
        lastMessage.content !== lastSpokenMessageRef.current
      ) {
        // Отмечаем, что это сообщение уже озвучено
        lastSpokenMessageRef.current = lastMessage.content;
        
        // Небольшая задержка перед озвучиванием
        const timer = setTimeout(() => {
          // Проверяем еще раз, что мы не записываем и не обрабатываем
          if (!isRecording && !isProcessing) {
            speak(lastMessage.content);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, speak, isLoading, isRecording, isProcessing]);

  // Подсветка использованных слов в тексте
  const highlightTargetWords = useCallback((text: string) => {
    if (targetWords.length === 0) return text;

    let highlightedText = text;
    targetWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const isUsed = usedTargetWords.has(word);
      highlightedText = highlightedText.replace(
        regex,
        (match) =>
          `<span class="font-semibold ${
            isUsed ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
          } px-1 rounded">${match}</span>`
      );
    });
    return highlightedText;
  }, [targetWords, usedTargetWords]);

  // Завершение урока
  const handleCompleteLesson = useCallback(async () => {
    if (!taskId || !userId) {
      console.error('taskId and userId are required to complete lesson');
      return;
    }

    try {
      const sessionDuration = Math.max(
        1,
        Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000)
      );

      const conversationData = {
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
        })),
        targetWordsUsed: Array.from(usedTargetWords),
        sessionDuration,
      };

      const response = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          taskId,
          conversationData,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось завершить урок');
      }

      // Обновляем requirementChecks и progressMetrics
      if (refreshRequirementChecks) {
        await refreshRequirementChecks();
      }
      if (refreshProgressMetrics) {
        await refreshProgressMetrics();
      }

      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error('Failed to complete lesson:', error);
      alert(`Ошибка при завершении урока: ${error?.message || 'Неизвестная ошибка'}`);
    }
  }, [
    taskId,
    userId,
    messages,
    usedTargetWords,
    sessionStartTime,
    refreshRequirementChecks,
    refreshProgressMetrics,
    onComplete,
  ]);

  return (
    <div className="flex h-[520px] flex-col rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ролевая игра: {topic}</h2>
            <p className="text-sm text-gray-500">
              Говори с AI голосом! AI играет роль друга и будет отвечать короткими репликами.
            </p>
          </div>
          {isSpeaking && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              AI говорит...
            </div>
          )}
        </div>

        {targetWords.length > 0 && (
          <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
            <p className="mb-2 text-xs font-semibold text-blue-900">
              Целевые слова для использования:
            </p>
            <div className="flex flex-wrap gap-2">
              {targetWords.map((word) => {
                const isUsed = usedTargetWords.has(word);
                return (
                  <span
                    key={word}
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isUsed
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-white text-blue-700 border border-blue-300'
                    }`}
                  >
                    {word}
                    {isUsed && <CheckCircle2 className="ml-1 inline h-3 w-3" />}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {suggestedPrompt && (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3 text-xs text-indigo-700">
            <p className="font-semibold text-indigo-900">Предложенный промпт</p>
            <p>{suggestedPrompt}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                message.role === 'assistant'
                  ? 'self-start bg-white text-gray-700 shadow-sm'
                  : 'self-end bg-primary-deep text-white shadow-sm'
              }`}
            >
              {message.role === 'user' ? (
                <div dangerouslySetInnerHTML={{ __html: highlightTargetWords(message.content) }} />
              ) : (
                message.content
              )}
            </div>
          ))}
          {isLoading && (
            <div className="self-start rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
              AI думает...
            </div>
          )}
          {isProcessing && (
            <div className="self-end rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 shadow-sm">
              Обрабатываю запись...
            </div>
          )}
          {recognitionError && (
            <div className="self-end rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600 shadow-sm">
              Ошибка: {recognitionError}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex gap-3">
          {!isRecording ? (
            <Button
              variant="default"
              onClick={startRecording}
              disabled={isLoading || isProcessing || isSpeaking}
              leftIcon={<Mic className="size-4" />}
              className="flex-1"
            >
              Начать запись
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={stopRecording}
              disabled={isProcessing}
              leftIcon={<MicOff className="size-4" />}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              Остановить запись
            </Button>
          )}
          {isSpeaking && (
            <Button
              variant="outline"
              onClick={cancel}
              className="flex-shrink-0"
            >
              Остановить озвучивание
            </Button>
          )}
        </div>

        {recognizedText && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700">
            <p className="text-xs text-gray-500 mb-1">Распознанный текст:</p>
            <p dangerouslySetInnerHTML={{ __html: highlightTargetWords(recognizedText) }} />
          </div>
        )}

        {taskId && userId && (
          <Button
            variant="default"
            onClick={handleCompleteLesson}
            disabled={isLoading || isRecording || isProcessing}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Завершить урок
          </Button>
        )}
      </div>
    </div>
  );
}

