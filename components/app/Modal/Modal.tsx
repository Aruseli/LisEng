'use client'

import { useEffect, useState, ReactNode } from 'react'; 
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from '../Buttons/IconButton';
import { X } from 'lucide-react';
import s from './Modal.module.scss';
import { overlayVariants, modalContentVariants, modalVariants, type ModalPosition } from './animation';
import { useModalStore } from '@/store/modalStore'; 

interface ModalProps {
  onClose: () => void;
  children?: ReactNode;
  closeOnOverlayClick?: boolean;
  clickPosition?: ModalPosition; // Добавлено для передачи координат клика
}

export const Modal = ({ 
  onClose,
  children,
  closeOnOverlayClick = true,
  clickPosition // Получаем clickPosition
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('[Modal] CRITICAL: Modal root element #modal-root not found in the DOM.');
    return null; 
  }

  return createPortal(
    <motion.div
      className={s.modalContainer}
      // @ts-ignore
      variants={modalVariants(clickPosition)} // Используем modalVariants с clickPosition
      initial="hidden" 
      animate="visible"
      exit="exit"
    >
      <motion.div
        className={s.overlay}
        variants={overlayVariants}
        initial="hidden" 
        animate="visible"
        exit="exit"
        onClick={closeOnOverlayClick ? onClose : undefined} 
        aria-hidden="true"
      />
      <motion.div
        className={s.modalContent}
        // @ts-ignore
        variants={modalContentVariants}
        initial="hidden" 
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
          <IconButton 
            onClick={onClose} 
            ariaLabel='Закрыть'
            icon={<X />}
          />
        </div>
        {children}
      </motion.div>
    </motion.div>,
    modalRoot
  );
};

export const ModalContainer = () => {
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <AnimatePresence>
      {modals.map((modalData) => (
        <Modal
          key={modalData.id} 
          onClose={() => closeModal(modalData.id)}
          closeOnOverlayClick={modalData.closeOnOverlayClick}
          clickPosition={modalData.clickPosition} // Передаем clickPosition
        >
          {modalData.component}
        </Modal>
      ))}
    </AnimatePresence>
  );
};
