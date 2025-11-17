import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  // --- Или более продвинутый вариант с счетчиком ---
  // loadingCount: number;
  // incrementLoading: () => void;
  // decrementLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({ // Добавим get для логгирования
  isLoading: false,
  showLoader: () => {
    console.log('STORE: Called showLoader. Current state:', get().isLoading);
    set({ isLoading: true });
    console.log('STORE: State after showLoader:', get().isLoading);
  },
  hideLoader: () => {
    console.log('STORE: Called hideLoader. Current state:', get().isLoading);
    set({ isLoading: false });
    console.log('STORE: State after hideLoader:', get().isLoading);
  },
}));

/* 
// Вариант со счетчиком (если нужно отслеживать несколько параллельных загрузок)
export const useLoadingStore = create<LoadingStore>((set) => ({
  loadingCount: 0,
  incrementLoading: () => set((state) => ({ loadingCount: state.loadingCount + 1 })),
  decrementLoading: () => set((state) => ({ loadingCount: Math.max(0, state.loadingCount - 1) })), // Не уходим в минус
  // Модифицируем isLoading для простоты использования в компоненте
  get isLoading() { 
    return this.loadingCount > 0; 
  },
  // или добавить селектор, если не хотите геттер в стейте:
  // селектор вне стора: const selectIsLoading = (state: LoadingStore) => state.loadingCount > 0;
  
  // Оставляем show/hide для совместимости или простоты, если удобно
  showLoader: () => set((state) => ({ loadingCount: state.loadingCount + 1 })),
  hideLoader: () => set((state) => ({ loadingCount: Math.max(0, state.loadingCount - 1) })),
}));
*/