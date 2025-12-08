'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useHasyx } from 'hasyx';

import {
  createAISession,
  updateAISession,
  getAISession,
} from '@/lib/hasura-queries';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UseAISessionOptions {
  userId?: string | null;
  type: 'speaking' | 'writing' | 'ai_practice';
  topic?: string;
  level?: string;
  initialMessages?: Message[];
  suggestedPrompt?: string | null;
}

function messagesEqual(a: Message[], b: Message[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].role !== b[i].role || a[i].content !== b[i].content || a[i].timestamp !== b[i].timestamp) {
      return false;
    }
  }
  return true;
}

export function useAISession({
  userId,
  type,
  topic,
  level = 'A2',
  initialMessages = [],
  suggestedPrompt,
}: UseAISessionOptions) {
  const hasyx = useHasyx();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const initialMessagesRef = useRef<Message[]>(initialMessages);
  const isLoadedFromSessionRef = useRef<boolean>(false);

  useEffect(() => {
    // Не перезаписывать сообщения, если они уже загружены из сессии
    if (isLoadedFromSessionRef.current) {
      return;
    }
    if (messagesEqual(initialMessagesRef.current, initialMessages)) {
      return;
    }
    initialMessagesRef.current = initialMessages;
    setMessages(initialMessages);
  }, [initialMessages]);

  const ensureSession = useCallback(async () => {
    if (!hasyx || !userId) return null;
    if (sessionId) return sessionId;

    // Сначала проверяем существующую активную сессию
    const existingSession = await getAISession(hasyx, userId, type, topic);
    if (existingSession?.id) {
      setSessionId(existingSession.id);
      // Загружаем сохраненные сообщения из сессии
      if (existingSession.conversation && Array.isArray(existingSession.conversation)) {
        const loadedMessages = existingSession.conversation as Message[];
        setMessages(loadedMessages);
        isLoadedFromSessionRef.current = true;
        initialMessagesRef.current = loadedMessages;
      }
      return existingSession.id;
    }

    // Если сессии нет, создаем новую
    const result = await createAISession(hasyx, userId, type, topic);
    if (result?.id) {
      setSessionId(result.id);
      return result.id;
    }
    return null;
  }, [hasyx, userId, type, topic, sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!userId) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      await ensureSession();

      const endpoint =
        type === 'speaking' || type === 'ai_practice'
          ? '/api/ai/speaking'
          : '/api/ai/check-writing';

      // Для speaking/ai_practice отправляем messages, для writing - text/topic/level
      const requestBody =
        type === 'speaking' || type === 'ai_practice'
          ? {
              messages: nextMessages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            }
          : {
              userId: userId || '',
              topic: topic || 'Практика',
              level: level || 'A2',
              conversationHistory: nextMessages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              text: content,
            };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Ошибка сервера: ${response.status}`);
      }

      let aiText: string | undefined;

      if (type === 'writing') {
        // Для writing парсим JSON ответ
        const responseJson = await response.json();
        // API /api/ai/check-writing возвращает структуру:
        // { overall_quality, specific_areas_for_improvement, suggestions, errors_or_typos, rating }
        const fb = responseJson as {
          overall_quality?: string;
          specific_areas_for_improvement?: string[];
          suggestions?: string[];
          errors_or_typos?: string[];
          rating?: number;
        } | undefined;

        if (fb && (fb.overall_quality || fb.rating !== undefined || fb.suggestions || fb.errors_or_typos)) {
          const parts: string[] = [];

          if (typeof fb.rating === 'number') {
            parts.push(`Оценка: ${fb.rating}/5`);
          }

          if (fb.overall_quality) {
            parts.push(`Общий отзыв: ${fb.overall_quality}`);
          }

          if (Array.isArray(fb.specific_areas_for_improvement) && fb.specific_areas_for_improvement.length > 0) {
            const improvementsText = fb.specific_areas_for_improvement
              .map((item, idx) => `${idx + 1}. ${item}`)
              .join('\n');
            parts.push('Области для улучшения:\n' + improvementsText);
          }

          if (Array.isArray(fb.suggestions) && fb.suggestions.length > 0) {
            const suggestionsText = fb.suggestions
              .map((item, idx) => `${idx + 1}. ${item}`)
              .join('\n');
            parts.push('Предложения:\n' + suggestionsText);
          }

          if (Array.isArray(fb.errors_or_typos) && fb.errors_or_typos.length > 0) {
            const errorsText = fb.errors_or_typos
              .map((item, idx) => `${idx + 1}. ${item}`)
              .join('\n');
            parts.push('Ошибки и опечатки:\n' + errorsText);
          }

          aiText = parts.join('\n\n');
        } else {
          // fallback к старому формату, если структура другая
          aiText = responseJson?.correctedText || responseJson?.message;
        }
      } else {
        // speaking / ai_practice - API возвращает plain text
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/plain')) {
          aiText = await response.text();
        } else {
          // Если вернули JSON (на будущее)
          const responseJson = await response.json();
          aiText = responseJson?.message || responseJson?.content;
        }
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: aiText || 'Я пока не знаю, что ответить. Попробуй сформулировать иначе!',
        timestamp: new Date().toISOString(),
      };

      const updated = [...nextMessages, aiMessage];
      setMessages(updated);

      if (sessionId) {
        await updateAISession(hasyx, sessionId, {
          conversation: updated,
        });
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Произошла ошибка: ${error?.message || 'Не удалось отправить сообщение'}. Попробуй ещё раз.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [type, topic, level, messages, ensureSession, hasyx, sessionId, userId]);

  const startSession = useCallback(async () => {
    await ensureSession();
  }, [ensureSession]);

  const endSession = useCallback(
    async (feedback?: any) => {
      if (!sessionId || !hasyx || messages.length === 0) return;

      const durationMinutes = Math.max(
        1,
        Math.round(
          (new Date().getTime() - new Date(messages[0].timestamp).getTime()) / 60000
        )
      );

      await updateAISession(hasyx, sessionId, {
        conversation: messages,
        feedback,
        duration_minutes: durationMinutes,
        ended_at: new Date().toISOString(),
      });
    },
    [hasyx, sessionId, messages]
  );

  const resetSession = useCallback(() => {
    setSessionId(null);
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    startSession,
    sendMessage,
    endSession,
    resetSession,
    suggestedPrompt,
    hasSession: Boolean(sessionId),
  };
}