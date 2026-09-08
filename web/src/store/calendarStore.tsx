import { create } from 'zustand';

// Интерфейс для записи календаря
export interface CalendarEntry {
  id: string;
  date: Date | null;
  time: string;
}

// Интерфейс для стора календаря
interface CalendarStore {
  // Записи календаря, где ключ - это ID календаря
  entries: Record<string, CalendarEntry>;
  
  // Устанавливает дату для календаря с указанным ID
  setDate: (id: string, date: Date | null) => void;
  
  // Устанавливает время для календаря с указанным ID
  setTime: (id: string, time: string) => void;
  
  // Устанавливает дату и время для календаря с указанным ID
  setDateTime: (id: string, date: Date | null, time: string) => void;
  
  // Получает запись календаря по ID
  getEntry: (id: string) => CalendarEntry | undefined;
  
  // Получает форматированную дату и время
  getFormattedDateTime: (id: string) => string;
  
  // Удаляет запись календаря
  removeEntry: (id: string) => void;
  
  // Очищает все записи
  clearEntries: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  entries: {},
  
  setDate: (id, date) => {
    set((state) => {
      const currentEntry = state.entries[id] || { id, date: null, time: '00:00' };
      return {
        entries: {
          ...state.entries,
          [id]: { ...currentEntry, date }
        }
      };
    });
  },
  
  setTime: (id, time) => {
    set((state) => {
      const currentEntry = state.entries[id] || { id, date: null, time: '00:00' };
      return {
        entries: {
          ...state.entries,
          [id]: { ...currentEntry, time }
        }
      };
    });
  },
  
  setDateTime: (id, date, time) => {
    set((state) => ({
      entries: {
        ...state.entries,
        [id]: { id, date, time }
      }
    }));
  },
  
  getEntry: (id) => {
    return get().entries[id];
  },
  
  getFormattedDateTime: (id) => {
    const entry = get().entries[id];
    if (!entry || !entry.date) return '';
    
    // Форматирование даты в формате YYYY-MM-DD для input
    const year = entry.date.getFullYear();
    const month = (entry.date.getMonth() + 1).toString().padStart(2, '0');
    const day = entry.date.getDate().toString().padStart(2, '0');
    
    return `${day}.${month}.${year}`;
  },
  
  removeEntry: (id) => {
    set((state) => {
      const { [id]: _, ...rest } = state.entries;
      return { entries: rest };
    });
  },
  
  clearEntries: () => set({ entries: {} })
}));
