import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/** Локальная дата в формате YYYY-MM-DD (без UTC-сдвига). */
function localToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface RitualState {
  // Дата (локальная), когда ритуал был завершён. null — ритуал не пройден.
  ritualCompletedDate: string | null;

  // Методы для управления состоянием
  completeRitual: () => void;
  resetRitual: () => void;
}

export const useRitualStore = create<RitualState>()(
  persist(
    (set) => ({
      ritualCompletedDate: null,

      completeRitual: () => {
        set({ ritualCompletedDate: localToday() });
      },

      resetRitual: () => {
        set({ ritualCompletedDate: null });
      },
    }),
    {
      name: 'ritual-storage', // ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // v0 хранил булев ritualCompleted (одноразовый навсегда) — сбрасываем,
      // ритуал покажется ещё раз на ближайший заход.
      migrate: (persisted: any, version: number) => {
        if (version === 0) {
          return { ritualCompletedDate: null };
        }
        return persisted;
      },
      // Сохраняем только дату завершения
      partialize: (state) => ({
        ritualCompletedDate: state.ritualCompletedDate,
      }),
    }
  )
);
