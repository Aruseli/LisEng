'use client';

import { useState, useMemo, useEffect } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '../Buttons/Button';
import { useIrregularVerbsTrainer } from '@/hooks/useIrregularVerbsTrainer';
import { useVerbPracticeSession } from '@/hooks/useVerbPracticeSession';
import { useVerbPronunciation } from '@/hooks/useVerbPronunciation';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';

interface VerbTrainerProps {
  verbs: VerbWithProgress[];
  onComplete: () => void;
}

export function VerbTrainer({ verbs, onComplete }: VerbTrainerProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const trainer = useIrregularVerbsTrainer({ verbs, mode: 'form-to-meaning' });
  const session = useVerbPracticeSession();
  const { speakInfinitive, isSpeaking } = useVerbPronunciation();

  // Start session on mount
  useEffect(() => {
    if (!session.isActive) {
      session.startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentForm = useMemo(() => {
    if (!trainer.currentVerb) return null;
    const forms = ['infinitive', 'past_simple', 'past_participle'];
    const randomForm = forms[Math.floor(Math.random() * forms.length)];
    return {
      type: randomForm,
      value:
        randomForm === 'infinitive'
          ? trainer.currentVerb.infinitive
          : randomForm === 'past_simple'
          ? trainer.currentVerb.past_simple.split('/')[0]
          : trainer.currentVerb.past_participle.split('/')[0],
    };
  }, [trainer.currentVerb]);

  const expectedAnswer = useMemo(() => {
    if (!trainer.currentVerb) return '';
    // For form-to-meaning mode, we show a form and ask for translation
    // For now, we'll show the infinitive and ask for past/past participle
    if (currentForm?.type === 'infinitive') {
      return `${trainer.currentVerb.past_simple.split('/')[0]} / ${trainer.currentVerb.past_participle.split('/')[0]}`;
    } else if (currentForm?.type === 'past_simple') {
      return trainer.currentVerb.infinitive;
    } else {
      return trainer.currentVerb.infinitive;
    }
  }, [trainer.currentVerb, currentForm]);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !trainer.currentVerb) return;

    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.toLowerCase().split(' / ');

    const correct =
      normalizedExpected.some((exp) => normalizedAnswer.includes(exp.toLowerCase())) ||
      normalizedAnswer === normalizedExpected[0] ||
      normalizedAnswer === normalizedExpected[1];

    setIsCorrect(correct);
    setShowResult(true);

    await trainer.submitAnswer(userAnswer, correct);
    session.recordResult(trainer.currentVerb.id, correct);
  };

  const handleNext = () => {
    setUserAnswer('');
    setShowResult(false);
    trainer.nextVerb();

    if (trainer.isComplete) {
      session.endSession();
      onComplete();
    }
  };

  if (trainer.isComplete) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-2xl font-semibold text-green-900 mb-4">
          Тренировка завершена!
        </h3>
        <p className="text-green-700 mb-4">
          Ты повторил {verbs.length} {verbs.length === 1 ? 'глагол' : 'глаголов'}.
        </p>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-green-600">
            Правильно: {session.sessionStats.correctCount}
          </p>
          <p className="text-sm text-green-600">
            Ошибок: {session.sessionStats.incorrectCount}
          </p>
          <p className="text-sm text-green-600">
            Точность: {Math.round(session.sessionStats.accuracy * 100)}%
          </p>
        </div>
        <Button onClick={onComplete} variant="default">
          Вернуться к списку
        </Button>
      </div>
    );
  }

  if (!trainer.currentVerb || !currentForm) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Тренировка: {trainer.results.length + 1} / {verbs.length}
        </h3>
        <Button onClick={onComplete} variant="outline" size="sm">
          Выйти
        </Button>
      </div>

      <div className="space-y-6">
        {/* Question */}
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {currentForm.type === 'infinitive'
              ? 'Напиши формы прошедшего времени и причастия'
              : currentForm.type === 'past_simple'
              ? 'Напиши инфинитив этого глагола'
              : 'Напиши инфинитив этого глагола'}
          </p>
          <p className="text-4xl font-bold text-indigo-900 mb-4">{currentForm.value}</p>
          <Button
            onClick={() => speakInfinitive(currentForm.value)}
            variant="outline"
            size="sm"
            disabled={isSpeaking}
          >
            🔊 Произнести
          </Button>
        </div>

        {/* Answer input */}
        {!showResult ? (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              placeholder="Введи ответ..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <Button onClick={handleSubmit} variant="default" className="w-full" size="lg">
              Проверить
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border-2 p-6 ${
                isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <X className="h-6 w-6 text-red-600" />
                )}
                <p
                  className={`text-lg font-semibold ${
                    isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {isCorrect ? 'Правильно!' : 'Неправильно'}
                </p>
              </div>
              {!isCorrect && (
                <p className="text-sm text-red-800 mb-2">
                  Правильный ответ: <strong>{expectedAnswer}</strong>
                </p>
              )}
              <p className="text-sm text-gray-700">
                {trainer.currentVerb.infinitive} — {trainer.currentVerb.past_simple} —{' '}
                {trainer.currentVerb.past_participle}
              </p>
            </div>
            <Button onClick={handleNext} variant="default" className="w-full" size="lg">
              Следующий <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

