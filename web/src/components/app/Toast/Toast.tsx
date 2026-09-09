
import { AnimatePresence, motion } from 'motion/react';
import { useToastStore, ToastType } from '@/store/toastStore';
import { X } from 'lucide-react';
import styles from './Toast.module.scss';

// Цветовые схемы для разных типов уведомлений (бледные)
const toastTypeStyles: Record<ToastType, string> = {
  info: 'bg-blue-50 text-blue-900 border border-blue-200',
  success: 'bg-green-50 text-green-900 border border-green-200',
  warning: 'bg-amber-50 text-amber-900 border border-amber-200',
  error: 'bg-red-50 text-red-900 border border-red-200',
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
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2" role="alert" aria-live="assertive">
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
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
