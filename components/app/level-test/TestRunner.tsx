'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { Button } from '../Buttons/Button';
import type { TestQuestion, UserAnswer, TestResult, AnswerMetrics } from '@/types/level-test';
import { GrammarQuestionView } from './GrammarQuestionView';
import { VocabularyQuestionView } from './VocabularyQuestionView';
import { ReadingQuestionView } from './ReadingQuestionView';
import { ListeningQuestionView } from './ListeningQuestionView';
import { WritingQuestionView } from './WritingQuestionView';
import { SpeakingQuestionView } from './SpeakingQuestionView';
import { useToastStore } from '@/store/toastStore';
import { useLevelTestStore } from '@/store/levelTestStore';

interface TestRunnerProps {
  questions: TestQuestion[];
  onComplete: (result: TestResult) => void;
  onCancel: () => void;
}

export function TestRunner({ questions, onComplete, onCancel }: TestRunnerProps) {
  const { addToast } = useToastStore();
  const {
    questions: savedQuestions,
    currentQuestionIndex,
    answers,
    startTime,
    initializeTest,
    setCurrentQuestionIndex,
    addAnswer,
    clearTest,
    getCurrentAnswer,
    isTestInProgress,
  } = useLevelTestStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isInitializedRef = useRef(false);

  // Инициализация теста при монтировании (безопасно, без рекурсии)
  useEffect(() => {
    // Если уже инициализирован в этом монтировании - не трогаем
    if (isInitializedRef.current) return;

    // Проверяем, есть ли сохраненный тест и совместим ли он с текущими вопросами
    if (savedQuestions && isTestInProgress()) {
      // Проверяем совместимость сохраненных данных с текущими вопросами
      const isCompatible =
        savedQuestions.length === questions.length &&
        savedQuestions.every((q, i) => q.id === questions[i].id);

      if (isCompatible) {
        // Тест совместим, состояние уже восстановлено из Zustand - используем его
        addToast({
          message: 'Прогресс теста восстановлен',
          type: 'info',
        });
        isInitializedRef.current = true;
        return; // НЕ вызываем initializeTest - используем сохраненные данные
      } else {
        // Данные не совместимы, инициализируем новый тест
        clearTest();
        initializeTest(questions);
        isInitializedRef.current = true;
        return;
      }
    }

    // Нет сохраненного теста, инициализируем новый
    initializeTest(questions);
    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем только один раз при монтировании

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = useCallback((answer: string | number | number[], metrics?: AnswerMetrics) => {
    // Если startTime нет, используем 0 (может быть после восстановления из store)
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      timeSpent,
      metrics,
    };

    addAnswer(newAnswer);
  }, [currentQuestion, startTime, addAnswer]);

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
      
      // Сначала вызываем onComplete, потом очищаем состояние
      // Это гарантирует, что результат будет передан до очистки
      onComplete(result);
      
      // Очищаем состояние теста только после успешного завершения
      clearTest();
    } catch (error) {
      console.error('Failed to submit test:', error);
      addToast({
        message: 'Не удалось отправить тест. Попробуйте еще раз.',
        type: 'error',
      });
      // При ошибке НЕ очищаем тест - пользователь может повторить попытку
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderQuestion = () => {
    const currentAnswer = getCurrentAnswer(currentQuestion.id);

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
    <div className=" mx-auto pt-8 px-1 space-y-6">
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
      <div className="bg-white rounded-2xl border border-primary p-2">
        {renderQuestion()}
      </div>

      {/* Навигация */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            clearTest();
            onCancel();
          }}
          disabled={isSubmitting}
        >
          Отменить
        </Button>
        <div className="flex gap-2">
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
    </div>
  );
}



