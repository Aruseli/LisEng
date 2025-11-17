'use client';

import { useState, useCallback } from 'react';
import { Button } from '../Buttons/Button';
import type { TestQuestion, UserAnswer, TestResult, AnswerMetrics } from '@/types/level-test';
import { GrammarQuestionView } from './GrammarQuestionView';
import { VocabularyQuestionView } from './VocabularyQuestionView';
import { ReadingQuestionView } from './ReadingQuestionView';
import { ListeningQuestionView } from './ListeningQuestionView';
import { WritingQuestionView } from './WritingQuestionView';
import { SpeakingQuestionView } from './SpeakingQuestionView';
import { useToastStore } from '@/store/toastStore';

interface TestRunnerProps {
  questions: TestQuestion[];
  onComplete: (result: TestResult) => void;
  onCancel: () => void;
}

export function TestRunner({ questions, onComplete, onCancel }: TestRunnerProps) {
  const { addToast } = useToastStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = useCallback((answer: string | number | number[], metrics?: AnswerMetrics) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer,
        timeSpent,
        metrics,
      };

      if (existingAnswerIndex >= 0) {
        const updated = [...prevAnswers];
        updated[existingAnswerIndex] = newAnswer;
        return updated;
      }

      return [...prevAnswers, newAnswer];
    });
  }, [currentQuestion, startTime]);

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/level-test/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate test');
      }

      const result = await response.json();
      onComplete(result);
    } catch (error) {
      console.error('Failed to submit test:', error);
      addToast({
        message: 'Не удалось отправить тест. Попробуйте еще раз.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentAnswer = (): UserAnswer | undefined => {
    return answers.find((a) => a.questionId === currentQuestion.id);
  };

  const renderQuestion = () => {
    const currentAnswer = getCurrentAnswer();

    switch (currentQuestion.type) {
      case 'grammar':
        return (
          <GrammarQuestionView
            question={currentQuestion}
            answer={typeof currentAnswer?.answer === 'number' ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      case 'vocabulary':
        return (
          <VocabularyQuestionView
            question={currentQuestion}
            answer={typeof currentAnswer?.answer === 'number' ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      case 'reading':
        return (
          <ReadingQuestionView
            question={currentQuestion}
            answer={Array.isArray(currentAnswer?.answer) ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      case 'listening':
        return (
          <ListeningQuestionView
            question={currentQuestion}
            answer={Array.isArray(currentAnswer?.answer) ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      case 'writing':
        return (
          <WritingQuestionView
            question={currentQuestion}
            answer={typeof currentAnswer?.answer === 'string' ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      case 'speaking':
        return (
          <SpeakingQuestionView
            question={currentQuestion}
            answer={typeof currentAnswer?.answer === 'string' ? currentAnswer.answer : undefined}
            onAnswer={handleAnswer}
          />
        );
      default:
        return <div>Неизвестный тип вопроса</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Прогресс */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Вопрос */}
      <div className="bg-white rounded-2xl border border-primary p-6">
        {renderQuestion()}
      </div>

      {/* Навигация */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Отправка...'
            : isLastQuestion
            ? 'Завершить тест'
            : 'Далее'}
        </Button>
      </div>
    </div>
  );
}



