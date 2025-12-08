'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'hasyx';

import { Button } from '@/components/app/Buttons/Button';
import { Skeleton } from '@/components/app/ui/Skeleton';
import type { LessonMaterials } from '@/lib/lesson/lesson-content-service';
import { PronunciationPractice } from './PronunciationPractice';
import { ListeningPlayer } from '@/components/app/listening/ListeningPlayer';
import { FlashcardPractice, type Flashcard } from '@/components/app/vocabulary/FlashcardPractice';
import { useHasyx } from 'hasyx';
import { BackArrow } from '@/components/icons/BackArrow';
import { IconButton } from '../Buttons/IconButton';
import { SwipeCard } from '../vocabulary/SwipeCard';
import { ClickableText } from './ClickableText';
import { useModalStore } from '@/store/modalStore';

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
  const [userLevel, setUserLevel] = useState<string>('A2');
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
  const [questionResults, setQuestionResults] = useState<Record<number, boolean | null>>({});
  const [shownSuccessModals, setShownSuccessModals] = useState<Set<number>>(new Set());
  const [errorMessages, setErrorMessages] = useState<Record<number, string>>({});
  const hasyx = useHasyx();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const loadLesson = useCallback(async () => {
    if (!userId) {
      return;
    }
    
    // Не загружаем урок, если вкладка не видна
    if (typeof document !== 'undefined' && document.hidden) {
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
    
    // Загружаем урок только если вкладка видна
    if (typeof document !== 'undefined' && document.hidden) {
      // Если вкладка скрыта, ждем когда она станет видимой
      const handleVisibilityChange = () => {
        if (!document.hidden && userId) {
          loadLesson();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    
    loadLesson();
  }, [userId, loadLesson]);

  // Загрузка уровня пользователя
  useEffect(() => {
    if (!userId || !hasyx) {
      return;
    }

    const loadUserLevel = async () => {
      try {
        const userProfile = await hasyx.select({
          table: 'users',
          pk_columns: { id: userId },
          returning: ['current_level'],
        });

        const user = Array.isArray(userProfile) ? userProfile[0] : userProfile;
        if (user?.current_level) {
          setUserLevel(user.current_level);
        }
      } catch (error) {
        console.error('Failed to load user level:', error);
      }
    };

    loadUserLevel();
  }, [userId, hasyx]);

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

  // Загрузка карточек для урока
  useEffect(() => {
    if (!userId || !lesson || !hasyx) {
      return;
    }

    const loadCards = async () => {
      setIsLoadingCards(true);
      try {
        // Загружаем данные задания для получения type_specific_payload через API
        let taskData: { type_specific_payload?: Record<string, any> } | null = null;
        try {
          const taskResponse = await fetch(`/api/lesson/task?taskId=${taskId}`);
          if (taskResponse.ok) {
            taskData = await taskResponse.json();
          }
        } catch (error) {
          console.warn('Failed to load task data:', error);
        }

        const payload = (taskData?.type_specific_payload ?? {}) as Record<string, any>;
        const insightType = payload.insight_type;
        const insightReference = payload.insight_reference;

        // Для заданий Active Recall (sm2_due) загружаем карточки из active_recall_sessions
        if (insightType === 'sm2_due' && insightReference) {
          const recallSession = await hasyx.select({
            table: 'active_recall_sessions',
            pk_columns: { id: insightReference },
            returning: ['recall_item_id', 'recall_type'],
          });

          const recallData = Array.isArray(recallSession) ? recallSession[0] : recallSession;
          if (recallData && recallData.recall_type === 'vocabulary' && recallData.recall_item_id) {
            const card = await hasyx.select({
              table: 'vocabulary_cards',
              pk_columns: { id: recallData.recall_item_id },
              returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
            });

            const cardData = Array.isArray(card) ? card[0] : card;
            if (cardData) {
              setFlashcards([
                {
                  id: cardData.id,
                  word: cardData.word,
                  translation: cardData.translation,
                  exampleSentence: cardData.example_sentence,
                  difficulty: cardData.difficulty,
                },
              ]);
              return;
            }
          }
        }

        // Если есть targetWords в уроке, создаем карточки из них
        if (lesson.targetWords && lesson.targetWords.length > 0) {
          // Пытаемся найти существующие карточки для этих слов
          const cards = await hasyx.select({
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
            return;
          }
        }

        // Если карточек нет, загружаем новые/плохо освоенные слова
        const today = new Date().toISOString().split('T')[0];
        const reviewCards = await hasyx.select({
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
          return;
        }

        // Если карточек нет вообще (новый пользователь или урок vocabulary), генерируем на основе уровня
        // Особенно важно для уроков типа vocabulary - ОБЯЗАТЕЛЬНО должны быть карточки
        const isVocabularyLesson = lesson.meta?.taskType === 'vocabulary';
        if (isVocabularyLesson) {
          // Сначала пытаемся создать карточки из questions, если они есть
          if (lesson.exercise.questions && lesson.exercise.questions.length > 0) {
            const wordsFromQuestions = lesson.exercise.questions
              .map((q) => {
                // Извлекаем слово из prompt (например, "versatile (карточка 1)" -> "versatile")
                const wordMatch = q.prompt.match(/^([a-zA-Z]+)/);
                return wordMatch ? wordMatch[1].toLowerCase() : null;
              })
              .filter(Boolean) as string[];

            if (wordsFromQuestions.length > 0) {
              // Проверяем, есть ли уже карточки для этих слов
              const existingCards = await hasyx.select({
                table: 'vocabulary_cards',
                where: {
                  user_id: { _eq: userId },
                  word: { _in: wordsFromQuestions },
                },
                returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
                limit: 20,
              });

              if (Array.isArray(existingCards) && existingCards.length > 0) {
                setFlashcards(
                  existingCards.map((card) => ({
                    id: card.id,
                    word: card.word,
                    translation: card.translation,
                    exampleSentence: card.example_sentence,
                    difficulty: card.difficulty,
                  }))
                );
                return;
              }

              // Если карточек нет, создаем их из questions через API
              try {
                  const userProfile = await hasyx.select({
                  table: 'users',
                  pk_columns: { id: userId },
                  returning: ['current_level'],
                });

                const user = Array.isArray(userProfile) ? userProfile[0] : userProfile;
                const userLevel = user?.current_level || 'A2';

                const generateResponse = await fetch('/api/vocabulary/generate-cards', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId,
                    level: userLevel,
                    words: wordsFromQuestions,
                  }),
                });

                if (generateResponse.ok) {
                  const generateResult = await generateResponse.json();
                  if (generateResult.cards && generateResult.cards.length > 0) {
                    const cardIds = generateResult.cards.map((c: { id: string }) => c.id).filter(Boolean);
                    if (cardIds.length > 0) {
                      const newCards = await hasyx.select({
                        table: 'vocabulary_cards',
                        where: {
                          user_id: { _eq: userId },
                          id: { _in: cardIds },
                        },
                        returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
                        limit: 10,
                      });

                      if (Array.isArray(newCards) && newCards.length > 0) {
                        setFlashcards(
                          newCards.map((card) => ({
                            id: card.id,
                            word: card.word,
                            translation: card.translation,
                            exampleSentence: card.example_sentence,
                            difficulty: card.difficulty,
                          }))
                        );
                        return;
                      }
                    }
                  }
                }
              } catch (generateError) {
                console.error('Failed to generate cards from questions:', generateError);
              }
            }
          }

          // Если не получилось создать из questions, генерируем на основе уровня
          const userProfile = await hasyx.select({
            table: 'users',
            pk_columns: { id: userId },
            returning: ['current_level'],
          });

          const user = Array.isArray(userProfile) ? userProfile[0] : userProfile;
          const userLevel = user?.current_level || 'A2';

          try {
            const generateResponse = await fetch('/api/vocabulary/generate-cards', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                level: userLevel,
              }),
            });

            if (generateResponse.ok) {
              const generateResult = await generateResponse.json();
              if (generateResult.cards && generateResult.cards.length > 0) {
                const cardIds = generateResult.cards.map((c: { id: string }) => c.id).filter(Boolean);
                if (cardIds.length > 0) {
                  const newCards = await hasyx.select({
                    table: 'vocabulary_cards',
                    where: {
                      user_id: { _eq: userId },
                      id: { _in: cardIds },
                    },
                    returning: ['id', 'word', 'translation', 'example_sentence', 'difficulty'],
                    limit: 10,
                  });

                  if (Array.isArray(newCards) && newCards.length > 0) {
                    setFlashcards(
                      newCards.map((card) => ({
                        id: card.id,
                        word: card.word,
                        translation: card.translation,
                        exampleSentence: card.example_sentence,
                        difficulty: card.difficulty,
                      }))
                    );
                    return;
                  }
                }
              }
            }
          } catch (generateError) {
            console.error('Failed to generate cards for vocabulary lesson:', generateError);
          }
        }
      } catch (error) {
        console.error('Failed to load flashcards:', error);
      } finally {
        setIsLoadingCards(false);
      }
    };

    loadCards();
  }, [userId, lesson, hasyx, taskId]);

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
          <div className="flex space-x-3">
            <IconButton icon={<BackArrow className="size-8" />} ariaLabel="Назад" variant="ghost" onClick={handleBack} />
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
              title="Карточки для повторения"
            />
          ) : isLoadingCards ? (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Загружаем карточки...</p>
            </section>
          ) : (
            <section className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
              <p className="text-sm text-amber-700">Карточки загружаются. Если они не появились, попробуйте обновить страницу.</p>
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
              
              const handleAnswer = () => {
                // Более гибкое сравнение: убираем лишние пробелы, пунктуацию, приводим к нижнему регистру
                const normalize = (text: string) => {
                  if (!text) return '';
                  return text
                    .trim()
                    .toLowerCase()
                    .replace(/[.,!?;:'"]/g, '') // Убираем пунктуацию
                    .replace(/\s+/g, ' '); // Нормализуем пробелы
                };
                
                const normalizedUserAnswer = normalize(userAnswer);
                const normalizedExpected = normalize(question.expectedAnswer || '');
                
                // Дополнительная проверка: частичное совпадение для длинных ответов
                const correct = normalizedUserAnswer === normalizedExpected ||
                  (normalizedExpected.length > 20 && normalizedExpected.includes(normalizedUserAnswer)) ||
                  (normalizedUserAnswer.length > 20 && normalizedUserAnswer.includes(normalizedExpected));
                
                console.log('Answer check:', {
                  user: normalizedUserAnswer,
                  expected: normalizedExpected,
                  correct,
                });
                
                setQuestionResults((prev) => ({ ...prev, [index]: correct }));
                
                // Показываем модальное окно для правильного ответа в уроках с временами
                if (correct && isGrammarLesson && hasMissingVerb && !shownSuccessModals.has(index)) {
                  setShownSuccessModals((prev) => new Set(prev).add(index));
                  const modalId = openModal({
                    component: (
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-semibold text-green-900 mb-4">
                          🎉 Правильно!
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
                
                // Формируем детальное сообщение об ошибке
                if (!correct) {
                  let errorMessage = 'Неверно. ';
                  
                  // Проверяем, есть ли информация об ошибке в evaluationCriteria
                  if (question.evaluationCriteria && Array.isArray(question.evaluationCriteria) && question.evaluationCriteria.length > 0) {
                    errorMessage += question.evaluationCriteria[0];
                  } else if (isGrammarLesson && hasMissingVerb) {
                    errorMessage += `Правильный ответ: "${question.expectedAnswer}". Проверь форму глагола и время.`;
                  } else {
                    errorMessage += `Правильный ответ: "${question.expectedAnswer}".`;
                  }
                  
                  setErrorMessages((prev) => ({ ...prev, [index]: errorMessage }));
                } else {
                  // Убираем сообщение об ошибке при правильном ответе
                  setErrorMessages((prev) => {
                    const newMessages = { ...prev };
                    delete newMessages[index];
                    return newMessages;
                  });
                }
              };

              return (
                <div key={`${question.prompt}-${index}`} className="rounded-2xl bg-gray-50 p-4 space-y-2">
                  <p className="font-medium text-gray-900">{question.prompt}</p>
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
                      onClick={handleAnswer}
                      disabled={!userAnswer.trim() || isCorrect === true}
                      className="rounded-lg bg-primary-deep px-4 py-2 text-sm font-medium text-white hover:bg-primary-deep/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ответить
                    </button>
                  </div>
                  {isCorrect === true && (
                    <p className="text-sm text-green-600 font-medium">✓ Правильно!</p>
                  )}
                  {isCorrect === false && errorMessages[index] && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-sm text-red-700 font-medium">✗ {errorMessages[index]}</p>
                    </div>
                  )}
                  {isCorrect === false && !errorMessages[index] && (
                    <p className="text-sm text-red-600">✗ Неверно. Попробуйте еще раз.</p>
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
    </div>
  );
}


