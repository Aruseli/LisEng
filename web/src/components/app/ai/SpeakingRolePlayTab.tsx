
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../Buttons/Button';
import { Mic, MicOff, Send, CheckCircle2, BarChart3, MessageSquare } from 'lucide-react';
import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';
import { useModalStore } from '@/store/modalStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
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
  const { openModal } = useModalStore();
  const [sessionStartTime] = useState<Date>(new Date());
  const [usedTargetWords, setUsedTargetWords] = useState<Set<string>>(new Set());
  const [isAnalyzingMessage, setIsAnalyzingMessage] = useState(false);
  const [isAnalyzingLesson, setIsAnalyzingLesson] = useState(false);
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

  // Анализ одного сообщения
  const analyzeMessage = useCallback(async (messageContent: string) => {
    setIsAnalyzingMessage(true);
    try {
      const response = await fetch('/api/ai/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription: messageContent,
          targetWords,
          level: 'B1', // Можно сделать динамическим
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze message');
      }

      const feedback: VoiceFeedback = await response.json();
      return feedback;
    } catch (error) {
      console.error('Failed to analyze message:', error);
      throw error;
    } finally {
      setIsAnalyzingMessage(false);
    }
  }, [targetWords, userId]);

  // Анализ всей беседы
  const analyzeLesson = useCallback(async () => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return;

    setIsAnalyzingLesson(true);
    try {
      const conversationText = userMessages.map(m => m.content).join(' ');

      const response = await fetch('/api/ai/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription: conversationText,
          targetWords,
          level: 'B1',
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze lesson');
      }

      const feedback: VoiceFeedback = await response.json();
      return feedback;
    } catch (error) {
      console.error('Failed to analyze lesson:', error);
      throw error;
    } finally {
      setIsAnalyzingLesson(false);
    }
  }, [messages, targetWords, userId]);

  // Компонент модального окна для показа анализа
  const VoiceAnalysisModal = ({ feedback }: { feedback: VoiceFeedback }) => (
    <div className="max-w-2xl max-h-[80vh] overflow-y-auto p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Анализ речи</h3>

      {/* Общая оценка */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold text-blue-900">Общая оценка</h4>
          <span className="text-2xl font-bold text-blue-600">{feedback.overall.score}/10</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">{feedback.overall.feedback}</p>
        {feedback.overall.suggestions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-blue-800 mb-2">Рекомендации:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              {feedback.overall.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Произношение */}
      <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-green-900">Произношение</h4>
          <span className="font-bold text-green-600">{feedback.pronunciation.score}/10</span>
        </div>
        <p className="text-sm text-green-700 mb-2">{feedback.pronunciation.feedback}</p>
        {feedback.pronunciation.issues.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-green-800 mb-1">Проблемы:</p>
            <ul className="text-xs text-green-700 space-y-1">
              {feedback.pronunciation.issues.map((issue, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Словарь */}
      <div className="mb-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2">Словарь</h4>
        <p className="text-sm text-purple-700 mb-3">{feedback.vocabulary.feedback}</p>

        {feedback.vocabulary.targetWordsUsed.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-purple-800 mb-1">Использованные целевые слова:</p>
            <div className="flex flex-wrap gap-1">
              {feedback.vocabulary.targetWordsUsed.map((word) => (
                <span key={word} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {feedback.vocabulary.missingWords.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-purple-800 mb-1">Пропущенные слова:</p>
            <div className="flex flex-wrap gap-1">
              {feedback.vocabulary.missingWords.map((word) => (
                <span key={word} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {feedback.vocabulary.suggestions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-purple-800 mb-1">Предложения:</p>
            <div className="space-y-2">
              {feedback.vocabulary.suggestions.map((suggestion, idx) => (
                <div key={idx} className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
                  <strong>{suggestion.word}:</strong> {suggestion.example}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Грамматика */}
      <div className="mb-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-2">Грамматика</h4>
        <p className="text-sm text-orange-700 mb-3">{feedback.grammar.feedback}</p>

        {feedback.grammar.errors.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-orange-800 mb-2">Ошибки:</p>
            <div className="space-y-3">
              {feedback.grammar.errors.map((error, idx) => (
                <div key={idx} className="text-xs bg-orange-100 p-3 rounded">
                  <div className="mb-1">
                    <span className="font-medium text-red-700">Неправильно:</span> {error.text}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium text-green-700">Исправлено:</span> {error.correction}
                  </div>
                  <div>
                    <span className="font-medium text-orange-800">Объяснение:</span> {error.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Обработчик анализа сообщения
  const handleAnalyzeMessage = useCallback(async (messageContent: string) => {
    try {
      const feedback = await analyzeMessage(messageContent);
      openModal({
        component: <VoiceAnalysisModal feedback={feedback} />,
        closeOnOverlayClick: true,
      });
    } catch (error) {
      console.error('Failed to analyze message:', error);
      alert('Не удалось проанализировать сообщение');
    }
  }, [analyzeMessage, openModal]);

  // Обработчик оценки урока
  const handleAnalyzeLesson = useCallback(async () => {
    try {
      const feedback = await analyzeLesson();
      if (feedback) {
        openModal({
          component: <VoiceAnalysisModal feedback={feedback} />,
          closeOnOverlayClick: true,
        });
      }
    } catch (error) {
      console.error('Failed to analyze lesson:', error);
      alert('Не удалось оценить урок');
    }
  }, [analyzeLesson, openModal]);

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
    <div className="flex h-auto flex-col rounded-3xl bg-white p-6 shadow-sm">
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
            <div key={index} className={`relative group ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  message.role === 'assistant'
                    ? 'bg-white text-gray-700 shadow-sm'
                    : 'bg-primary-deep text-white shadow-sm justify-self-end relative'
                }`}
              >
                {message.role === 'user' && (
                  <div className="absolute -top-2 -left-16 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyzeMessage(message.content)}
                      disabled={isAnalyzingMessage}
                      className="h-6 px-2 text-xs bg-white border-gray-300 hover:bg-gray-50 shadow-sm whitespace-nowrap"
                      leftIcon={<BarChart3 className="size-3" />}
                    >
                      {isAnalyzingMessage ? '...' : 'Анализ'}
                    </Button>
                  </div>
                )}
                {message.role === 'user' ? (
                  <div dangerouslySetInnerHTML={{ __html: highlightTargetWords(message.content) }} />
                ) : (
                  message.content
                )}
              </div>
              {/* {message.role === 'user' && (
                <div className="absolute -top-2 -left-16 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeMessage(message.content)}
                    disabled={isAnalyzingMessage}
                    className="h-6 px-2 text-xs bg-white border-gray-300 hover:bg-gray-50 shadow-sm whitespace-nowrap"
                    leftIcon={<BarChart3 className="size-3" />}
                  >
                    {isAnalyzingMessage ? '...' : 'Анализ'}
                  </Button>
                </div>
              )} */}
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

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleAnalyzeLesson}
            disabled={isLoading || isRecording || isProcessing || isAnalyzingLesson || messages.filter(m => m.role === 'user').length === 0}
            className="flex-1"
            leftIcon={<MessageSquare className="size-4" />}
          >
            {isAnalyzingLesson ? 'Оцениваю...' : 'Оценить урок'}
          </Button>
          {taskId && userId && (
            <Button
              variant="default"
              onClick={handleCompleteLesson}
              disabled={isLoading || isRecording || isProcessing || isAnalyzingLesson}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              Завершить урок
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

