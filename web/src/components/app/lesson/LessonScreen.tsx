
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/compat/navigation';
import { useSession } from '@/lib/compat/hasyx';

import { Button } from '@/components/app/Buttons/Button';
import { Skeleton } from '@/components/app/ui/Skeleton';
import type { LessonMaterials } from '@/lib/lesson/lesson-content-service';
import { PronunciationPractice } from './PronunciationPractice';
import { ListeningPlayer } from '@/components/app/listening/ListeningPlayer';
import { type Flashcard } from '@/components/app/vocabulary/FlashcardPractice';
import { useAppData } from '@/lib/app-data';
import { BackArrow } from '@/components/icons/BackArrow';
import { IconButton } from '../Buttons/IconButton';
import { SwipeCard } from '../vocabulary/SwipeCard';
import { ClickableText } from './ClickableText';
import { useModalStore } from '@/store/modalStore';
import { invalidateLessonQueries } from '@/lib/query-keys';

interface LessonScreenProps {
  taskId: string;
}

type LessonFetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; lesson: LessonMaterials };

export function LessonScreen({ taskId }: LessonScreenProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
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
  const [canGenerateLevelPack, setCanGenerateLevelPack] = useState(false);
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
  const [questionResults, setQuestionResults] = useState<Record<number, boolean | null>>({});
  const [checkingAnswers, setCheckingAnswers] = useState<Record<number, boolean>>({});
  // Неудачные попытки по каждому вопросу — уходят в problem_areas снапшота при завершении урока
  const [questionAttempts, setQuestionAttempts] = useState<Record<number, Array<{ answer: string; feedback: string | null }>>>({});
  const [shownSuccessModals, setShownSuccessModals] = useState<Set<number>>(new Set());
  const [errorMessages, setErrorMessages] = useState<Record<number, string>>({});
  const { currentLevel, completeTask } = useAppData();
  const userLevel = currentLevel || 'A2';
  const queryClient = useQueryClient();
  const [vocabAnswered, setVocabAnswered] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const loadLesson = useCallback(async (signal?: AbortSignal) => {
    if (!userId) {
      return;
    }

    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    setState({ status: 'loading' });
    try {
      const response = await fetch('/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, taskId }),
        signal,
      });

      if (signal?.aborted) return;

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось собрать урок');
      }

      const payload = await response.json();
      setState({ status: 'ready', lesson: payload.lesson as LessonMaterials });
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      setState({
        status: 'error',
        message: error?.message ?? 'Не удалось собрать урок',
      });
    }
  }, [taskId, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const ac = new AbortController();

    const start = () => {
      if (typeof document === 'undefined' || !document.hidden) {
        void loadLesson(ac.signal);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        void loadLesson(ac.signal);
      }
    };

    if (typeof document !== 'undefined' && document.hidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        ac.abort();
      };
    }

    start();
    return () => ac.abort();
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
  const primaryTranscript = useMemo(() => {
    if (!lesson || !lesson.readingPassages || lesson.readingPassages.length === 0) {
      return '';
    }
    return lesson.readingPassages[0]?.text ?? '';
  }, [lesson]);
  const isListeningLesson = lesson?.meta?.taskType === 'listening';
  const isReadingLesson = lesson?.meta?.taskType === 'reading';
  const hasReadingText = Boolean(lesson?.readingPassages && lesson.readingPassages.length > 0 && lesson.readingPassages[0]?.text);

  useEffect(() => {
    if (!userId || !lesson || lesson.meta?.taskType !== 'vocabulary') {
      return;
    }

    const loadCards = async () => {
      setIsLoadingCards(true);
      try {
        const res = await fetch(`/api/lesson/cards?taskId=${encodeURIComponent(taskId)}`);
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body.error || 'Не удалось загрузить карточки');
        }
        const cards = Array.isArray(body.cards) ? body.cards : [];
        setFlashcards(cards);
        setVocabAnswered(0);
        setCanGenerateLevelPack(Boolean(body.canGenerateLevelPack) && cards.length === 0);
      } catch (error) {
        console.error('Failed to load flashcards:', error);
        setFlashcards([]);
        setCanGenerateLevelPack(lesson.meta?.taskType === 'vocabulary');
      } finally {
        setIsLoadingCards(false);
      }
    };

    loadCards();
  }, [userId, lesson, taskId]);

  const generateLevelPack = async () => {
    setIsGeneratingPack(true);
    try {
      const generateResponse = await fetch('/api/vocabulary/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, level: userLevel }),
      });
      if (generateResponse.ok) {
        const res = await fetch(`/api/lesson/cards?taskId=${encodeURIComponent(taskId)}`);
        const body = await res.json().catch(() => ({}));
        setFlashcards(Array.isArray(body.cards) ? body.cards : []);
        setCanGenerateLevelPack(false);
      }
    } finally {
      setIsGeneratingPack(false);
    }
  };

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
      // Вопросы, где были ошибочные попытки — для problem_areas снапшота
      const exerciseResults = (lesson.exercise.questions ?? [])
        .map((question, index) => ({
          prompt: question.prompt,
          kind: question.kind ?? null,
          finalAnswer: questionAnswers[index] ?? '',
          attempts: questionAttempts[index] ?? [],
        }))
        .filter((item) => item.attempts.length > 0);

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
          exerciseResults: exerciseResults.length > 0 ? exerciseResults : undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Не удалось завершить урок');
      }

      await completeTask(taskId);
      await invalidateLessonQueries(queryClient, userId);
      router.push('/');
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Не удалось завершить урок');
    } finally {
      setIsSubmitting(false);
    }
      }, [lesson, pronunciationResult, readingScript, flashcardResults, questionAnswers, questionAttempts, router, taskId, userId, completeTask, queryClient]);

  // Показываем загрузку, пока сессия загружается
  if (status === 'loading') {
    return (
      <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // Показываем ошибку только если точно не авторизован
  if (status === 'unauthenticated' || !userId) {
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
        <Button className="mt-4" variant="outline" onClick={() => void loadLesson()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  const taskType = lesson.meta?.taskType;
  const questions = lesson.exercise.questions ?? [];
  const correctCount = questions.filter((_, index) => questionResults[index] === true).length;
  const questionsDone = questions.length === 0 || questions.every((_, index) => questionResults[index] === true);
  const isVocabLesson = taskType === 'vocabulary';
  const vocabDone = !isVocabLesson || (flashcards.length > 0 && vocabAnswered >= flashcards.length);
  const needsPronunciation =
    taskType === 'speaking' ||
    Boolean((lesson.meta as { requiresPronunciation?: boolean } | undefined)?.requiresPronunciation);
  const pronunciationDone = !needsPronunciation || pronunciationResult.accuracy !== null;
  const hasInteractive =
    (questions.length > 0 && !isVocabLesson) ||
    (isVocabLesson && (flashcards.length > 0 || canGenerateLevelPack)) ||
    needsPronunciation;
  const canComplete = !hasInteractive || (questionsDone && vocabDone && pronunciationDone);
  let completeHint = 'Завершить урок';
  if (isVocabLesson && flashcards.length === 0) {
    completeHint = 'Сначала сгенерируй или дождись карточек';
  } else if (isVocabLesson && vocabAnswered < flashcards.length) {
    completeHint = `Ответь на все карточки (${vocabAnswered}/${flashcards.length})`;
  } else if (questions.length > 0 && !isVocabLesson && !questionsDone) {
    completeHint = `Ответь на все упражнения (${correctCount}/${questions.length})`;
  } else if (needsPronunciation && pronunciationResult.accuracy === null) {
    completeHint = 'Сделай хотя бы одну запись произношения';
  }

  return (
    <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-6">
      <header className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Урок</p>
            <h1 className="text-2xl font-semibold text-gray-900">{lesson.overview}</h1>
          </div>
          <div className="flex space-x-3">
            <IconButton icon={<BackArrow className="size-8" />} ariaLabel="Назад" variant="ghost" onClick={handleBack} />
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

      {hasReadingText && lesson?.readingPassages && (
        <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            {isReadingLesson ? 'Текст для чтения' : 'Текст задания'}
          </h3>
          <div className="space-y-4">
            {lesson.readingPassages.map((passage, index) => (
              <article
                key={passage.title ? `${passage.title}-${index}` : index}
                className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                {passage.title && (
                  <p className="text-sm font-semibold text-gray-800">{passage.title}</p>
                )}
                {isReadingLesson && userId ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    <ClickableText
                      text={passage.text ?? ''}
                      userId={userId}
                      userLevel={userLevel}
                      onWordAdded={(word) => {
                        console.log('Word added to vocabulary:', word);
                      }}
                    />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {passage.text ?? ''}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {isListeningLesson && primaryTranscript && (
        <section className="space-y-3 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Диалог для прослушивания</h3>
          <ListeningPlayer transcript={primaryTranscript} />
        </section>
      )}

      {/* Для vocabulary уроков карточки показываем ПЕРЕД exercise */}
      {lesson.meta?.taskType === 'vocabulary' && (
        <>
          {flashcards.length > 0 ? (
            // <FlashcardPractice
            //   cards={flashcards}
            //   onResult={handleFlashcardResults}
            //   title="Карточки для повторения"
            // />
            <SwipeCard
              cards={flashcards}
              onResult={handleFlashcardResults}
              onProgress={(answered) => setVocabAnswered(answered)}
              onCardUpdated={(card) => {
                setFlashcards((prev) => prev.map((item) => (item.id === card.id ? card : item)));
              }}
              title="Карточки для повторения"
            />
          ) : isLoadingCards ? (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Загружаем карточки...</p>
            </section>
          ) : (
            <section className="space-y-3 rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
              <p className="text-sm text-amber-800">Нечего повторять — в словаре пока нет карточек на сегодня.</p>
              {canGenerateLevelPack && (
                <Button onClick={generateLevelPack} disabled={isGeneratingPack}>
                  {isGeneratingPack ? 'Генерируем…' : 'Сгенерировать набор под мой уровень'}
                </Button>
              )}
            </section>
          )}
        </>
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
        {/* Для vocabulary уроков показываем questions как fallback, если карточек нет */}
        {lesson.meta?.taskType === 'vocabulary' && flashcards.length === 0 && lesson.exercise.questions.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Слова для изучения:</p>
            {lesson?.exercise.questions.map((question, index) => (
              <div key={`${question.prompt}-${index}`} className="rounded-2xl bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{question.prompt}</p>
                <p className="text-sm text-gray-600">Перевод: {question.expectedAnswer}</p>
                {question.hint && <p className="text-xs text-gray-500">Подсказка: {question.hint}</p>}
              </div>
            ))}
          </div>
        )}
        {/* Для остальных типов уроков показываем questions как обычно */}
        {lesson.meta?.taskType !== 'vocabulary' && lesson.exercise.questions.length > 0 && (
          <div className="mt-4 space-y-3">
            {lesson?.exercise.questions.map((question, index) => {
              const userAnswer = questionAnswers[index] || '';
              const isCorrect = questionResults[index];
              const isGrammarLesson = lesson.meta?.taskType === 'grammar';
              const hasMissingVerb = question.prompt?.includes('___') || question.prompt?.toLowerCase().includes('[глагол]') || question.prompt?.toLowerCase().includes('глагол');
              const ruleHint = question.hint || (Array.isArray(question.evaluationCriteria) ? question.evaluationCriteria[0] : null);
              const isTranslationQuestion =
                question.kind === 'translation' || question.prompt?.trimStart().startsWith('Перевед');

              const handleAnswer = async () => {
                const normalize = (text: string) => {
                  if (!text) return '';
                  return text
                    .trim()
                    .toLowerCase()
                    .replace(/[.,!?;:'"]/g, '')
                    .replace(/\s+/g, ' ');
                };

                const normalizedUserAnswer = normalize(userAnswer);
                const normalizedExpected = normalize(question.expectedAnswer || '');
                let correct = normalizedUserAnswer === normalizedExpected ||
                  (normalizedExpected.length > 20 && normalizedExpected.includes(normalizedUserAnswer)) ||
                  (normalizedUserAnswer.length > 20 && normalizedUserAnswer.includes(normalizedExpected));

                let aiFeedback: string | null = null;

                // Строковое совпадение не сработало — для открытых заданий
                // («составь предложение») эталон лишь пример, поэтому проверяем
                // семантически: соответствие грамматическому требованию,
                // порядок слов и орфографию.
                if (!correct) {
                  setCheckingAnswers((prev) => ({ ...prev, [index]: true }));
                  try {
                    const res = await fetch('/api/ai/check-answer', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        prompt: question.prompt,
                        expectedAnswer: question.expectedAnswer,
                        hint: question.hint,
                        evaluationCriteria: question.evaluationCriteria,
                        answer: userAnswer,
                        topic: lesson?.overview,
                        level: lesson?.meta?.level ?? userLevel,
                      }),
                    });
                    if (res.ok) {
                      const verdict = (await res.json()) as {
                        correct?: boolean;
                        feedback?: string;
                        corrected?: string | null;
                      };
                      correct = Boolean(verdict.correct);
                      if (!correct && verdict.feedback) {
                        aiFeedback = verdict.corrected
                          ? `${verdict.feedback} Исправленный вариант: «${verdict.corrected}».`
                          : verdict.feedback;
                      }
                    }
                  } catch (checkError) {
                    console.warn('AI answer check failed, falling back to string match:', checkError);
                  } finally {
                    setCheckingAnswers((prev) => ({ ...prev, [index]: false }));
                  }
                }

                setQuestionResults((prev) => ({ ...prev, [index]: correct }));

                if (correct && isGrammarLesson && hasMissingVerb && !shownSuccessModals.has(index)) {
                  setShownSuccessModals((prev) => new Set(prev).add(index));
                  const modalId = openModal({
                    component: (
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-semibold text-green-900 mb-4">
                          Правильно!
                        </h3>
                        <p className="text-gray-700 mb-6">
                          Отличная работа! Ты правильно использовал форму глагола.
                        </p>
                        <Button onClick={() => closeModal(modalId)}>
                          Продолжить
                        </Button>
                      </div>
                    ),
                    closeOnOverlayClick: true,
                  });
                }

                if (!correct) {
                  setQuestionAttempts((prev) => ({
                    ...prev,
                    [index]: [...(prev[index] ?? []), { answer: userAnswer, feedback: aiFeedback }],
                  }));
                  setErrorMessages((prev) => ({
                    ...prev,
                    [index]: aiFeedback ?? `Эталон: «${question.expectedAnswer}».${ruleHint ? ` ${ruleHint}` : ''}`,
                  }));
                } else {
                  setErrorMessages((prev) => {
                    const newMessages = { ...prev };
                    delete newMessages[index];
                    return newMessages;
                  });
                }
              };

              const handleRetry = () => {
                setQuestionResults((prev) => ({ ...prev, [index]: null }));
                setErrorMessages((prev) => {
                  const next = { ...prev };
                  delete next[index];
                  return next;
                });
              };

              return (
                <div key={`${question.prompt}-${index}`} className="rounded-2xl bg-gray-50 p-4 space-y-2">
                  {isTranslationQuestion && (
                    <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      Перевод
                    </span>
                  )}
                  <p className="font-medium text-gray-900">{question.prompt}</p>
                  {isTranslationQuestion ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setQuestionAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
                        placeholder="Введите перевод..."
                        rows={3}
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep"
                        disabled={isCorrect === true}
                      />
                      <button
                        onClick={() => void handleAnswer()}
                        disabled={!userAnswer.trim() || isCorrect === true || checkingAnswers[index]}
                        className="self-end rounded-lg bg-primary-deep px-4 py-2 text-sm font-medium text-white hover:bg-primary-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkingAnswers[index] ? 'Проверяем…' : 'Ответить'}
                      </button>
                    </div>
                  ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setQuestionAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
                      placeholder="Введите ответ..."
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep"
                      disabled={isCorrect === true}
                    />
                    <button
                      onClick={() => void handleAnswer()}
                      disabled={!userAnswer.trim() || isCorrect === true || checkingAnswers[index]}
                      className="rounded-lg bg-primary-deep px-4 py-2 text-sm font-medium text-white hover:bg-primary-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkingAnswers[index] ? 'Проверяем…' : 'Ответить'}
                    </button>
                  </div>
                  )}
                  {isCorrect === true && (
                    <p className="text-sm text-green-600 font-medium">✓ Правильно!</p>
                  )}
                  {isCorrect === false && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 space-y-2">
                      <p className="text-sm text-red-700 font-medium">
                        ✗ {errorMessages[index] || `Эталон: «${question.expectedAnswer}».`}
                      </p>
                      {question.expectedAnswer && (
                        <p className="text-sm text-red-800">
                          Правильный ответ: <strong>{question.expectedAnswer}</strong>
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="text-sm font-medium text-red-800 underline"
                      >
                        Попробовать снова
                      </button>
                    </div>
                  )}
                  {question.hint && <p className="text-xs text-gray-500 mt-1">Подсказка: {question.hint}</p>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Для остальных типов уроков карточки показываем после exercise */}
      {/* {lesson.meta?.taskType !== 'vocabulary' && flashcards.length > 0 && (
        // <FlashcardPractice
        //   cards={flashcards}
        //   onResult={handleFlashcardResults}
        //   title="Слова для повторения"
        // />
        <SwipeCard
          cards={flashcards}
          onResult={handleFlashcardResults}
          title="Слова для повторения"
        />
      )} */}

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

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {!canComplete && (
          <p className="mb-3 text-sm text-gray-500">{completeHint}</p>
        )}
        <Button
          onClick={handleComplete}
          disabled={isSubmitting || !canComplete}
          className="w-full"
        >
          {isSubmitting ? 'Сохраняем...' : 'Завершить урок'}
        </Button>
      </section>
    </div>
  );
}


