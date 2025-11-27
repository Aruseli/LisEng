'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: Option[];
  onChange: (value: string | number) => void;
  value: string | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  optionsListMaxHeight?: string;
}

const DEFAULT_OPTIONS_HEIGHT_PX = 350;

export const Popover = ({
  options,
  onChange,
  value,
  placeholder = 'Выберите...',
  className = '',
  disabled = false,
  optionsListMaxHeight = '8rem'
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<'up' | 'down'>('down');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null); // Ref для контейнера опций

  const handleToggle = () => {
    if (disabled || !buttonRef.current) return;

    if (!open) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let requiredHeight = DEFAULT_OPTIONS_HEIGHT_PX;
       try {
          if (optionsListMaxHeight.endsWith('rem')) {
            requiredHeight = parseFloat(optionsListMaxHeight) * parseFloat(getComputedStyle(document.documentElement).fontSize) + 30;
          } else if (optionsListMaxHeight.endsWith('px')) {
            requiredHeight = parseFloat(optionsListMaxHeight) + 30;
          }
       } catch (e) { /* Оставляем дефолтное значение */ }


      if (spaceBelow < requiredHeight + 10 && spaceAbove > requiredHeight + 10) { // Добавим буфер 10px
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }
    }

    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        optionsContainerRef.current && !optionsContainerRef.current.contains(event.target as Node) // Используем ref контейнера
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);


  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  // Классы позиционирования для КОНТЕЙНЕРА списка
  const positionClasses = openDirection === 'up'
    ? 'bottom-full mb-1'
    : 'top-full mt-1';

  return (
    <div className="relative inline-block w-max">
      <motion.button
        ref={buttonRef}
        className={`w-max min-w-[7rem] h-8 px-4 py-2 rounded-md input-outline text-foreground flex flex-row gap-2 items-center justify-between ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm truncate">
          {selectedLabel}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown />
        </motion.div>
      </motion.button>

      {/* Контейнер для списка опций - он анимирует появление/исчезновение и позицию */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={optionsContainerRef} // Привязываем ref сюда
            className={`absolute left-0 right-0 z-50 ${positionClasses}`} // Динамическое позиционирование
             // Анимация контейнера: плавное появление/исчезновение и сдвиг
            initial={{ opacity: 0, y: openDirection === 'up' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ opacity: 0, y: openDirection === 'up' ? 10 : -10, transition: { duration: 0.15, ease: "easeIn" } }}
             // Точка трансформации не так важна, если нет scale, но оставим на всякий случай
            style={{ transformOrigin: openDirection === 'up' ? 'bottom center' : 'top center' }}
          >
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};