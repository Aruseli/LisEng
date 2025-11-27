'use client';

import { useState, useEffect } from 'react';
import { Button } from './Buttons/Button';
import { useHasyx } from 'hasyx';
import { TestRunner } from './level-test/TestRunner';
import type { LevelTestData, TestResult } from '@/types/level-test';
import { useToastStore } from '@/store/toastStore';
import { useLevelTestStore } from '@/store/levelTestStore';

const SKILL_LABELS: Record<string, string> = {
  grammar: 'Грамматика',
  vocabulary: 'Словарь',
  reading: 'Чтение',
  listening: 'Аудирование',
  writing: 'Письмо',
  speaking: 'Говорение',
};

function buildReportContent(result: TestResult): string {
  const lines: string[] = [];
  lines.push('LisEng Level Test Report');
  lines.push(`Дата: ${new Date().toLocaleString('ru-RU')}`);
  lines.push('');
  lines.push(`Определённый уровень: ${result.level}`);
  lines.push(`Баллы: ${result.totalPoints} из ${result.maxPoints} (${Math.round(result.percentage)}%)`);
  lines.push('');
  lines.push('Детализация по навыкам:');
  Object.entries(result.breakdown).forEach(([skill, data]) => {
    if (data.maxPoints === 0) return;
    const percentage = Math.round((data.points / data.maxPoints) * 100);
    const label = SKILL_LABELS[skill] || skill;
    const status = percentage >= 70 ? 'норма' : 'требуется внимание';
    lines.push(`- ${label}: ${percentage}% (${status})`);
  });

  if (result.pronunciation) {
    lines.push('');
    lines.push('Произношение:');
    if (typeof result.pronunciation.listening === 'number') {
      lines.push(`- Аудирование (повтор текста): ${result.pronunciation.listening}%`);
    }
    if (typeof result.pronunciation.speaking === 'number') {
      lines.push(`- Говорение: ${result.pronunciation.speaking}%`);
    }
  }

  lines.push('');
  lines.push('Комментарий преподавателя:');
  lines.push(result.feedback);

  return lines.join('\n');
}
interface LevelTestModalProps {
  userId: string;
  onComplete: (level: string) => void;
  onSkip: () => void;
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LevelTestModal = ({ userId, onComplete, onSkip }: LevelTestModalProps) => {
  const { addToast } = useToastStore();
  const hasyx = useHasyx();
  const { questions: savedQuestions, isTestInProgress, clearTest } = useLevelTestStore();
  const [step, setStep] = useState<'select' | 'test' | 'manual' | 'running' | 'result'>('select');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [manualLevel, setManualLevel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<LevelTestData | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  // Проверяем, есть ли сохраненный тест при монтировании
  useEffect(() => {
    if (savedQuestions && isTestInProgress() && step === 'select') {
      // Есть сохраненный тест - восстановим testData из сохраненных questions
      setTestData({
        questions: savedQuestions,
        estimatedDuration: 0, // Не критично для восстановления
        levelRange: 'A2-B1', // Не критично для восстановления
      });
    }
  }, [savedQuestions, isTestInProgress, step]);

  const handleStartTest = async () => {
    setIsGeneratingTest(true);
    try {
      const response = await fetch('/api/level-test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimatedLevel: selectedLevel || 'A2',
          includeSpeaking: true,
          includeWriting: true,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        let errorMessage = errorBody.error || errorBody.details || 'Failed to generate test';
        
        // Проверяем, есть ли проблема с балансом кредитов
        if (response.status === 402 || errorMessage.includes('credit') || errorMessage.includes('balance') || errorMessage.includes('Insufficient credits')) {
          errorMessage = 'Недостаточно кредитов в аккаунте Anthropic. Пожалуйста, пополните баланс для использования AI функций. Тест будет сгенерирован с базовыми вопросами.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setTestData(data.test);
      setStep('running');
    } catch (error) {
      console.error('Failed to generate test:', error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось сгенерировать тест. Попробуйте еще раз.';
      addToast({ 
        message: errorMessage, 
        type: 'error' 
      });
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleTestComplete = async (result: TestResult) => {
    setTestResult(result);
    setStep('result');
  };

  const handleDownloadReport = () => {
    if (!testResult) return;
    const content = buildReportContent(testResult);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `liseng-level-test-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleAcceptResult = async () => {
    if (testResult) {
      await saveUserLevel(testResult.level);
    }
  };

  const handleSkipTest = () => {
    setStep('manual');
  };

  const handleManualLevelSubmit = async () => {
    if (!manualLevel || !LEVELS.includes(manualLevel.toUpperCase())) {
      addToast({ 
        message: 'Пожалуйста, выберите корректный уровень (A1, A2, B1, B2, C1, C2)', 
        type: 'error' 
      });
      return;
    }

    await saveUserLevel(manualLevel.toUpperCase());
  };


  const saveUserLevel = async (level: string) => {
    if (!hasyx) return;

    setIsLoading(true);
    try {
      await hasyx.upsert({
        table: 'users',
        object: {
          id: userId,
          current_level: level,
        },
        on_conflict: {
          constraint: process.env.NEXT_PUBLIC_USERS_PK_CONSTRAINT || 'users_pkey',
          update_columns: ['current_level'],
        },
        returning: ['id', 'current_level'],
      });

      // Небольшая задержка для UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      onComplete(level);
    } catch (error) {
      console.error('Failed to save user level:', error);
      addToast({ 
        message: 'Не удалось сохранить уровень. Попробуйте еще раз.', 
        type: 'error' 
      });
      // НЕ обнуляем модалку при ошибке - остаемся на экране результатов
      // Пользователь может попробовать еще раз или выбрать уровень вручную
      setIsLoading(false);
    }
  };

  // Экран выбора: пройти тест или ввести вручную
  if (step === 'select') {
    const hasSavedTest = savedQuestions && isTestInProgress();

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Определение уровня английского
          </h2>
          <p className="text-gray-600">
            Чтобы составить персональный план обучения, нам нужно узнать ваш уровень английского языка.
          </p>
        </div>

        {hasSavedTest ? (
          // Есть сохраненный тест - показываем кнопки для продолжения
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Обнаружен сохраненный прогресс теста.</strong> Вы можете продолжить прохождение теста или начать заново.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Восстанавливаем testData и переходим к тесту
                  if (savedQuestions) {
                    setTestData({
                      questions: savedQuestions,
                      estimatedDuration: 0,
                      levelRange: 'A2-B1',
                    });
                    setStep('running');
                  }
                }}
                className="p-6 rounded-2xl border border-primary bg-emerald-50 hover:bg-emerald-100 transition text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Продолжить тест
                </h3>
                <p className="text-sm text-gray-600">
                  Продолжить прохождение теста с сохраненным прогрессом.
                </p>
              </button>

              <button
                onClick={() => {
                  clearTest();
                  setStep('test');
                }}
                className="p-6 rounded-2xl border border-primary bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Начать заново
                </h3>
                <p className="text-sm text-gray-600">
                  Начать новый тест. Текущий прогресс будет удален.
                </p>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep('manual')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Указать уровень вручную
              </button>
            </div>
          </div>
        ) : (
          // Нет сохраненного теста - обычный экран выбора
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setStep('test');
              }}
              className="p-6 rounded-2xl border border-primary bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Пройти тест
              </h3>
              <p className="text-sm text-gray-600">
                Рекомендуется. Короткий тест поможет точно определить ваш уровень.
              </p>
            </button>

            <button
              onClick={() => setStep('manual')}
              className="p-6 rounded-2xl border border-primary bg-gray-50 hover:bg-gray-100 transition text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Указать вручную
              </h3>
              <p className="text-sm text-gray-600">
                Если вы уже знаете свой уровень, можете указать его сразу.
              </p>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Экран ввода уровня вручную
  if (step === 'manual') {
    return (
      <div className="mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Укажите ваш уровень
          </h2>
          <p className="text-gray-600">
            Выберите уровень, который лучше всего описывает ваши знания английского.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {LEVELS.map((level) => (
            <Button
              key={level}
              onClick={() => setManualLevel(level)}
              variant={manualLevel === level ? 'default' : 'outline'}
            >
              {level}
            </Button>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setStep('select')}
            disabled={isLoading}
          >
            Назад
          </Button>
          <Button
            onClick={handleManualLevelSubmit}
            disabled={!manualLevel || isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    );
  }

  // Экран подготовки к тесту
  if (step === 'test') {
    return (
      <div className="mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Тест на определение уровня
          </h2>
          <p className="text-gray-600">
            Тест займет около 10-15 минут. Вы ответите на вопросы по грамматике, словарю, чтению, аудированию, письму и говорению.
          </p>
        </div>

        {!selectedLevel && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Сначала укажите ваш предполагаемый уровень (для адаптации теста):
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((level) => (
                <Button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  variant={selectedLevel === level ? 'default' : 'outline'}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Совет:</strong> Отвечайте честно, не используйте словари или переводчики. Это поможет нам точно определить ваш уровень.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setStep('select')}
            disabled={isLoading || isGeneratingTest}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            onClick={handleSkipTest}
            disabled={isLoading || isGeneratingTest}
          >
            Пропустить тест
          </Button>
          <Button
            onClick={handleStartTest}
            disabled={isLoading || isGeneratingTest || !selectedLevel}
          >
            {isGeneratingTest ? 'Генерируем тест...' : 'Начать тест'}
          </Button>
        </div>
      </div>
    );
  }

  // Экран прохождения теста
  if (step === 'running' && testData) {
    return (
      <TestRunner
        questions={testData.questions}
        onComplete={handleTestComplete}
        onCancel={() => {
          // Очищаем сохраненное состояние при отмене
          // Zustand стор автоматически очистит персистентное хранилище
          setStep('select');
        }}
      />
    );
  }

  // Экран результатов
  if (step === 'result' && testResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Результаты теста
          </h2>
          <div className="text-4xl font-bold text-blue-600">
            {testResult.level}
          </div>
          <p className="text-gray-600">
            Вы набрали {testResult.totalPoints} из {testResult.maxPoints} баллов ({Math.round(testResult.percentage)}%)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Детализация по навыкам:</h3>
          <div className="space-y-2">
            {Object.entries(testResult.breakdown).map(([skill, data]) => {
              if (data.maxPoints === 0) return null;
              const percentage = (data.points / data.maxPoints) * 100;
              return (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700">{skill === 'grammar' ? 'Грамматика' : skill === 'vocabulary' ? 'Словарь' : skill === 'reading' ? 'Чтение' : skill === 'listening' ? 'Аудирование' : skill === 'writing' ? 'Письмо' : 'Говорение'}</span>
                    <span className="text-gray-600">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {testResult.pronunciation && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-2">
            <h3 className="font-semibold text-gray-900">Произношение</h3>
            {typeof testResult.pronunciation.listening === 'number' && (
              <p className="text-sm text-gray-700">
                Аудирование (повтор текста):{' '}
                <span className="font-semibold text-blue-600">
                  {testResult.pronunciation.listening}%
                </span>
              </p>
            )}
            {typeof testResult.pronunciation.speaking === 'number' && (
              <p className="text-sm text-gray-700">
                Говорение:{' '}
                <span className="font-semibold text-blue-600">
                  {testResult.pronunciation.speaking}%
                </span>
              </p>
            )}
            {typeof testResult.pronunciation.listening !== 'number' &&
              typeof testResult.pronunciation.speaking !== 'number' && (
              <p className="text-sm text-gray-500">
                Метрики произношения будут доступны после прохождения соответствующих заданий.
              </p>
            )}
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800">{testResult.feedback}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setStep('select')}
            disabled={isLoading}
          >
            Изменить уровень
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            disabled={isLoading}
          >
            Скачать отчёт (.txt)
          </Button>
          <Button
            onClick={handleAcceptResult}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить уровень'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

