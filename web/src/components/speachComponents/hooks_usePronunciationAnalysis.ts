import { useState, useCallback } from 'react';

export interface Word {
  text: string;
  isCorrect: boolean | null;
  confidence: number;
  similarity: number;
}

interface UsePronunciationAnalysisReturn {
  words: Word[];
  accuracy: number | null;
  analyze: (targetText: string, recognizedText: string) => number;
  reset: () => void;
}

export const usePronunciationAnalysis = (): UsePronunciationAnalysisReturn => {
  const [words, setWords] = useState<Word[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Нормализация текста (удаление пунктуации, приведение к нижнему регистру)
  const normalizeText = useCallback((text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()-]/g, '') // Удаляем пунктуацию
      .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
      .trim()
      .split(' ')
      .filter(word => word.length > 0);
  }, []);

  // Алгоритм Левенштейна для вычисления расстояния между строками
  const levenshteinDistance = useCallback((str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    // Инициализация матрицы
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    // Заполнение матрицы
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // замена
            matrix[i][j - 1] + 1,     // вставка
            matrix[i - 1][j] + 1      // удаление
          );
        }
      }
    }

    return matrix[len2][len1];
  }, []);

  // Вычисление схожести между двумя словами (0 - 1)
  const calculateSimilarity = useCallback((word1: string, word2: string): number => {
    if (word1 === word2) return 1;
    
    const distance = levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    
    return 1 - (distance / maxLength);
  }, [levenshteinDistance]);

  // Основная функция анализа
  const analyze = useCallback((targetText: string, recognizedText: string) => {
    const targetWords = normalizeText(targetText);
    const recognizedWords = normalizeText(recognizedText);

    // Анализируем каждое слово
    const analyzedWords: Word[] = targetWords.map((targetWord, index) => {
      const recognizedWord = recognizedWords[index];

      if (!recognizedWord) {
        // Слово не было произнесено
        return {
          text: targetWord,
          isCorrect: false,
          confidence: 0,
          similarity: 0,
        };
      }

      const similarity = calculateSimilarity(targetWord, recognizedWord);
      const threshold = 0.75; // Порог схожести для считывания слова правильным
      const isCorrect = similarity >= threshold;

      return {
        text: targetWord,
        isCorrect,
        confidence: similarity,
        similarity,
      };
    });

    // Вычисляем общую точность
    const correctCount = analyzedWords.filter(w => w.isCorrect).length;
    const totalCount = analyzedWords.length;
    const accuracyPercentage = totalCount > 0 
      ? Math.round((correctCount / totalCount) * 100)
      : 0;

    setWords(analyzedWords);
    setAccuracy(accuracyPercentage);

    return accuracyPercentage;
  }, [normalizeText, calculateSimilarity]);

  const reset = useCallback(() => {
    setWords([]);
    setAccuracy(null);
  }, []);

  return {
    words,
    accuracy,
    analyze,
    reset,
  };
};