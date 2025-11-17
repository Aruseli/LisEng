'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useToastStore, ToastType } from '@/store/toastStore';
import { X } from 'lucide-react';
import styles from './Toast.module.scss';

// Цветовые схемы для разных типов уведомлений
const toastTypeStyles: Record<ToastType, string> = {
  info: 'bg-green-500 text-white',
  success: 'bg-nm-primary-deep text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
};

// Анимации для появления/исчезновения
const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.3, transition: { duration: 0.2, ease: "easeIn" } }
};

export const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="alert" aria-live="assertive">
      <AnimatePresence mode="wait">
        {toasts.map((toast) => (
          // @ts-ignore
          <motion.div
            key={toast.id}
            {...toastAnimation}
            className={`shadow-lg ${styles.motion_block} ${toastTypeStyles[toast.type]}`}
          >
            <p className="text-sm font-medium pr-4">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
