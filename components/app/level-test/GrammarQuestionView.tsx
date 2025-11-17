'use client';

import type { GrammarQuestion, AnswerMetrics } from '@/types/level-test';

interface GrammarQuestionViewProps {
  question: GrammarQuestion;
  answer?: number;
  onAnswer: (answer: number, metadata?: AnswerMetrics) => void;
}

export function GrammarQuestionView({
  question,
  answer,
  onAnswer,
}: GrammarQuestionViewProps) {
  const isCorrectSelection =
    typeof answer === 'number' && answer === question.correctAnswer;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Грамматика
      </h3>
      <p className="text-base text-gray-700">{question.question}</p>
      
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={`w-full text-left p-4 rounded-xl border-2 transition ${
              answer === index
                ? 'border-primary bg-emerald-50 text-primary-deep'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {question.explanation && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            isCorrectSelection
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {isCorrectSelection ? (
            <p className="text-sm text-green-800">
              <strong>Объяснение:</strong> {question.explanation}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Подсказка появится после выбора правильного ответа.
            </p>
          )}
        </div>
      )}
    </div>
  );
}



