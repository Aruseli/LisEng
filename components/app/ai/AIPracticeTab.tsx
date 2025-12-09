'use client';

import { FormEvent, useRef, useState } from 'react';
import { Button } from '../Buttons/Button';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIPracticeTabProps {
  topic: string;
  messages: Message[];
  isLoading: boolean;
  suggestedPrompt?: string | null;
  onSendMessage: (message: string) => Promise<void> | void;
}

export function AIPracticeTab({ topic, messages, isLoading, suggestedPrompt, onSendMessage }: AIPracticeTabProps) {
  const [draft, setDraft] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const payload = draft.trim();
    setDraft('');
    await onSendMessage(payload);
  };

  const handleUseSuggestedPrompt = () => {
    if (!suggestedPrompt) return;
    setDraft(suggestedPrompt);
  };

  return (
    <div className="flex h-auto flex-col rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">AI-практика: {topic}</h2>
        <p className="text-sm text-gray-500">
          Общайся короткими фразами, задавай вопросы и повторяй новые слова. AI мягко поправит ошибки.
        </p>
        {suggestedPrompt && (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-3 text-xs text-indigo-700">
            <p className="font-semibold text-indigo-900">Предложенный промпт</p>
            <p>{suggestedPrompt}</p>
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={handleUseSuggestedPrompt}
            >
              Вставить в поле
            </Button>
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
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="self-start rounded-2xl bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
              AI думает...
            </div>
          )}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-4 flex gap-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ответь AI или задай вопрос..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm shadow-sm focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep"
        />
        <Button
          type="submit"
          disabled={isLoading}
          variant="default"
          leftIcon={<Send className="size-4" />}
        >
          Отправить
        </Button>
      </form>
    </div>
  );
}


