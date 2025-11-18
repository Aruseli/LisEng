'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/app/Buttons/Button';

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

interface FlashcardPracticeProps {
  cards: Flashcard[];
  onResult?: (results: FlashcardResult[]) => void;
  title?: string;
}

export function FlashcardPractice({ cards, onResult, title = 'Слова для повторения' }: FlashcardPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<FlashcardResult[]>([]);
  const [userSentence, setUserSentence] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [cardStack, setCardStack] = useState<Flashcard[]>(cards);

  const currentCard = cardStack[currentIndex];
  const isLastCard = currentIndex === cardStack.length - 1;
  const allCardsCompleted = currentIndex >= cardStack.length;

  const handleFlip = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleAnswer = useCallback(
    (wasCorrect: boolean) => {
      if (!currentCard) return;

      const responseTime = Math.round((Date.now() - startTime) / 1000);
      setStartTime(Date.now()); // Обновляем время для следующей карточки
      const result: FlashcardResult = {
        cardId: currentCard.id,
        wasCorrect,
        responseTime,
        userSentence: userSentence.trim() || undefined,
      };

      const newResults = [...results, result];
      setResults(newResults);
      setUserSentence('');
      setIsFlipped(false);

      if (wasCorrect) {
        // Правильный ответ - переходим к следующей карточке
        if (isLastCard) {
          // Все карточки пройдены
          onResult?.(newResults);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        // Неправильный ответ - откладываем в конец стопки
        setCardStack((prevStack) => {
          const updated = [...prevStack];
          const wrongCard = updated.splice(currentIndex, 1)[0];
          updated.push(wrongCard);
          return updated;
        });

        if (isLastCard) {
          // Это была последняя карточка, но она ушла в конец, значит все пройдены
          onResult?.(newResults);
        } else {
          // Переходим к следующей карточке (индекс не меняется, так как карточка ушла в конец)
          setCurrentIndex((prev) => prev + 1);
        }
      }
    },
    [currentCard, results, userSentence, startTime, isLastCard, onResult]
  );

  const handleNext = useCallback(() => {
    if (isLastCard) {
      onResult?.(results);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setUserSentence('');
    }
  }, [isLastCard, results, onResult]);

  // Обновляем стопку карточек при изменении пропсов
  useEffect(() => {
    if (cards.length > 0) {
      setCardStack(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setResults([]);
      setStartTime(Date.now());
    }
  }, [cards]);

  if (cardStack.length === 0) {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Нет карточек для повторения.</p>
      </section>
    );
  }

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

      <div className="relative">
        <div
          className="relative h-64 w-full cursor-pointer perspective-1000"
          onClick={handleFlip}
          onTouchStart={handleFlip}
          role="button"
          tabIndex={0}
          aria-label="Перевернуть карточку"
        >
          <div
            className={`relative h-full w-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Лицевая сторона (английское слово) */}
            <div
              className="absolute inset-0 backface-hidden flex items-center justify-center rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-lg"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-900 mb-2">{currentCard.word}</p>
                {currentCard.difficulty && (
                  <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 uppercase">
                    {currentCard.difficulty}
                  </span>
                )}
                {!isFlipped && (
                  <p className="mt-4 text-sm text-gray-500">Нажми, чтобы увидеть перевод</p>
                )}
              </div>
            </div>

            {/* Обратная сторона (перевод + пример) */}
            <div
              className="absolute inset-0 backface-hidden flex flex-col items-center justify-center rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg rotate-y-180"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center w-full">
                <p className="text-2xl font-semibold text-green-900 mb-3">{currentCard.translation}</p>
                {currentCard.exampleSentence && (
                  <p className="text-sm text-gray-700 italic mb-4">"{currentCard.exampleSentence}"</p>
                )}
                <p className="text-xs text-gray-500">Нажми, чтобы вернуться</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {!isFlipped && currentIndex > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleNext} size="sm">
            Пропустить
          </Button>
        </div>
      )}
    </section>
  );
}

