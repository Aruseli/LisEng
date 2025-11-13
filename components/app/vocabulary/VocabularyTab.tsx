'use client';

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
  onReviewCard: (cardId: string | number, wasCorrect: boolean) => void;
  dueToday: number;
}

export function VocabularyTab({
  loading,
  cards,
  onReviewCard,
  dueToday,
}: VocabularyTabProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Карточки на сегодня — {dueToday}
          </h2>
          <p className="text-sm text-gray-500">
            Напоминаем по системе интервальных повторений. Отвечай честно — так работает прогресс.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Загружаем карточки...</p>
      ) : cards.length === 0 ? (
        <p className="text-sm text-gray-500">
          На сегодня нет карточек к повторению. Повтори свежие слова или изучи новые.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id} className="flex flex-col rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{card.word}</p>
                  <p className="text-sm text-gray-500">{card.translation}</p>
                  {card.exampleSentence && (
                    <p className="mt-2 text-sm text-gray-600 italic">“{card.exampleSentence}”</p>
                  )}
                </div>
                {card.difficulty && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 uppercase">
                    {card.difficulty}
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onReviewCard(card.id, true)}
                  className="flex-1 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-400"
                >
                  Знаю
                </button>
                <button
                  onClick={() => onReviewCard(card.id, false)}
                  className="flex-1 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-400"
                >
                  Нужно повторить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


