'use client';

import type { VocabularyQuestion, AnswerMetrics } from '@/types/level-test';
import { Button } from '../Buttons/Button';

interface VocabularyQuestionViewProps {
  question: VocabularyQuestion;
  answer?: number;
  onAnswer: (answer: number, metadata?: AnswerMetrics) => void;
}

export function VocabularyQuestionView({
  question,
  answer,
  onAnswer,
}: VocabularyQuestionViewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Словарь
      </h3>
      
      {question.context && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 italic">{question.context}</p>
        </div>
      )}
      
      <p className="text-base text-gray-700">{question.question}</p>
      
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(index)}
            variant={answer === index ? 'default' : 'outline'}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}



