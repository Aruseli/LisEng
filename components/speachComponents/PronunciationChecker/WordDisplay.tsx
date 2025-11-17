'use client';

import { Volume2, Check, X } from 'lucide-react';
import { Word } from '@/components/speachComponents/hooks_usePronunciationAnalysis';

interface WordDisplayProps {
  word: Word;
  onPlayWord: (text: string) => void;
}

export const WordDisplay = ({ word, onPlayWord }: WordDisplayProps) => {
  const getColorClasses = () => {
    if (word.isCorrect === null) {
      return 'bg-gray-100 text-gray-700 border-gray-200';
    }
    if (word.isCorrect) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getIcon = () => {
    if (word.isCorrect === null) return null;
    if (word.isCorrect) return <Check className="w-3 h-3" />;
    return <X className="w-3 h-3" />;
  };

  return (
    <button
      onClick={() => onPlayWord(word.text)}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
        border-2 mx-1 my-1 transition-all duration-200
        hover:scale-105 hover:shadow-md active:scale-95
        ${getColorClasses()}
      `}
      title={`Similarity: ${Math.round(word.similarity * 100)}%`}
    >
      <span className="font-medium">{word.text}</span>
      {getIcon()}
      {word.isCorrect === false && <Volume2 className="w-3 h-3" />}
    </button>
  );
};