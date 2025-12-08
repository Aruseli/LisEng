'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RitualState {
  // Флаг завершения ритуала
  ritualCompleted: boolean;
  
  // Методы для управления состоянием
  completeRitual: () => void;
  resetRitual: () => void;
}

export const useRitualStore = create<RitualState>()(
  persist(
    (set) => ({
      ritualCompleted: false,

      completeRitual: () => {
        set({ ritualCompleted: true });
      },

      resetRitual: () => {
        set({ ritualCompleted: false });
      },
    }),
    {
      name: 'ritual-storage', // ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только флаг завершения
      partialize: (state) => ({
        ritualCompleted: state.ritualCompleted,
      }),
    }
  )
);



