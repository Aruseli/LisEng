/**
 * Типы для теста определения уровня английского языка
 */

export type QuestionType = 
  | 'grammar' 
  | 'vocabulary' 
  | 'reading' 
  | 'listening' 
  | 'writing' 
  | 'speaking';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
}

export interface GrammarQuestion extends BaseQuestion {
  type: 'grammar';
  options: string[];
  correctAnswer: number; // индекс правильного ответа
  explanation?: string;
}

export interface VocabularyQuestion extends BaseQuestion {
  type: 'vocabulary';
  options: string[];
  correctAnswer: number;
  word: string;
  context?: string;
}

export interface ReadingQuestion extends BaseQuestion {
  type: 'reading';
  text: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface ListeningQuestion extends BaseQuestion {
  type: 'listening';
  audioUrl?: string; // URL аудио файла или текст для TTS
  transcript: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface WritingQuestion extends BaseQuestion {
  type: 'writing';
  prompt: string;
  wordLimit?: number;
  criteria: string[]; // критерии оценки
}

export interface SpeakingQuestion extends BaseQuestion {
  type: 'speaking';
  prompt: string;
  recordingTimeLimit?: number; // в секундах
  expectedLength?: number; // ожидаемая длина ответа в словах
}

export type TestQuestion = 
  | GrammarQuestion 
  | VocabularyQuestion 
  | ReadingQuestion 
  | ListeningQuestion 
  | WritingQuestion 
  | SpeakingQuestion;

export interface AnswerMetrics {
  recognizedText?: string;
  pronunciationAccuracy?: number;
}

export interface UserAnswer {
  questionId: string;
  answer: string | number | number[]; // для speaking/writing - текст, для остальных - индекс(ы)
  timeSpent?: number; // время в секундах
  metrics?: AnswerMetrics;
}

export interface TestResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  level: string; // A1, A2, B1, B2, C1, C2
  breakdown: {
    grammar: { points: number; maxPoints: number };
    vocabulary: { points: number; maxPoints: number };
    reading: { points: number; maxPoints: number };
    listening: { points: number; maxPoints: number };
    writing: { points: number; maxPoints: number };
    speaking: { points: number; maxPoints: number };
  };
  feedback: string;
  pronunciation?: {
    listening?: number;
    speaking?: number;
  };
}

export interface LevelTestData {
  questions: TestQuestion[];
  estimatedDuration: number; // в минутах
  levelRange: string; // например "A2-B1"
}



