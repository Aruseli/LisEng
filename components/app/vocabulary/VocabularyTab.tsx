'use client';

import { SwipeCard, type Flashcard } from './SwipeCard';

interface VocabularyCardView {
  id: string;
  word: string;
  translation: string;
  exampleSentence?: string | null;
  nextReview?: string | null;
  difficulty?: string | null;
}

interface VocabularyTabProps {
  loading?: boolean;
  cards: VocabularyCardView[];
  dueToday: number;
}

export function VocabularyTab({
  loading,
  cards,
  dueToday,
}: VocabularyTabProps) {
  // Преобразуем формат карточек для SwipeCard
  const flashcardFormat: Flashcard[] = cards.map((card) => ({
    id: card.id,
    word: card.word,
    translation: card.translation,
    exampleSentence: card.exampleSentence ?? undefined,
    difficulty: card.difficulty ?? undefined,
  }));

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Карточки на сегодня — {dueToday}
        </h2>
        <p className="text-sm text-gray-500">
          Напоминаем по системе интервальных повторений. Отвечай честно — так работает прогресс.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Загружаем карточки...</p>
      ) : cards.length === 0 ? (
        <p className="text-sm text-gray-500">
          На сегодня нет карточек к повторению. Повтори свежие слова или изучи новые.
        </p>
      ) : (
        <SwipeCard cards={flashcardFormat} title="Слова для повторения" />
      )}
    </div>
  );
}


