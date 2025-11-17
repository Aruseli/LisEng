'use client';

import { useState, useEffect } from 'react';
import type { WritingQuestion, AnswerMetrics } from '@/types/level-test';

interface WritingQuestionViewProps {
  question: WritingQuestion;
  answer?: string;
  onAnswer: (answer: string, metadata?: AnswerMetrics) => void;
}

export function WritingQuestionView({
  question,
  answer = '',
  onAnswer,
}: WritingQuestionViewProps) {
  const [text, setText] = useState(answer);
  const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length;

  useEffect(() => {
    setText(answer);
  }, [answer]);

  const handleChange = (value: string) => {
    setText(value);
    onAnswer(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Письмо
      </h3>
      
      <div className="p-4 bg-emerald-50 border border-primary rounded-xl">
        <p className="text-base text-gray-700">{question.prompt}</p>
        {question.wordLimit && (
          <p className="text-sm text-gray-600 mt-2">
            Рекомендуемое количество слов: {question.wordLimit}
          </p>
        )}
      </div>

      {question.criteria && question.criteria.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-2">Критерии оценки:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {question.criteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Напишите ваш ответ здесь..."
        className="w-full min-h-[200px] p-4 border-1 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-y"
      />

      <div className="flex justify-between text-sm text-gray-600">
        <span>Слов: {wordCount}</span>
        {question.wordLimit && (
          <span
            className={
              wordCount >= question.wordLimit * 0.8 && wordCount <= question.wordLimit * 1.2
                ? 'text-primary-deep'
                : 'text-amber-600'
            }
          >
            Цель: {question.wordLimit} слов
          </span>
        )}
      </div>
    </div>
  );
}



