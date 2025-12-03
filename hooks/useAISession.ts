'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useHasyx } from 'hasyx';

import {
  createAISession,
  updateAISession,
} from '@/lib/hasura-queries';
import type { WritingFeedback } from '@/types/writing-feedback';

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

  useEffect(() => {
    if (messagesEqual(initialMessagesRef.current, initialMessages)) {
      return;
    }
    initialMessagesRef.current = initialMessages;
    setMessages(initialMessages);
  }, [initialMessages]);

  const ensureSession = useCallback(async () => {
    if (!hasyx || !userId) return null;
    if (sessionId) return sessionId;

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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'Практика',
          level: level || 'A2',
          conversationHistory: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          text: type === 'writing' ? content : undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Ошибка сервера: ${response.status}`);
      }

      const responseJson = await response.json();

      let aiText: string | undefined;

      if (type === 'writing') {
        // Пытаемся распарсить ответ как WritingFeedback и собрать человекочитаемый текст
        const fb = responseJson as Partial<WritingFeedback> | undefined;

        if (fb && (fb.score !== undefined || fb.feedback || fb.corrections)) {
          const parts: string[] = [];

          if (typeof fb.score === 'number') {
            parts.push(`Оценка за письмо: ${fb.score}/10.`);
          }

          if (fb.feedback) {
            parts.push(`Общий отзыв: ${fb.feedback}`);
          }

          if (Array.isArray(fb.corrections) && fb.corrections.length > 0) {
            const correctionsText = fb.corrections
              .map((c, idx) => {
                const num = `${idx + 1}.`;
                const original = c.original ? `«${c.original}»` : '';
                const corrected = c.corrected ? ` → «${c.corrected}»` : '';
                const explanation = c.explanation ? ` (${c.explanation})` : '';
                return `${num} ${original}${corrected}${explanation}`.trim();
              })
              .join('\n');

            parts.push('Исправления:\n' + correctionsText);
          }

          aiText = parts.join('\n\n');
        } else {
          // fallback к старому формату, если структура другая
          aiText = responseJson?.correctedText || responseJson?.message;
        }
      } else {
        // speaking / ai_practice
        aiText = responseJson?.message;
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