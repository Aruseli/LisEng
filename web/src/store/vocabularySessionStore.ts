import { create } from 'zustand';

export interface VocabularySessionResult {
  cardId: string;
  wasCorrect: boolean;
  responseTime?: number;
  userSentence?: string;
}

/**
 * Сессия повторения словаря (single-pass).
 * Живёт в памяти между роутами SPA: уход со вкладки и возврат не сбрасывают прогресс.
 * При полной перезагрузке страницы сессия начнётся заново — уже отвеченные сегодня
 * карточки выпадут из due-выборки после рефетча (SM-2 сдвигает next_review_date).
 */
interface VocabularySessionState {
  /** ids колоды через '|' — идентификатор состава сессии */
  deckKey: string | null;
  /** Очередь: первый элемент — текущая карточка */
  remainingIds: string[];
  knownIds: string[];
  repeatIds: string[];
  /** Ответы сессии — для onResult при завершении */
  results: VocabularySessionResult[];
  /** no-op, если deckKey совпал (восстановление после смены роута) */
  startSession: (deckKey: string, ids: string[]) => void;
  /** remaining -> known/repeat */
  answer: (id: string, wasCorrect: boolean, result?: VocabularySessionResult) => void;
  reset: () => void;
}

export const useVocabularySessionStore = create<VocabularySessionState>((set, get) => ({
  deckKey: null,
  remainingIds: [],
  knownIds: [],
  repeatIds: [],
  results: [],

  startSession: (deckKey, ids) => {
    if (get().deckKey === deckKey) return;
    set({ deckKey, remainingIds: ids, knownIds: [], repeatIds: [], results: [] });
  },

  answer: (id, wasCorrect, result) => {
    set((state) => ({
      remainingIds: state.remainingIds.filter((remainingId) => remainingId !== id),
      knownIds: wasCorrect ? [...state.knownIds, id] : state.knownIds,
      repeatIds: wasCorrect ? state.repeatIds : [...state.repeatIds, id],
      results: result ? [...state.results, result] : state.results,
    }));
  },

  reset: () => set({ deckKey: null, remainingIds: [], knownIds: [], repeatIds: [], results: [] }),
}));
