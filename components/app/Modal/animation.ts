// Интерфейс для позиции клика
export interface ModalPosition {
  x: number;
  y: number;
}

// Варианты анимации для модального окна, теперь это функция
export const modalVariants = (modalPosition?: ModalPosition) => {
  // Рассчитываем начальные координаты X и Y
  // Проверяем, что window существует (для SSR) и modalPosition передан
  const initialX = modalPosition && typeof window !== 'undefined' 
                   ? modalPosition.x - window.innerWidth / 2 
                   : 0;
  const initialY = modalPosition && typeof window !== 'undefined' 
                   ? modalPosition.y - window.innerHeight / 2 
                   : (typeof window !== 'undefined' ? -window.innerHeight / 2 : -500); // Если нет modalPosition, убираем за экран

  return { // <--- Добавлен return
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: initialX,
      y: initialY,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: initialX,
      y: initialY,
      transition: { duration: 0.2 }
    }
  };
};

// Варианты анимации для оверлея
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.7, transition: { duration: 0.3 } }, // Согласовано с предыдущей рабочей версией 0.3s
  exit: { opacity: 0, transition: { duration: 0.3 } }    // Согласовано с предыдущей рабочей версией 0.3s
};

// НОВЫЕ варианты для контента модального окна
export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } }
};