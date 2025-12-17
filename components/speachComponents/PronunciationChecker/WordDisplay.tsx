'use client';

import { Volume2, Check, X } from 'lucide-react';
import { Word } from '@/components/speachComponents/hooks_usePronunciationAnalysis';
import { IconButton } from '@/components/app/Buttons/IconButton';

interface WordDisplayProps {
  word: Word;
  onPlayWord: (text: string) => void;
  onRemove?: (text: string) => void;
}

export const WordDisplay = ({ word, onPlayWord, onRemove }: WordDisplayProps) => {
  const getColorClasses = () => {
    if (word.isCorrect === null) {
      return 'bg-gray-100 text-gray-700 border-gray-200';
    }
    if (word.isCorrect) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    return 'bg-red-100 text-red-700 border-red-300';
  };

  // Иконка используется только для "зелёного" (корректного) слова.
  // Для некорректного слова (красного) X отрисовывается отдельно как кнопка удаления.
  const getIcon = () => {
    if (!word.isCorrect) return null;
    return <Check className="size-3" />;
  };

  const handleRemoveClick = (event: any) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove(word.text);
    }
  };

  return (
    <div
      onClick={() => onPlayWord(word.text)}
      className={`
        inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg 
        border-2 mx-1 my-1 transition-all duration-200
        hover:scale-105 hover:shadow-md active:scale-95
        ${getColorClasses()}
      `}
      title={`Similarity: ${Math.round(word.similarity * 100)}%`}
    >
      <span className="font-medium flex items-center gap-1.5">
        {word.text}
        {word.isCorrect === true && getIcon()}
        {word.isCorrect === false && (
          <IconButton
            icon={<X className="size-3" />}
            ariaLabel={`Исключить слово ${word.text} из словаря`}
            onClick={handleRemoveClick}
          />
        )}
      </span>
      <IconButton 
        icon={word.isCorrect === false && <Volume2 className="size-3" />}
        ariaLabel={`Прослушать слово ${word.text}`}
        onClick={() => onPlayWord(word.text)}
      />
    </div>
  );
};