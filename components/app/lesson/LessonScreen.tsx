'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'hasyx';

import { Button } from '@/components/app/Buttons/Button';
import { Skeleton } from '@/components/app/ui/Skeleton';
import type { LessonMaterials } from '@/lib/lesson/lesson-content-service';
import { PronunciationPractice } from './PronunciationPractice';
import { FlashcardPractice, type Flashcard } from '@/components/app/vocabulary/FlashcardPractice';
import { useClient } from 'hasyx';

interface LessonScreenProps {
  taskId: string;
}

type LessonFetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; lesson: LessonMaterials };

export function LessonScreen({ taskId }: LessonScreenProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [state, setState] = useState<LessonFetchState>({ status: 'loading' });
  const [pronunciationResult, setPronunciationResult] = useState<{
    accuracy: number | null;
    lowAccuracyWords: string[];
    flaggedWords: string[];
  }>({
    accuracy: null,
    lowAccuracyWords: [],
    flaggedWords: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardResults, setFlashcardResults] = useState<Array<{ cardId: string; wasCorrect: boolean; responseTime?: number; userSentence?: string }>>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const client = useClient();

  const loadLesson = useCallback(async () => {
    if (!userId) {
      return;
    }
    setState({ status: 'loading' });
    try {
      const response = await fetch('/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, taskId }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось загрузить урок');
      }

      const payload = await response.json();
      setState({ status: 'ready', lesson: payload.lesson as LessonMaterials });
    } catch (error: any) {
      setState({
        status: 'error',
        message: error?.message ?? 'Не удалось загрузить урок',
      });
    }
  }, [taskId, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    loadLesson();
  }, [userId, loadLesson]);

  const handleBack = () => {
    router.push('/');
  };

  const handleResultUpdate = useCallback(
    (result: {
      accuracy: number | null;
      lowAccuracyWords: string[];
      flaggedWords: string[];
    }) => {
      setPronunciationResult(result);
    },
    []
  );

  const lesson = state.status === 'ready' ? state.lesson : null;

  const readingScript = useMemo(() => {
    if (!lesson) return null;
    if (lesson.pronunciationScript) {
      return lesson.pronunciationScript;
    }
    if (lesson.readingPassages && lesson.readingPassages.length > 0) {
      return lesson.readingPassages[0].text;
    }
    return null;
  }, [lesson]);

  // Загрузка карточек для урока
  useEffect(() => {
    if (!userId || !lesson || !client) {
      return;
    }

    const loadCards = async () => {
      setIsLoadingCards(true);
      try {
        // Если есть targetWords в уроке, создаем карточки из них
        if (lesson.targetWords && lesson.targetWords.length > 0) {
          // Пытаемся найти существующие карточки для этих слов
          const cards = await client.select({
            table: 'vocabulary_cards',
            where: {
              user_id: { _eq: userId },
              word: { _in: lesson.targetWords },
            },
            returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
            limit: 20,
          });

          if (Array.isArray(cards) && cards.length > 0) {
            setFlashcards(
              cards.map((card) => ({
                id: card.id,
                word: card.word,
                translation: card.translation,
                exampleSentence: card.example_sentence,
                difficulty: card.difficulty,
              }))
            );
          } else {
            // Если карточек нет, загружаем новые/плохо освоенные слова
            const today = new Date().toISOString().split('T')[0];
            const reviewCards = await client.select({
              table: 'vocabulary_cards',
              where: {
                user_id: { _eq: userId },
                next_review_date: { _lte: today },
              },
              order_by: [{ next_review_date: 'asc' }],
              returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
              limit: 10,
            });

            if (Array.isArray(reviewCards) && reviewCards.length > 0) {
              setFlashcards(
                reviewCards.map((card) => ({
                  id: card.id,
                  word: card.word,
                  translation: card.translation,
                  exampleSentence: card.example_sentence,
                  difficulty: card.difficulty,
                }))
              );
            }
          }
        } else {
          // Если нет targetWords, загружаем новые/плохо освоенные слова
          const today = new Date().toISOString().split('T')[0];
          const reviewCards = await client.select({
            table: 'vocabulary_cards',
            where: {
              user_id: { _eq: userId },
              next_review_date: { _lte: today },
            },
            order_by: [{ next_review_date: 'asc' }],
            returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
            limit: 10,
          });

          if (Array.isArray(reviewCards) && reviewCards.length > 0) {
            setFlashcards(
              reviewCards.map((card) => ({
                id: card.id,
                word: card.word,
                translation: card.translation,
                exampleSentence: card.example_sentence,
                difficulty: card.difficulty,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load flashcards:', error);
      } finally {
        setIsLoadingCards(false);
      }
    };

    loadCards();
  }, [userId, lesson, client]);

  const handleFlashcardResults = useCallback(
    (results: Array<{ cardId: string; wasCorrect: boolean; responseTime?: number; userSentence?: string }>) => {
      setFlashcardResults(results);
    },
    []
  );

  const handleComplete = useCallback(async () => {
    if (!userId || !lesson) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          taskId,
          pronunciation: {
            accuracy: pronunciationResult.accuracy,
            lowAccuracyWords: pronunciationResult.lowAccuracyWords,
            flaggedWords: pronunciationResult.flaggedWords,
            script: readingScript,
          },
          flashcardResults: flashcardResults.length > 0 ? flashcardResults : undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось завершить урок');
      }

      router.push('/');
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Не удалось завершить урок');
    } finally {
      setIsSubmitting(false);
    }
      }, [lesson, pronunciationResult, readingScript, flashcardResults, router, taskId, userId]);

  if (!userId) {
    return (
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-center text-gray-600">Нужна авторизация, чтобы открыть урок.</p>
        <Button className="mt-4 w-full" onClick={() => router.push('/')}>
          Вернуться
        </Button>
      </div>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
        <p>{state.message}</p>
        <Button className="mt-4" variant="outline" onClick={loadLesson}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-6">
      <header className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Урок</p>
            <h1 className="text-2xl font-semibold text-gray-900">{lesson.overview}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack}>
              Назад
            </Button>
            <Button onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? 'Сохраняем...' : 'Завершить урок'}
            </Button>
          </div>
        </div>
        {lesson?.meta && (
          <p className="text-sm text-gray-500">
            Уровень {lesson.meta.level} → {lesson.meta.targetLevel}. Тип задания: {lesson.meta.taskType}
          </p>
        )}
      </header>
      {submitError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Пошаговое объяснение</h2>
        <ul className="list-decimal space-y-2 pl-5 text-gray-700">
          {lesson?.explanation.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </section>

      {lesson.keyPoints.length > 0 && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">На что обратить внимание</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson?.keyPoints.map((point) => (
              <span key={point} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {point}
              </span>
            ))}
          </div>
        </section>
      )}

      {lesson.examples.length > 0 && (
        <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Примеры</h3>
          <div className="space-y-3">
            {lesson?.examples.map((example, index) => (
              <div key={`${example.prompt}-${index}`} className="rounded-2xl bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{example.prompt}</p>
                <p className="text-sm text-gray-600">{example.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{lesson?.exercise.title}</h3>
        {lesson.exercise.steps.length > 0 && (
          <ol className="list-decimal space-y-2 pl-5 text-gray-700">
            {lesson?.exercise.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
        {lesson.exercise.questions.length > 0 && (
          <div className="mt-4 space-y-3">
            {lesson?.exercise.questions.map((question, index) => (
              <div key={`${question.prompt}-${index}`} className="rounded-2xl bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{question.prompt}</p>
                <p className="text-sm text-gray-600">Ожидается: {question.expectedAnswer}</p>
                {question.hint && <p className="text-xs text-gray-500">Подсказка: {question.hint}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {flashcards.length > 0 && (
        <FlashcardPractice
          cards={flashcards}
          onResult={handleFlashcardResults}
          title="Слова для повторения"
        />
      )}

      {readingScript && (
        <PronunciationPractice
          script={readingScript}
          targetWords={lesson?.targetWords ?? lesson?.readingPassages?.[0]?.targetWords ?? []}
          onResultChange={handleResultUpdate}
        />
      )}

      {pronunciationResult.flaggedWords.length > 0 && (
        <section className="rounded-3xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-semibold">Слова для повторения будут добавлены в словарь:</p>
          <p>{pronunciationResult.flaggedWords.join(', ')}</p>
        </section>
      )}
    </div>
  );
}


