'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Token {
  text: string;
  isWord: boolean;
  index: number;
  sentenceIndex: number;
}

interface ClickableTextProps {
  text: string;
  userId: string;
  userLevel: string;
  onWordAdded?: (word: string) => void;
}

export function ClickableText({ text, userId, userLevel, onWordAdded }: ClickableTextProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const [addingWord, setAddingWord] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startIndexRef = useRef<number | null>(null);
  const wasDraggingRef = useRef<boolean>(false);

  // Разбиваем текст на токены (слова и знаки препинания)
  useEffect(() => {
    const sentences = text.split(/([.!?]\s*)/);
    const newTokens: Token[] = [];
    let globalIndex = 0;
    let sentenceIndex = 0;

    sentences.forEach((sentence, sIdx) => {
      // Если это знак препинания с пробелом, добавляем его как отдельный токен
      if (/^[.!?]\s*$/.test(sentence)) {
        newTokens.push({
          text: sentence,
          isWord: false,
          index: globalIndex++,
          sentenceIndex: sentenceIndex - 1, // Принадлежит предыдущему предложению
        });
        return;
      }

      // Разбиваем предложение на слова и пробелы/знаки препинания
      const sentenceTokens = sentence.split(/(\s+|[.,!?;:()"'\[\]{}—–-])/);
      sentenceTokens.forEach((token) => {
        if (token.trim().length === 0) {
          // Пробелы
          newTokens.push({
            text: token,
            isWord: false,
            index: globalIndex++,
            sentenceIndex,
          });
        } else {
          // Слово или знак препинания
          const isWord = /^[a-zA-Zа-яА-ЯёЁ]+$/.test(token);
          newTokens.push({
            text: token,
            isWord,
            index: globalIndex++,
            sentenceIndex,
          });
        }
      });

      if (sentence.trim().length > 0) {
        sentenceIndex++;
      }
    });

    setTokens(newTokens);
  }, [text]);

  // Получаем предложение для токена
  const getSentenceForToken = useCallback(
    (tokenIndex: number): string => {
      if (tokenIndex < 0 || tokenIndex >= tokens.length) return '';

      const token = tokens[tokenIndex];
      if (!token) return '';

      const sentenceTokens = tokens.filter((t) => t.sentenceIndex === token.sentenceIndex);
      return sentenceTokens
        .map((t) => t.text)
        .join('')
        .trim();
    },
    [tokens]
  );

  // Получаем текст выделенного диапазона
  const getSelectedText = useCallback((): string | null => {
    if (!selectedRange) return null;

    const selectedTokens = tokens
      .slice(selectedRange.start, selectedRange.end + 1)
      .filter((t) => t.isWord)
      .map((t) => t.text.trim())
      .filter((t) => t.length > 0);

    return selectedTokens.length > 0 ? selectedTokens.join(' ') : null;
  }, [selectedRange, tokens]);

  // Добавление слова/фразы в vocabulary
  const addWordToVocabulary = useCallback(
    async (wordOrPhrase: string, context?: string) => {
      if (addingWord) return; // Предотвращаем дублирование запросов

      // Проверяем, не является ли текст fallback сообщением
      const isFallbackText = 
        text.toLowerCase().includes('[fallback_message]') ||
        text.toLowerCase().includes('временно недоступен') ||
        text.toLowerCase().includes('попробуй позже') ||
        text.toLowerCase().includes('обратись к преподавателю');
      
      if (isFallbackText) {
        console.warn('Skipping vocabulary extraction from fallback message');
        return;
      }

      setAddingWord(wordOrPhrase);

      try {
        const response = await fetch('/api/vocabulary/generate-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            words: [wordOrPhrase],
            level: userLevel,
            context: context || null,
          }),
        });

        if (response.ok) {
          setAddedWords((prev) => new Set([...prev, wordOrPhrase.toLowerCase()]));
          onWordAdded?.(wordOrPhrase);

          // Кратковременная анимация успеха
          setTimeout(() => {
            setAddingWord(null);
          }, 500);
        } else {
          console.error('Failed to add word to vocabulary');
          setAddingWord(null);
        }
      } catch (error) {
        console.error('Error adding word to vocabulary:', error);
        setAddingWord(null);
      }
    },
    [userId, userLevel, onWordAdded, addingWord]
  );

  // Обработка начала выделения
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tokenIndex: number) => {
      if (!tokens[tokenIndex]?.isWord) return;

      e.preventDefault();
      wasDraggingRef.current = false;
      setIsSelecting(true);
      startIndexRef.current = tokenIndex;
      setSelectedRange({ start: tokenIndex, end: tokenIndex });
    },
    [tokens]
  );

  // Обработка движения мыши при выделении
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting || startIndexRef.current === null) return;

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;

      const tokenElement = element.closest('[data-token-index]');
      if (!tokenElement) return;

      const endIndex = parseInt(tokenElement.getAttribute('data-token-index') || '0', 10);
      const startIndex = startIndexRef.current;

      // Отмечаем, что было движение (drag)
      if (endIndex !== startIndex) {
        wasDraggingRef.current = true;
      }

      setSelectedRange({
        start: Math.min(startIndex, endIndex),
        end: Math.max(startIndex, endIndex),
      });
    },
    [isSelecting]
  );

  // Обработка окончания выделения
  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;

    setIsSelecting(false);
    const selectedText = getSelectedText();

    if (selectedText && wasDraggingRef.current) {
      // Добавляем только если было выделение (drag), а не просто клик
      const startIndex = selectedRange?.start ?? 0;
      const context = getSentenceForToken(startIndex);
      addWordToVocabulary(selectedText, context || undefined);
    }

    // Сбрасываем выделение через небольшую задержку для визуальной обратной связи
    setTimeout(() => {
      setSelectedRange(null);
      startIndexRef.current = null;
      wasDraggingRef.current = false;
    }, 300);
  }, [isSelecting, getSelectedText, selectedRange, tokens, getSentenceForToken, addWordToVocabulary]);

  // Обработка одиночного клика (для мобильных устройств и быстрых кликов)
  const handleClick = useCallback(
    (e: React.MouseEvent, tokenIndex: number) => {
      const token = tokens[tokenIndex];
      if (!token?.isWord) return;

      // Добавляем слово только если не было drag (быстрый клик)
      // Небольшая задержка, чтобы handleMouseUp успел выполниться
      setTimeout(() => {
        if (!wasDraggingRef.current && !isSelecting) {
          const word = token.text.trim().toLowerCase();
          if (word) {
            const context = getSentenceForToken(tokenIndex);
            addWordToVocabulary(word, context);
          }
        }
      }, 100);
    },
    [tokens, isSelecting, getSentenceForToken, addWordToVocabulary]
  );

  // Touch события для мобильных устройств
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, tokenIndex: number) => {
      if (!tokens[tokenIndex]?.isWord) return;

      e.preventDefault();
      wasDraggingRef.current = false;
      setIsSelecting(true);
      startIndexRef.current = tokenIndex;
      setSelectedRange({ start: tokenIndex, end: tokenIndex });
    },
    [tokens]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isSelecting || startIndexRef.current === null) return;

      const touch = e.touches[0];
      if (!touch) return;

      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!element) return;

      const tokenElement = element.closest('[data-token-index]');
      if (!tokenElement) return;

      const endIndex = parseInt(tokenElement.getAttribute('data-token-index') || '0', 10);
      const startIndex = startIndexRef.current;

      // Отмечаем, что было движение (swipe)
      if (endIndex !== startIndex) {
        wasDraggingRef.current = true;
      }

      setSelectedRange({
        start: Math.min(startIndex, endIndex),
        end: Math.max(startIndex, endIndex),
      });
    },
    [isSelecting]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isSelecting) return;

    setIsSelecting(false);
    const selectedText = getSelectedText();

    if (selectedText && wasDraggingRef.current) {
      // Добавляем только если было выделение (swipe), а не просто тап
      const startIndex = selectedRange?.start ?? 0;
      const context = getSentenceForToken(startIndex);
      addWordToVocabulary(selectedText, context || undefined);
    } else if (!wasDraggingRef.current && startIndexRef.current !== null) {
      // Если был просто тап без движения, добавляем одно слово
      const token = tokens[startIndexRef.current];
      if (token?.isWord) {
        const word = token.text.trim().toLowerCase();
        if (word) {
          const context = getSentenceForToken(startIndexRef.current);
          addWordToVocabulary(word, context || undefined);
        }
      }
    }

    setTimeout(() => {
      setSelectedRange(null);
      startIndexRef.current = null;
      wasDraggingRef.current = false;
    }, 300);
  }, [isSelecting, getSelectedText, selectedRange, tokens, getSentenceForToken, addWordToVocabulary]);

  // Глобальные обработчики для drag
  useEffect(() => {
    if (!isSelecting) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element || !containerRef.current.contains(element)) return;

      const tokenElement = element.closest('[data-token-index]');
      if (!tokenElement) return;

      const endIndex = parseInt(tokenElement.getAttribute('data-token-index') || '0', 10);
      if (startIndexRef.current !== null) {
        setSelectedRange({
          start: Math.min(startIndexRef.current, endIndex),
          end: Math.max(startIndexRef.current, endIndex),
        });
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isSelecting, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isSelecting) {
          handleMouseUp();
        }
      }}
    >
      {tokens.map((token, index) => {
        const isSelected =
          selectedRange &&
          index >= selectedRange.start &&
          index <= selectedRange.end &&
          token.isWord;
        const isAdding = addingWord === token.text.trim().toLowerCase();
        const isAdded = addedWords.has(token.text.trim().toLowerCase());

        return (
          <span
            key={`${token.index}-${index}`}
            data-token-index={index}
            className={`
              ${token.isWord ? 'cursor-pointer select-none' : ''}
              ${isSelected ? 'bg-primary/40 border border-primary-deep/40 rounded px-0.5' : ''}
              ${isAdding ? 'bg-green-200 animate-pulse' : ''}
              ${isAdded && !isSelected && !isAdding ? 'border-b border-dashed border-gray-400' : ''}
              transition-colors duration-200
            `}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onClick={(e) => handleClick(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
}

