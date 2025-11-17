'use client';

import { useEffect, useState } from 'react';
import type { ReadingQuestion, AnswerMetrics } from '@/types/level-test';
import { Button } from '../Buttons/Button';

interface ReadingQuestionViewProps {
  question: ReadingQuestion;
  answer?: number[];
  onAnswer: (answer: number[], metadata?: AnswerMetrics) => void;
}

export function ReadingQuestionView({
  question,
  answer = [],
  onAnswer,
}: ReadingQuestionViewProps) {
  const [localAnswers, setLocalAnswers] = useState<number[]>(answer);

  useEffect(() => {
    setLocalAnswers(answer);
  }, [answer]);

  const handleSubQuestionAnswer = (subIndex: number, optionIndex: number) => {
    const newAnswers = [...localAnswers];
    newAnswers[subIndex] = optionIndex;
    setLocalAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Чтение
      </h3>
      
      <div className="p-6 bg-emerald-50 rounded-xl border border-primary">
        <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
          {question.text}
        </p>
      </div>

      <div className="space-y-6">
        {question.questions.map((subQuestion, subIndex) => (
          <div key={subIndex} className="space-y-3">
            <p className="text-base font-medium text-gray-900">
              {subIndex + 1}. {subQuestion.question}
            </p>
            <div className="space-y-2">
              {subQuestion.options.map((option, optionIndex) => (
                <Button
                  key={optionIndex}
                  onClick={() => handleSubQuestionAnswer(subIndex, optionIndex)}
                  variant={localAnswers[subIndex] === optionIndex ? 'default' : 'outline'}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



