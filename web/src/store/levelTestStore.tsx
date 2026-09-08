import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TestQuestion, UserAnswer } from '@/types/level-test';

interface LevelTestState {
  // Данные теста
  questions: TestQuestion[] | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number | null;
  
  // Методы для управления состоянием
  initializeTest: (questions: TestQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addAnswer: (answer: UserAnswer) => void;
  updateAnswer: (questionId: string, answer: UserAnswer) => void;
  clearTest: () => void;
  
  // Вспомогательные методы
  getCurrentAnswer: (questionId: string) => UserAnswer | undefined;
  hasAnswer: (questionId: string) => boolean;
  isTestInProgress: () => boolean;
}

const initialState = {
  questions: null,
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
};

export const useLevelTestStore = create<LevelTestState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeTest: (questions) => {
        const startTime = Date.now();
        set({
          questions,
          currentQuestionIndex: 0,
          answers: [],
          startTime,
        });
      },

      setCurrentQuestionIndex: (index) => {
        set({ currentQuestionIndex: index });
      },

      addAnswer: (answer) => {
        set((state) => {
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === answer.questionId
          );

          if (existingIndex >= 0) {
            // Обновляем существующий ответ
            const updated = [...state.answers];
            updated[existingIndex] = answer;
            return { answers: updated };
          }

          // Добавляем новый ответ
          return { answers: [...state.answers, answer] };
        });
      },

      updateAnswer: (questionId, answer) => {
        set((state) => {
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === questionId
          );

          if (existingIndex >= 0) {
            const updated = [...state.answers];
            updated[existingIndex] = answer;
            return { answers: updated };
          }

          return { answers: [...state.answers, answer] };
        });
      },

      clearTest: () => {
        set(initialState);
      },

      getCurrentAnswer: (questionId) => {
        return get().answers.find((a) => a.questionId === questionId);
      },

      hasAnswer: (questionId) => {
        return get().answers.some((a) => a.questionId === questionId);
      },

      isTestInProgress: () => {
        const state = get();
        return state.questions !== null && state.startTime !== null;
      },
    }),
    {
      name: 'level-test-storage', // ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только необходимые поля
      partialize: (state) => ({
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        startTime: state.startTime,
      }),
    }
  )
);


