'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'hasyx';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Heart, Volume2 } from 'lucide-react';
import { Button } from '@/components/app/Buttons/Button';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';
import { useModalStore } from '@/store/modalStore';

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

export function SwipeCard({ cards, onResult, title = 'Слова для повторения' }: SwipeCardProps) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const modalShownRef = useRef(false);
  
  // Если сессия еще загружается, не показываем компонент
  if (status === 'loading') {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<FlashcardResult[]>([]);
  const [userSentence, setUserSentence] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [cardStack, setCardStack] = useState<Flashcard[]>(cards);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToDictionary, setIsAddingToDictionary] = useState(false);

  // Для свайпа
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipeAway, setIsSwipeAway] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { speak, cancel, isSpeaking } = useSpeechSynthesis({
    language: 'en-US',
    rate: 0.9,
    pitch: 1,
  });

  const currentCard = cardStack[currentIndex];
  const isLastCard = currentIndex === cardStack.length - 1;
  const allCardsCompleted = currentIndex >= cardStack.length;

  // Вычисляем позиции для стопки карт
  const getCardPosition = (index: number, total: number): CardPosition => {
    const stackIndex = index - currentIndex;
    
    if (stackIndex < 0) {
      // Карточки, которые уже пройдены
      return {
        x: 0,
        y: 0,
        rotation: 0,
        zIndex: total - index,
        opacity: 0,
        scale: 0.8,
      };
    }

    if (stackIndex === 0) {
      // Текущая карточка
      return {
        x: dragOffset.x,
        y: dragOffset.y,
        rotation: isDragging ? dragOffset.x * 0.1 : 0,
        zIndex: total,
        opacity: 1,
        scale: isDragging ? 1.05 : 1,
      };
    }

    // Остальные карточки в стопке
    const offset = stackIndex * 4;
    // Стабильный поворот на основе индекса для эффекта неровной стопки
    const rotation = ((index % 5) - 2) * 2.5; // Поворот от -5 до +5 градусов
    return {
      x: 0,
      y: offset,
      rotation,
      zIndex: total - stackIndex,
      opacity: Math.max(0.3, 1 - stackIndex * 0.1),
      scale: Math.max(0.85, 1 - stackIndex * 0.02),
    };
  };

  // Motion values для текущей карточки
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useMotionValue(0);
  const scale = useMotionValue(1);

  // Spring анимации
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springRotation = useSpring(rotation, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  // Обновляем motion values при изменении dragOffset
  useEffect(() => {
    if (isSwipeAway && swipeDirection) {
      // Анимация улетания карточки
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const exitX = swipeDirection === 'left' ? -screenWidth * 1.5 : screenWidth * 1.5;
      x.set(exitX);
      y.set(screenWidth);
      rotation.set(swipeDirection === 'left' ? -45 : 45);
      scale.set(0.5);
    } else if (isDragging) {
      x.set(dragOffset.x);
      y.set(dragOffset.y);
      rotation.set(dragOffset.x * 0.1);
      scale.set(1.05);
    } else {
      x.set(0);
      y.set(0);
      rotation.set(0);
      scale.set(1);
    }
  }, [dragOffset, isDragging, isSwipeAway, swipeDirection, x, y, rotation, scale]);

  const handleFlip = useCallback(() => {
    if (!isDragging) {
      setIsFlipped(true);
      setIsHovered(false); // Сбрасываем hover при переворачивании
    }
  }, [isDragging]);

  const handleAnswer = useCallback(
    async (wasCorrect: boolean) => {
      if (!currentCard || !userId) return;

      const responseTime = Math.round((Date.now() - startTime) / 1000);
      setStartTime(Date.now());
      const result: FlashcardResult = {
        cardId: currentCard.id,
        wasCorrect,
        responseTime,
        userSentence: userSentence.trim() || undefined,
      };

      // Обновляем карточку в БД через API
      try {
        const response = await fetch('/api/vocabulary/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: currentCard.id,
            userId,
            wasCorrect,
            responseTimeSeconds: responseTime,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.error || 'Failed to update card');
        }
      } catch (error) {
        console.error('Failed to update vocabulary card:', error);
        // Продолжаем работу даже при ошибке, чтобы не блокировать UI
      }

      const newResults = [...results, result];
      setResults(newResults);
      setUserSentence('');
      setIsFlipped(false);

      if (wasCorrect) {
        // Увеличиваем currentIndex даже для последней карточки, чтобы allCardsCompleted стал true
        setCurrentIndex((prev) => prev + 1);
        if (isLastCard) {
          onResult?.(newResults);
        }
      } else {
        setCardStack((prevStack) => {
          const updated = [...prevStack];
          const wrongCard = updated.splice(currentIndex, 1)[0];
          updated.push(wrongCard);
          return updated;
        });

        // Увеличиваем currentIndex даже для последней карточки
        setCurrentIndex((prev) => prev + 1);
        if (isLastCard) {
          onResult?.(newResults);
        }
      }
    },
    [currentCard, results, userSentence, startTime, isLastCard, onResult, userId]
  );

  const handleAddToDictionary = useCallback(async () => {
    if (!currentCard || !userId || isAddingToDictionary) return;

    try {
      setIsAddingToDictionary(true);
      await fetch('/api/vocabulary/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          words: [currentCard.word],
        }),
      });
    } catch (error) {
      console.error('Failed to add word to dictionary:', error);
    } finally {
      setIsAddingToDictionary(false);
    }
  }, [currentCard, userId, isAddingToDictionary]);

  const handlePlayPronunciation = useCallback(() => {
    if (currentCard) {
      if (isSpeaking) {
        cancel();
      } else {
        speak(currentCard.word);
      }
    }
  }, [currentCard, isSpeaking, speak, cancel]);

  // Обработчики свайпа
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragStart({ x: clientX - rect.left, y: clientY - rect.top });
      setIsDragging(true);
      setIsHovered(false); // Сбрасываем hover при начале перетаскивания
    }
  }, []);

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (dragStart && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = clientX - rect.left - dragStart.x;
        const y = clientY - rect.top - dragStart.y;
        setDragOffset({ x, y });
      }
    },
    [dragStart]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    const threshold = 100;
    const absX = Math.abs(dragOffset.x);
    const absY = Math.abs(dragOffset.y);

    if (absX > threshold || absY > threshold) {
      // Свайп произошел - анимируем улетание карточки
      const direction = dragOffset.x < 0 ? 'left' : 'right';
      setSwipeDirection(direction);
      setIsSwipeAway(true);
      setIsDragging(false);

      // После анимации переходим к следующей карточке
      setTimeout(() => {
        // Увеличиваем currentIndex даже для последней карточки, чтобы allCardsCompleted стал true
        setCurrentIndex((prev) => prev + 1);
        
        if (isFlipped) {
          setIsFlipped(false);
          setUserSentence('');
        }
        
        // Если это была последняя карточка, вызываем onResult
        if (isLastCard && currentCard) {
          const responseTime = Math.round((Date.now() - startTime) / 1000);
          const result: FlashcardResult = {
            cardId: currentCard.id,
            wasCorrect: direction === 'right', // Свайп вправо = правильно
            responseTime,
          };
          const newResults = [...results, result];
          setResults(newResults);
          onResult?.(newResults);
        }
        
        // Сброс состояния
        setSwipeDirection(null);
        setIsSwipeAway(false);
        setDragStart(null);
        setDragOffset({ x: 0, y: 0 });
      }, 300); // Время анимации
    } else {
      // Свайп недостаточный - возвращаем карточку
      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isDragging, dragOffset, isFlipped, isLastCard, currentCard, results, startTime, onResult]);

  // Mouse события
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Не начинаем свайп, если клик был на кнопках или внутри формы
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('textarea') || target.closest('input')) {
        return;
      }
      if (!isFlipped) {
        handleDragStart(e.clientX, e.clientY);
      }
    },
    [isFlipped, handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX, e.clientY);
      }
    },
    [isDragging, handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch события
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && !isFlipped) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [isFlipped, handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [isDragging, handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Обновляем стопку карточек при изменении пропсов
  useEffect(() => {
    if (cards.length > 0) {
      setCardStack(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setResults([]);
      setStartTime(Date.now());
      setDragOffset({ x: 0, y: 0 });
      setIsSwipeAway(false);
      setSwipeDirection(null);
    }
  }, [cards]);

  // Глобальные обработчики для mouse
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Определяем touch device
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  if (cardStack.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Нет карточек для повторения.</p>
      </section>
    );
  }

  // Показываем модалку при завершении всех карточек
  useEffect(() => {
    if (allCardsCompleted && !modalShownRef.current) {
      modalShownRef.current = true;
      const modalId = openModal({
        component: (
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              🎉 Все слова выучены!
            </h3>
            <p className="text-gray-700 mb-6">
              Ты повторил {cardStack.length} {cardStack.length === 1 ? 'слово' : 'слов'} на сегодня.
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
  }, [allCardsCompleted, cardStack.length, openModal, closeModal]);

  if (allCardsCompleted) {
    return (
      <section className="rounded-3xl border border-green-100 bg-green-50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Все карточки пройдены!</h3>
        <p className="text-sm text-green-700">
          Ты повторил {cardStack.length} {cardStack.length === 1 ? 'слово' : 'слов'}.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">
          Карточка {currentIndex + 1} из {cardStack.length}. Нажми на карточку, чтобы перевернуть.
        </p>
      </header>

      <div className="relative h-64 w-full">
        {/* Touch devices: иконки над карточкой */}
        {isTouchDevice && !isFlipped && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <button
              onClick={handleAddToDictionary}
              disabled={isAddingToDictionary}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              aria-label="Добавить в словарь"
            >
              <Heart className="w-5 h-5 text-red-500" />
            </button>
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
          {cardStack.map((card, index) => {
            const position = getCardPosition(index, cardStack.length);
            const isCurrent = index === currentIndex;

            if (index < currentIndex) {
              return null; // Пропускаем пройденные карточки
            }

            return (
              <motion.div
                key={card.id}
                ref={isCurrent ? cardRef : null}
                className="absolute inset-0 cursor-pointer"
                style={
                  isCurrent
                    ? {
                        x: springX,
                        y: springY,
                        rotate: springRotation,
                        scale: springScale,
                        opacity: 1,
                        zIndex: position.zIndex,
                      }
                    : {
                        x: position.x,
                        y: position.y,
                        rotate: position.rotation,
                        scale: position.scale,
                        opacity: position.opacity,
                        zIndex: position.zIndex,
                      }
                }
                onMouseDown={isCurrent && !isFlipped ? handleMouseDown : undefined}
                onTouchStart={isCurrent && !isFlipped ? handleTouchStart : undefined}
                onTouchMove={isCurrent ? handleTouchMove : undefined}
                onTouchEnd={isCurrent ? handleTouchEnd : undefined}
                onClick={isCurrent && !isDragging && !isSwipeAway ? handleFlip : undefined}
                onMouseEnter={isCurrent && !isTouchDevice && !isDragging && !isFlipped ? () => setIsHovered(true) : undefined}
                onMouseLeave={isCurrent && !isTouchDevice ? () => setIsHovered(false) : undefined}
              >
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
                    className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-lg"
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

                      {/* Hover overlay для desktop */}
                      {isCurrent && !isTouchDevice && isHovered && !isFlipped && !isDragging && (
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center gap-4 z-10">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToDictionary();
                              }}
                              disabled={isAddingToDictionary}
                              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                              aria-label="Добавить в словарь"
                            >
                              <Heart className="w-6 h-6 text-red-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPronunciation();
                              }}
                              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                              aria-label="Произнести слово"
                            >
                              <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-blue-600' : 'text-gray-600'}`} />
                            </button>
                          </div>
                          <p className="text-white font-semibold text-lg">Перевернуть</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Обратная сторона */}
                  {isCurrent && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDragging && !isSwipeAway) {
                          setIsFlipped(false);
                        }
                      }}
                    >
                      <div className="text-center w-full">
                        <p className="text-2xl font-semibold text-green-900 mb-3">{card.translation}</p>
                        {card.exampleSentence && (
                          <p className="text-sm text-gray-700 italic mb-4">"{card.exampleSentence}"</p>
                        )}
                        <p className="text-xs text-gray-500">Нажми, чтобы вернуться</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Блок с формой (сохраняем из FlashcardPractice строки 196-226) */}
      {isFlipped && (
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
              className="flex-1"
            >
              ✓ Правильно
            </Button>
            <Button
              variant="default"
              onClick={() => handleAnswer(false)}
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

