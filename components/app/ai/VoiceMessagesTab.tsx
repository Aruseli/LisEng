'use client';

import { useCallback, useState, useRef } from 'react';
import { Button } from '../Buttons/Button';
import { Mic, MicOff, CheckCircle2, XCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface VoiceMessage {
  id: string;
  transcription: string;
  audioUrl?: string;
  feedback?: VoiceFeedback;
  timestamp: Date;
}

interface VoiceFeedback {
  pronunciation: {
    score: number;
    feedback: string;
    issues: string[];
  };
  vocabulary: {
    targetWordsUsed: string[];
    missingWords: string[];
    feedback: string;
    suggestions: Array<{ word: string; example: string }>;
  };
  grammar: {
    errors: Array<{ text: string; correction: string; explanation: string }>;
    feedback: string;
  };
  overall: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

interface VoiceMessagesTabProps {
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

export function VoiceMessagesTab({
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
}: VoiceMessagesTabProps) {
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [sessionStartTime] = useState<Date>(new Date());
  const audioBlobsRef = useRef<Map<string, Blob>>(new Map());

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
        const messageId = `msg-${Date.now()}`;
        const newMessage: VoiceMessage = {
          id: messageId,
          transcription: text,
          timestamp: new Date(),
        };
        setVoiceMessages((prev) => [...prev, newMessage]);

        // Отправляем на анализ
        try {
          const feedback = await analyzeVoiceMessage(text, targetWords);
          setVoiceMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, feedback } : msg
            )
          );
        } catch (error) {
          console.error('Failed to analyze voice message:', error);
        }

        resetRecognition();
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  // Анализ голосового сообщения
  const analyzeVoiceMessage = useCallback(
    async (transcription: string, words: string[]): Promise<VoiceFeedback> => {
      const response = await fetch('/api/ai/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription,
          targetWords: words,
          level: 'A2', // TODO: получить из контекста
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to analyze voice message');
      }

      return response.json();
    },
    []
  );

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

      const targetWordsUsed = new Set<string>();
      const targetWordsMissing = new Set<string>(targetWords);

      voiceMessages.forEach((msg) => {
        if (msg.feedback?.vocabulary) {
          msg.feedback.vocabulary.targetWordsUsed.forEach((word) => {
            targetWordsUsed.add(word);
            targetWordsMissing.delete(word);
          });
        }
      });

      const voiceMessagesData = {
        messages: voiceMessages.map((msg) => ({
          transcription: msg.transcription,
          audioUrl: msg.audioUrl,
          feedback: msg.feedback,
        })),
        targetWordsUsed: Array.from(targetWordsUsed),
        targetWordsMissing: Array.from(targetWordsMissing),
        overallFeedback: voiceMessages[voiceMessages.length - 1]?.feedback?.overall,
      };

      const response = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          taskId,
          voiceMessagesData,
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
    voiceMessages,
    targetWords,
    sessionStartTime,
    refreshRequirementChecks,
    refreshProgressMetrics,
    onComplete,
  ]);

  const allTargetWordsUsed = new Set<string>();
  voiceMessages.forEach((msg) => {
    msg.feedback?.vocabulary.targetWordsUsed.forEach((word) =>
      allTargetWordsUsed.add(word)
    );
  });

  return (
    <div className="flex h-auto flex-col rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Запись голосовых сообщений: {topic}
        </h2>
        <p className="text-sm text-gray-500">
          Записывай голосовые сообщения, получай фидбек по произношению, использованию слов и
          грамматике.
        </p>

        {targetWords.length > 0 && (
          <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
            <p className="mb-2 text-xs font-semibold text-blue-900">
              Целевые слова для использования:
            </p>
            <div className="flex flex-wrap gap-2">
              {targetWords.map((word) => {
                const isUsed = allTargetWordsUsed.has(word);
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

      <div className="flex-1 overflow-y-scroll rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex flex-col gap-3">
          {voiceMessages.length === 0 && !isProcessing && (
            <div className="text-center text-sm text-gray-500">
              Начни запись, чтобы создать первое голосовое сообщение
            </div>
          )}

          {voiceMessages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Транскрипция:</p>
                <span className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-700">{msg.transcription}</p>

              {msg.feedback && (
                <div className="space-y-3 border-t border-gray-100 pt-3">
                  {/* Произношение */}
                  {msg.feedback.pronunciation && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-gray-700">
                        Произношение: {msg.feedback.pronunciation.score}/10
                      </p>
                      <p className="text-xs text-gray-600">
                        {msg.feedback.pronunciation.feedback}
                      </p>
                      {msg.feedback.pronunciation.issues.length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-xs text-amber-600">
                          {msg.feedback.pronunciation.issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Словарь */}
                  {msg.feedback.vocabulary && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-gray-700">Словарь:</p>
                      <p className="text-xs text-gray-600">
                        {msg.feedback.vocabulary.feedback}
                      </p>
                      {msg.feedback.vocabulary.targetWordsUsed.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-green-600">
                            Использовано: {msg.feedback.vocabulary.targetWordsUsed.join(', ')}
                          </p>
                        </div>
                      )}
                      {msg.feedback.vocabulary.missingWords.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-amber-600">
                            Пропущено: {msg.feedback.vocabulary.missingWords.join(', ')}
                          </p>
                          {msg.feedback.vocabulary.suggestions.length > 0 && (
                            <ul className="mt-1 list-disc pl-4 text-xs text-blue-600">
                              {msg.feedback.vocabulary.suggestions.map((suggestion, idx) => (
                                <li key={idx}>
                                  <strong>{suggestion.word}:</strong> {suggestion.example}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Грамматика */}
                  {msg.feedback.grammar && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-gray-700">Грамматика:</p>
                      <p className="text-xs text-gray-600">{msg.feedback.grammar.feedback}</p>
                      {msg.feedback.grammar.errors.length > 0 && (
                        <ul className="mt-1 space-y-1">
                          {msg.feedback.grammar.errors.map((error, idx) => (
                            <li key={idx} className="text-xs">
                              <span className="text-red-600">{error.text}</span> →{' '}
                              <span className="text-green-600">{error.correction}</span>
                              {error.explanation && (
                                <span className="ml-1 text-gray-500">
                                  ({error.explanation})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Общая оценка */}
                  {msg.feedback.overall && (
                    <div className="rounded-lg bg-blue-50 p-2">
                      <p className="mb-1 text-xs font-semibold text-blue-900">
                        Общая оценка: {msg.feedback.overall.score}/10
                      </p>
                      <p className="text-xs text-blue-700">{msg.feedback.overall.feedback}</p>
                      {msg.feedback.overall.suggestions.length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-xs text-blue-600">
                          {msg.feedback.overall.suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!msg.feedback && isProcessing && (
                <div className="mt-2 text-xs text-blue-600">Анализирую сообщение...</div>
              )}
            </div>
          ))}

          {isProcessing && !recognizedText && (
            <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 shadow-sm">
              Обрабатываю запись...
            </div>
          )}

          {recognitionError && (
            <div className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600 shadow-sm">
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
              disabled={isLoading || isProcessing}
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
        </div>

        {recognizedText && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700">
            <p className="text-xs text-gray-500 mb-1">Распознанный текст:</p>
            <p>{recognizedText}</p>
          </div>
        )}

        {taskId && userId && (
          <Button
            variant="default"
            onClick={handleCompleteLesson}
            disabled={isLoading || isRecording || isProcessing || voiceMessages.length === 0}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Завершить урок
          </Button>
        )}
      </div>
    </div>
  );
}

