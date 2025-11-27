'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useRef, useEffect, useState } from 'react';
import { usePopoverStore } from '@/store/popoverStore';

export interface PopoverProps {
  id: string;
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'up' | 'down' | 'auto';
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

const DEFAULT_HEIGHT_PX = 350;

export const Popover = ({
  id,
  children,
  content,
  position = 'auto',
  className = '',
  contentClassName = '',
  disabled = false,
  maxHeight = '25rem',
  maxWidth = '24rem'
}: PopoverProps) => {
  const { isPopoverOpen, closePopover, togglePopover } = usePopoverStore();
  const isOpen = isPopoverOpen(id);
  const [openDirection, setOpenDirection] = useState<'up' | 'down'>(position === 'auto' ? 'down' : position);
  const [horizontalPosition, setHorizontalPosition] = useState<'left' | 'center' | 'right'>('center');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Функция для расчета направления открытия и горизонтального позиционирования
  const calculatePosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Расчет вертикального позиционирования (если автоматический режим)
    if (position === 'auto') {
      let requiredHeight = DEFAULT_HEIGHT_PX;
      try {
        if (maxHeight.endsWith('rem')) {
          requiredHeight = parseFloat(maxHeight) * parseFloat(getComputedStyle(document.documentElement).fontSize) + 30;
        } else if (maxHeight.endsWith('px')) {
          requiredHeight = parseFloat(maxHeight) + 30;
        }
      } catch (e) { /* Используем дефолтное значение */ }

      if (spaceBelow < requiredHeight + 10 && spaceAbove > requiredHeight + 10) {
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }
    }

    // Расчет горизонтального позиционирования
    let calculatedWidth = 384; // 24rem = 384px по умолчанию
    try {
      if (maxWidth.endsWith('rem')) {
        calculatedWidth = parseFloat(maxWidth) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      } else if (maxWidth.endsWith('px')) {
        calculatedWidth = parseFloat(maxWidth);
      }
    } catch (e) { /* Используем дефолтное значение */ }

    const triggerCenter = rect.left + rect.width / 2;
    const halfContentWidth = calculatedWidth / 2;

    // Проверяем выход за границы экрана
    if (triggerCenter - halfContentWidth < 16) {
      // Слишком близко к левому краю
      setHorizontalPosition('left');
    } else if (triggerCenter + halfContentWidth > window.innerWidth - 16) {
      // Слишком близко к правому краю
      setHorizontalPosition('right');
    } else {
      // Можно центрировать
      setHorizontalPosition('center');
    }
  };
  
  // Обработчик открытия поповера
  useEffect(() => {
    // Если поповер открыт, вычисляем позицию
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen]);
  
  // При изменении размера окна пересчитываем позицию
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) calculatePosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);
  
  // Обработка клика вне поповера
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        contentRef.current && !contentRef.current.contains(event.target as Node)
      ) {
        closePopover(id);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, id, closePopover]);

  // Пересчитываем позицию при клике на элемент для точности
  const handleContainerClick = () => {
    if (isOpen) {
      setTimeout(calculatePosition, 0); // Отложенный расчет позиции
    }
  };

  // Классы позиционирования для контейнера контента
  const verticalPositionClasses = openDirection === 'up'
    ? 'bottom-full mb-1'
    : 'top-full mt-1';
    
  // Классы горизонтального позиционирования
  const horizontalPositionClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  }[horizontalPosition];

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      onClick={handleContainerClick}
      style={{ position: 'relative' }}
    >
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className={`absolute z-50 ${verticalPositionClasses} ${horizontalPositionClasses} ${contentClassName}`}
            initial={{ opacity: 0, y: openDirection === 'up' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ opacity: 0, y: openDirection === 'up' ? 10 : -10, transition: { duration: 0.15, ease: "easeIn" } }}
            style={{ 
              transformOrigin: openDirection === 'up' ? 'bottom center' : 'top center',
              maxHeight: maxHeight,
              maxWidth: maxWidth,
              width: 'max-content',
              overflowX: 'hidden'
            }}
            onAnimationStart={calculatePosition} // Пересчитываем в начале анимации
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};