import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSession } from '@/lib/compat/hasyx';
import { useQueryClient } from '@tanstack/react-query';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/app/Buttons/Button';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';
import { useModalStore } from '@/store/modalStore';
import { useVocabularySessionStore } from '@/store/vocabularySessionStore';
import { queryKeys } from '@/lib/query-keys';
import { enqueueMutation } from '@/lib/offline/mutation-queue';

export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  exampleSentence?: string | null;
  difficulty?: string | null;
}

interface FlashcardResult {
  cardId: string;
  wasCorrect: boolean;
  responseTime?: number;
  userSentence?: string;
}

interface SwipeCardProps {
  cards: Flashcard[];
  onResult?: (results: FlashcardResult[]) => void;
  onProgress?: (answeredUnique: number, total: number) => void;
  onCardUpdated?: (card: Flashcard) => void;
  title?: string;
}

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  scale: number;
}

// Позиция карточки в визуальной стопке по месту в очереди (0 — текущая)
function getStackPosition(queueIndex: number): CardPosition {
  if (queueIndex === 0) {
    return { x: 0, y: 0, rotation: 0, zIndex: 100, opacity: 1, scale: 1 };
  }
  const rotation = ((queueIndex % 5) - 2) * 2.5;
  return {
    x: 0,
    y: queueIndex * 4,
    rotation,
    zIndex: 100 - queueIndex,
    opacity: Math.max(0.3, 1 - queueIndex * 0.1),
    scale: Math.max(0.85, 1 - queueIndex * 0.02),
  };
}

export function SwipeCard({ cards, onResult, onProgress, onCardUpdated, title = 'Слова для повторения' }: SwipeCardProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const queryClient = useQueryClient();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const modalShownRef = useRef(false);

  // Сессия single-pass живёт в store — переживает переходы между роутами
  const deckKey = useVocabularySessionStore((state) => state.deckKey);
  const remainingIds = useVocabularySessionStore((state) => state.remainingIds);
  const knownIds = useVocabularySessionStore((state) => state.knownIds);
  const repeatIds = useVocabularySessionStore((state) => state.repeatIds);
  const startSession = useVocabularySessionStore((state) => state.startSession);
  const answerCard = useVocabularySessionStore((state) => state.answer);

  // Локальный UI-стейт (не нужен между роутами)
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userSentence, setUserSentence] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTranslation, setEditTranslation] = useState('');
  const [editExample, setEditExample] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSwipeAway, setIsSwipeAway] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  // Локальные правки карточек (после saveEdit), поверх props
  const [overrides, setOverrides] = useState<Record<string, Flashcard>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const { speak, cancel, isSpeaking } = useSpeechSynthesis({
    language: 'en-US',
    rate: 0.9,
    pitch: 1,
  });

  // Индикация направления свайпа во время drag
  const dragX = useMotionValue(0);
  const knowHintOpacity = useTransform(dragX, [20, 100], [0, 1]);
  const repeatHintOpacity = useTransform(dragX, [-20, -100], [0, 1]);

  const cardsKey = cards.map((c) => c.id).join('|');
  const cardById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  const resolveCard = useCallback(
    (id: string): Flashcard | undefined => {
      const base = cardById.get(id);
      if (!base) return undefined;
      return overrides[id] ?? base;
    },
    [cardById, overrides],
  );

  // До старта сессии (первый рендер) показываем колоду целиком
  const sessionActive = deckKey === cardsKey;
  const queueIds = sessionActive ? remainingIds : cards.map((c) => c.id);
  const currentCard = queueIds.length > 0 ? resolveCard(queueIds[0]) : undefined;
  const totalCount = knownIds.length + repeatIds.length + queueIds.length;
  const allCardsCompleted = sessionActive && cards.length > 0 && remainingIds.length === 0;

  // Старт/восстановление сессии: no-op, если состав колоды не изменился
  useEffect(() => {
    if (cards.length === 0) return;
    if (useVocabularySessionStore.getState().deckKey !== cardsKey) {
      modalShownRef.current = false;
      setIsFlipped(false);
      setIsEditing(false);
      setStartTime(Date.now());
      setIsSwipeAway(false);
      setSwipeDirection(null);
      startSession(cardsKey, cards.map((c) => c.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsKey]);

  const handleFlip = useCallback(() => {
    if (!isDragging) {
      setIsFlipped(true);
      setIsHovered(false); // Сбрасываем hover при переворачивании
    }
  }, [isDragging]);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    setEditTranslation(currentCard.translation ?? '');
    setEditExample(currentCard.exampleSentence ?? '');
    setEditError(null);
    setIsEditing(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentCard) return;
    const nextTranslation = editTranslation.trim();
    if (!nextTranslation) {
      setEditError('Укажите перевод');
      return;
    }
    setEditBusy(true);
    setEditError(null);
    try {
      const res = await fetch('/api/vocabulary/update-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          translation: nextTranslation,
          example: editExample.trim() || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Не удалось сохранить');
      const updated: Flashcard = {
        ...currentCard,
        translation: body.card?.translation ?? nextTranslation,
        exampleSentence: body.card?.example_sentence ?? editExample.trim() ?? null,
      };
      setOverrides((prev) => ({ ...prev, [updated.id]: updated }));
      onCardUpdated?.(updated);
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err?.message ?? 'Ошибка сохранения');
    } finally {
      setEditBusy(false);
    }
  };

  const handleAnswer = useCallback(
    async (wasCorrect: boolean) => {
      if (!currentCard || !userId || isAnswering) return;
      setIsAnswering(true);

      const answeredCard = currentCard;
      const responseTime = Math.round((Date.now() - startTime) / 1000);
      const result: FlashcardResult = {
        cardId: answeredCard.id,
        wasCorrect,
        responseTime,
        userSentence: userSentence.trim() || undefined,
      };

      // Single-pass: оба ответа просто убирают карточку из очереди.
      // «Повторить» вернётся по FSRS (due в srs_state уже ставит API).
      answerCard(answeredCard.id, wasCorrect, result);
      setUserSentence('');
      setIsFlipped(false);
      setStartTime(Date.now());

      const state = useVocabularySessionStore.getState();
      const answered = state.knownIds.length + state.repeatIds.length;
      onProgress?.(answered, answered + state.remainingIds.length);

      if (state.remainingIds.length === 0) {
        onResult?.(state.results);
        // Инвалидируем vocabulary один раз в конце сессии, а не после каждого ответа —
        // иначе рефетч сбрасывал колоду посреди сессии
        void queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary(userId) });
      }

      const reviewPayload = {
        cardId: answeredCard.id,
        userId,
        wasCorrect,
        responseTimeSeconds: responseTime,
      };
      try {
        await fetch('/api/vocabulary/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewPayload),
        });
      } catch (error) {
        // Офлайн: складываем в очередь (IndexedDB), доотправим при появлении сети.
        // UI уже обновлён оптимистично — карточка убрана из колоды.
        console.warn('[SwipeCard] Сеть недоступна, review в офлайн-очередь:', error);
        await enqueueMutation('vocabulary_review', reviewPayload).catch(() => {});
      } finally {
        setIsAnswering(false);
      }
    },
    [currentCard, userId, isAnswering, startTime, userSentence, answerCard, onProgress, onResult, queryClient]
  );

  const handlePlayPronunciation = useCallback(() => {
    if (currentCard) {
      if (isSpeaking) {
        cancel();
      } else {
        speak(currentCard.word);
      }
    }
  }, [currentCard, isSpeaking, speak, cancel]);

  // Свайп = ответ: вправо — «знаю», влево — «повторить»
  const handleDragEndMotion = useCallback(
    (event: any, info: { offset: { x: number; y: number } }) => {
      const threshold = 100;
      const absX = Math.abs(info.offset.x);

      if (absX > threshold) {
        const direction = info.offset.x < 0 ? 'left' : 'right';

        setSwipeDirection(direction);
        setIsSwipeAway(true);

        setTimeout(() => {
          setSwipeDirection(null);
          setIsSwipeAway(false);
          void handleAnswer(direction === 'right');
        }, 300);
      }
    },
    [handleAnswer]
  );

  // Определяем touch device
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Показываем модалку при завершении всех карточек
  useEffect(() => {
    if (allCardsCompleted && !modalShownRef.current) {
      modalShownRef.current = true;
      const known = knownIds.length;
      const repeat = repeatIds.length;
      const modalId = openModal({
        component: (
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              Сессия завершена!
            </h3>
            <p className="text-gray-700 mb-6">
              Знаю: {known}.
              {repeat > 0
                ? ` На повторении: ${repeat} — ${repeat === 1 ? 'вернётся' : 'вернутся'} завтра.`
                : ' Все карточки отвечены правильно.'}
            </p>
            <Button
              onClick={() => {
                closeModal(modalId);
              }}
              className="w-full"
            >
              Отлично!
            </Button>
          </div>
        ),
        closeOnOverlayClick: true,
      });
    }
  }, [allCardsCompleted, knownIds.length, repeatIds.length, openModal, closeModal]);

  if (cards.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Нет карточек для повторения.</p>
      </section>
    );
  }

  if (allCardsCompleted) {
    return (
      <section className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Сессия завершена!</h3>
        <p className="text-sm text-green-700">
          Знаю: {knownIds.length} · На повторении: {repeatIds.length}
          {repeatIds.length > 0 ? ' — вернутся завтра.' : '.'}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">
          Осталось {queueIds.length} из {totalCount}. Нажми, чтобы перевернуть. Смахни вправо — помню, влево — нужно повторить.
        </p>
      </header>

      <div className="relative h-64 w-full">
        {/* Touch devices: иконки над карточкой */}
        {isTouchDevice && !isFlipped && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <button
              onClick={handlePlayPronunciation}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Произнести слово"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>
          </div>
        )}

        {/* Стопка карт */}
        <div className="relative h-full w-full">
          {queueIds.slice(0, 5).map((cardId, queueIndex) => {
            const card = resolveCard(cardId);
            if (!card) return null;
            const position = getStackPosition(queueIndex);
            const isCurrent = queueIndex === 0;

            let motionStyle: any;

            if (isCurrent) {
              if (isSwipeAway && swipeDirection) {
                // Карточка «падает» в свою стопку: влево — повторить, вправо — знаю
                motionStyle = {
                  x: swipeDirection === 'left' ? -220 : 220,
                  y: 200,
                  rotate: swipeDirection === 'left' ? -20 : 20,
                  scale: 0.25,
                  opacity: 0,
                  zIndex: position.zIndex,
                };
              } else {
                motionStyle = {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                  zIndex: position.zIndex,
                };
              }
            } else {
              motionStyle = {
                x: position.x,
                y: position.y,
                rotate: position.rotation,
                scale: position.scale,
                opacity: position.opacity,
                zIndex: position.zIndex,
              };
            }

            return (
              <motion.div
                key={card.id}
                ref={isCurrent ? cardRef : null}
                className={`absolute inset-0 cursor-pointer ${isCurrent ? 'touch-none' : 'touch-auto'}`}
                drag={isCurrent && !isSwipeAway}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDrag={isCurrent ? (_event, info) => dragX.set(info.offset.x) : undefined}
                onDragEnd={isCurrent ? (event, info) => {
                  setIsDragging(false);
                  dragX.set(0);
                  handleDragEndMotion(event, info);
                } : undefined}
                whileDrag={isCurrent ? { scale: 1.05 } : undefined}
                animate={motionStyle}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={isCurrent && !isSwipeAway && !isDragging ? handleFlip : undefined}
                onMouseEnter={isCurrent && !isTouchDevice && !isFlipped && !isDragging ? () => setIsHovered(true) : undefined}
                onMouseLeave={isCurrent && !isTouchDevice ? () => setIsHovered(false) : undefined}
              >
                {/* Индикаторы направления свайпа */}
                {isCurrent && (
                  <>
                    <motion.div
                      style={{ opacity: repeatHintOpacity }}
                      className="absolute left-3 top-3 z-20 rounded-full bg-amber-600 px-3 py-1 text-sm font-semibold text-white shadow-md"
                    >
                      ← Повторить
                    </motion.div>
                    <motion.div
                      style={{ opacity: knowHintOpacity }}
                      className="absolute right-3 top-3 z-20 rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md"
                    >
                      Знаю →
                    </motion.div>
                  </>
                )}
                <div
                  className="relative h-full w-full perspective-1000"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped && isCurrent ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: isDragging ? 'none' : 'transform 0.5s',
                  }}
                >
                  {/* Лицевая сторона */}
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-blue-50 p-6 shadow-lg"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="text-center relative w-full h-full flex items-center justify-center">
                      <div>
                        <p className="text-3xl font-bold text-indigo-900 mb-2">{card.word}</p>
                        {card.difficulty && (
                          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 uppercase">
                            {card.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Обратная сторона */}
                  {isCurrent && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-linear-to-br from-green-50 to-emerald-50 p-6 shadow-lg"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDragging && !isSwipeAway && !isEditing) {
                          setIsFlipped(false);
                        }
                      }}
                    >
                      <div className="text-center w-full">
                        {isEditing ? (
                          <form onSubmit={saveEdit} className="space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
                            <label className="block space-y-1">
                              <span className="text-xs font-medium text-gray-600">Перевод</span>
                              <input
                                value={editTranslation}
                                onChange={(e) => setEditTranslation(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                required
                              />
                            </label>
                            <label className="block space-y-1">
                              <span className="text-xs font-medium text-gray-600">Пример</span>
                              <input
                                value={editExample}
                                onChange={(e) => setEditExample(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                              />
                            </label>
                            {editError && <p className="text-xs text-red-600">{editError}</p>}
                            <div className="flex gap-2">
                              <Button type="submit" disabled={editBusy} className="flex-1">
                                {editBusy ? 'Сохраняем…' : 'Сохранить'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={editBusy}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing(false);
                                }}
                              >
                                Отмена
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <p className="text-2xl font-semibold text-green-900 mb-3">{card.translation}</p>
                            {card.exampleSentence && (
                              <p className="text-sm text-gray-700 italic mb-4">"{card.exampleSentence}"</p>
                            )}
                            <button
                              type="button"
                              onClick={startEdit}
                              className="mb-2 text-xs font-medium text-green-800 underline"
                            >
                              Исправить
                            </button>
                            <p className="text-xs text-gray-500">← повторить · помню →</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover overlay для desktop: blur на всю площадь карточки.
                    Вынесен из preserve-3d контейнера — внутри него backdrop-filter не работает */}
                {isCurrent && !isTouchDevice && isHovered && !isFlipped && !isDragging && (
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPronunciation();
                      }}
                      className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                      aria-label="Произнести слово"
                    >
                      <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-green-600' : 'text-gray-600'}`} />
                    </button>
                    <p className="text-gray-800 font-semibold text-lg">Перевернуть</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Стопки результатов: слева «Повторить», справа «Знаю» (на мобильных — только pill-счётчики) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative hidden h-10 w-8 sm:block" aria-hidden="true">
            <div className="absolute inset-0 -rotate-6 rounded-md border-2 border-amber-300 bg-amber-100" />
            <div className="absolute inset-0 rotate-3 rounded-md border-2 border-amber-400 bg-amber-200" />
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 z-50">
            ← Повторить: {repeatIds.length} · вернутся завтра
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 z-50">
            Знаю: {knownIds.length} →
          </span>
          <div className="relative hidden h-10 w-8 sm:block" aria-hidden="true">
            <div className="absolute inset-0 rotate-6 rounded-md border-2 border-green-300 bg-green-100" />
            <div className="absolute inset-0 -rotate-3 rounded-md border-2 border-green-400 bg-green-200" />
          </div>
        </div>
      </div>

      {/* Блок с формой (сохраняем из FlashcardPractice строки 196-226) */}
      {isFlipped && currentCard && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Составь предложение со словом "{currentCard.word}" (необязательно)
            </label>
            <textarea
              value={userSentence}
              onChange={(e) => setUserSentence(e.target.value)}
              placeholder="Например: I like to read books."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep"
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => handleAnswer(true)}
              disabled={isAnswering}
              className="flex-1"
            >
              ✓ Правильно
            </Button>
            <Button
              variant="default"
              onClick={() => handleAnswer(false)}
              disabled={isAnswering}
              className="flex-1 bg-amber-600 hover:bg-amber-500"
            >
              ✗ Нужно повторить
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
