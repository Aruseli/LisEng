'use client';

import { create } from 'zustand';
import { ReactNode } from 'react';

// Тип для описания модального окна
export interface ModalData {
  id: string;
  component: ReactNode;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  footerContent?: ReactNode;
  // Позиция клика, откуда должно появиться модальное окно
  clickPosition?: { x: number; y: number };
  // Дополнительные классы для стилизации
  className?: string;
}

// Интерфейс стора модальных окон
interface ModalStore {
  // Массив модальных окон в порядке очереди
  modals: ModalData[];
  
  // Добавление нового модального окна
  openModal: (modal: Omit<ModalData, 'id'>) => string;
  
  // Закрытие модального окна по id
  closeModal: (id: string) => void;
  
  // Закрытие всех модальных окон
  closeAllModals: () => void;
  
  // Получение текущего (последнего) модального окна для отображения
  getCurrentModal: () => ModalData | undefined;
}

// Создание стора модальных окон с использованием Zustand
export const useModalStore = create<ModalStore>((set, get) => ({
  // Начальное состояние - пустой массив модальных окон
  modals: [],
  
  // Функция для открытия нового модального окна
  openModal: (modal) => {
    // Генерируем уникальный ID для модального окна
    const id = Math.random().toString(36).substring(2, 9);
    
    // Добавляем модальное окно в конец очереди
    set((state) => ({
      modals: [...state.modals, { ...modal, id }]
    }));
    
    // Возвращаем ID для возможности управления этим окном в будущем
    return id;
  },
  
  // Закрытие модального окна по ID
  closeModal: (id) => {
    const { modals } = get();
    const modalToClose = modals.find(modal => modal.id === id);
    
    // Вызываем пользовательский обработчик закрытия, если он задан
    if (modalToClose?.onClose) {
      modalToClose.onClose();
    }
    
    // Удаляем модальное окно из очереди
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id)
    }));
  },
  
  // Закрытие всех модальных окон
  closeAllModals: () => {
    const { modals } = get();
    
    // Вызываем пользовательские обработчики закрытия для всех окон
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    
    // Очищаем массив модальных окон
    set({ modals: [] });
  },
  
  // Получение текущего (последнего) модального окна
  getCurrentModal: () => {
    const { modals } = get();
    return modals.length > 0 ? modals[modals.length - 1] : undefined;
  }
}));
