import { generateJSON } from './llm';
import type { 
  TestQuestion, 
  GrammarQuestion, 
  VocabularyQuestion, 
  ReadingQuestion,
  ListeningQuestion,
  WritingQuestion,
  SpeakingQuestion,
  LevelTestData
} from '@/types/level-test';

interface GenerateTestOptions {
  estimatedLevel?: string; // предполагаемый уровень для адаптации теста
  includeSpeaking?: boolean;
  includeWriting?: boolean;
}

/**
 * Генератор теста для определения уровня английского языка
 */
export class LevelTestGenerator {
  /**
   * Генерирует полный тест для определения уровня
   */
  static async generateTest(options: GenerateTestOptions = {}): Promise<LevelTestData> {
    const { estimatedLevel = 'A2', includeSpeaking = true, includeWriting = true } = options;

    const questions: TestQuestion[] = [];

    // Грамматика (10 вопросов)
    const grammarQuestions = await this.generateGrammarQuestions(10, estimatedLevel);
    questions.push(...grammarQuestions);

    // Словарь (10 вопросов)
    const vocabularyQuestions = await this.generateVocabularyQuestions(10, estimatedLevel);
    questions.push(...vocabularyQuestions);

    // Чтение (1 текст с 5 вопросами)
    const readingQuestions = await this.generateReadingQuestions(estimatedLevel);
    questions.push(...readingQuestions);

    // Аудирование (1 диалог с 5 вопросами)
    const listeningQuestions = await this.generateListeningQuestions(estimatedLevel);
    questions.push(...listeningQuestions);

    // Письмо (1 задание)
    if (includeWriting) {
      const writingQuestions = await this.generateWritingQuestions(estimatedLevel);
      questions.push(...writingQuestions);
    }

    // Говорение (2 вопроса)
    if (includeSpeaking) {
      const speakingQuestions = await this.generateSpeakingQuestions(estimatedLevel);
      questions.push(...speakingQuestions);
    }

    // Оцениваем длительность теста
    const estimatedDuration = this.estimateDuration(questions);

    return {
      questions,
      estimatedDuration,
      levelRange: this.getLevelRange(estimatedLevel),
    };
  }

  /**
   * Генерирует вопросы по грамматике
   */
  private static async generateGrammarQuestions(
    count: number,
    level: string
  ): Promise<GrammarQuestion[]> {
    const prompt = `Создай ${count} вопросов по грамматике английского языка для определения уровня ${level}.

Каждый вопрос должен иметь:
- Вопрос с пропуском или выбором правильной формы
- 4 варианта ответа (только один правильный)
- Краткое объяснение правильного ответа

Формат JSON:
{
  "questions": [
    {
      "question": "текст вопроса",
      "options": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      "correctAnswer": 0,
      "explanation": "краткое объяснение"
    }
  ]
}

Вопросы должны покрывать разные темы грамматики для уровня ${level}.`;

    try {
      console.log(`Generating grammar questions for ${level} level...`);
      const response = await generateJSON<{
        questions: GrammarQuestion[]
      }>(prompt, {
        maxTokens: 2000,
        systemPrompt: 'Ты - опытный преподаватель английского языка. Создавай качественные тестовые вопросы.',
      });

      if (!response || !response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid response format: questions array is missing');
      }

      return response.questions.map((q, index) => ({
        ...q,
        id: `grammar-${index + 1}`,
        type: 'grammar' as const,
        points: 1,
      }));
    } catch (error) {
      console.error('[LevelTestGenerator] Failed to generate grammar questions:', error);
      console.error('[LevelTestGenerator] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return this.getFallbackGrammarQuestions(count, level);
    }
  }

  /**
   * Генерирует вопросы по словарю
   */
  private static async generateVocabularyQuestions(
    count: number,
    level: string
  ): Promise<VocabularyQuestion[]> {
    const prompt = `Создай ${count} вопросов по словарю английского языка для уровня ${level}.

Каждый вопрос должен иметь:
- Слово или фразу для определения
- Контекст (предложение с этим словом)
- 4 варианта перевода/определения
- Правильный ответ

Формат JSON:
{
  "questions": [
    {
      "word": "слово",
      "context": "предложение с этим словом",
      "options": ["перевод 1", "перевод 2", "перевод 3", "перевод 4"],
      "correctAnswer": 0
    }
  ]
}`;

    try {
      console.log(`Generating vocabulary questions for ${level} level...`);
      const response = await generateJSON<{
        questions: Array<{
          word: string;
          context: string;
          options: string[];
          correctAnswer: number;
        }>
      }>(prompt, {
        maxTokens: 2000,
      });

      if (!response || !response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid response format: questions array is missing');
      }

      return response.questions.map((q, index) => ({
        id: `vocabulary-${index + 1}`,
        type: 'vocabulary' as const,
        question: `Что означает слово "${q.word}" в данном контексте?`,
        word: q.word,
        context: q.context,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 1,
      }));
    } catch (error) {
      console.error('[LevelTestGenerator] Failed to generate vocabulary questions:', error);
      console.error('[LevelTestGenerator] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return this.getFallbackVocabularyQuestions(count, level);
    }
  }

  /**
   * Генерирует вопросы по чтению
   */
  private static async generateReadingQuestions(
    level: string
  ): Promise<ReadingQuestion[]> {
    const wordCount = this.getWordCountForLevel(level);
    
    const prompt = `Создай текст для чтения на английском языке уровня ${level} (около ${wordCount} слов) и 5 вопросов к нему.

Текст должен быть интересным и подходящим для уровня ${level}.

Формат JSON:
{
  "text": "текст для чтения",
  "questions": [
    {
      "question": "вопрос по тексту",
      "options": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      "correctAnswer": 0
    }
  ]
}`;

    try {
      console.log(`Generating reading questions for ${level} level...`);
      const response = await generateJSON<{
        text: string;
        questions: Array<{
          question: string;
          options: string[];
          correctAnswer: number;
        }>
      }>(prompt, {
        maxTokens: 2500,
      });

      if (!response || !response.text || !response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid response format: text or questions array is missing');
      }

      return [{
        id: 'reading-1',
        type: 'reading' as const,
        question: 'Прочитайте текст и ответьте на вопросы',
        text: response.text,
        questions: response.questions,
        points: response.questions.length,
      }];
    } catch (error) {
      console.error('[LevelTestGenerator] Failed to generate reading questions:', error);
      console.error('[LevelTestGenerator] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return this.getFallbackReadingQuestions(level);
    }
  }

  /**
   * Генерирует вопросы по аудированию
   */
  private static async generateListeningQuestions(
    level: string
  ): Promise<ListeningQuestion[]> {
    const prompt = `Создай диалог или монолог на английском языке уровня ${level} (около 150-200 слов) и 5 вопросов к нему.

Формат JSON (строго валидный, без комментариев):
{
  "transcript": "строка с текстом (дважды экранируй переносы как \\\\n и кавычки как \\\")",
  "questions": [
    {
      "question": "вопрос по аудио",
      "options": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      "correctAnswer": 0
    }
  ]
}

Не добавляй других полей и убедись, что JSON можно распарсить стандартным JSON.parse.`;

    try {
      console.log(`Generating listening questions for ${level} level...`);
      const response = await generateJSON<{
        transcript: string;
        questions: Array<{
          question: string;
          options: string[];
          correctAnswer: number;
        }>
      }>(prompt, {
        maxTokens: 2000,
      });

      if (!response || !response.transcript || !response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid response format: transcript or questions array is missing');
      }

      return [{
        id: 'listening-1',
        type: 'listening' as const,
        question: 'Прослушайте аудио и ответьте на вопросы',
        transcript: response.transcript,
        questions: response.questions,
        points: response.questions.length,
      }];
    } catch (error) {
      console.error('[LevelTestGenerator] Failed to generate listening questions:', error);
      console.error('[LevelTestGenerator] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return this.getFallbackListeningQuestions(level);
    }
  }

  /**
   * Генерирует задание по письму
   */
  private static async generateWritingQuestions(
    level: string
  ): Promise<WritingQuestion[]> {
    const prompt = `Создай задание по письму для уровня ${level}.

Задание должно быть:
- Понятным и конкретным
- Подходящим для уровня ${level}
- С указанием примерного количества слов

Формат JSON:
{
  "prompt": "описание задания",
  "wordLimit": 100,
  "criteria": ["критерий 1", "критерий 2", "критерий 3"]
}`;

    try {
      console.log(`Generating a writing task for a ${level} level test...`);
      const response = await generateJSON<{
        prompt: string;
        wordLimit: number;
        criteria: string[];
      }>(prompt);

      if (!response || !response.prompt) {
        throw new Error('Invalid response format: task prompt is missing');
      }

      return [{
        id: 'writing-1',
        type: 'writing' as const,
        question: 'Напишите текст по заданию',
        prompt: response.prompt,
        wordLimit: response.wordLimit || 100,
        criteria: response.criteria,
        points: 10,
      }];
    } catch (error) {
      console.error('[LevelTestGenerator] Failed to generate writing questions:', error);
      console.error('[LevelTestGenerator] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return this.getFallbackWritingQuestions(level);
    }
  }

  /**
   * Генерирует вопросы для говорения
   */
  private static async generateSpeakingQuestions(
    level: string
  ): Promise<SpeakingQuestion[]> {
    const prompts = [
      `Расскажите о себе. Где вы живете? Чем занимаетесь? Какие у вас хобби?`,
      `Опишите свой последний отпуск или поездку. Что вам больше всего понравилось?`,
    ];

    return prompts.map((prompt, index) => ({
      id: `speaking-${index + 1}`,
      type: 'speaking' as const,
      question: 'Ответьте на вопрос, записав свой голос',
      prompt,
      recordingTimeLimit: 60,
      expectedLength: level === 'A2' ? 30 : level === 'B1' ? 50 : 70,
      points: 10,
    }));
  }

  // Fallback методы (заглушки, если AI не работает)
  private static getFallbackGrammarQuestions(count: number, level: string): GrammarQuestion[] {
    // Простые вопросы для примера
    const questions: GrammarQuestion[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      questions.push({
        id: `grammar-fallback-${i + 1}`,
        type: 'grammar',
        question: `Grammar question ${i + 1} (fallback)`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This is a fallback question',
        points: 1,
      });
    }
    return questions;
  }

  private static getFallbackVocabularyQuestions(count: number, level: string): VocabularyQuestion[] {
    const questions: VocabularyQuestion[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      questions.push({
        id: `vocabulary-fallback-${i + 1}`,
        type: 'vocabulary',
        question: `What does "word${i + 1}" mean?`,
        word: `word${i + 1}`,
        context: `This is a context for word${i + 1}`,
        options: ['Meaning A', 'Meaning B', 'Meaning C', 'Meaning D'],
        correctAnswer: 0,
        points: 1,
      });
    }
    return questions;
  }

  private static getFallbackReadingQuestions(level: string): ReadingQuestion[] {
    return [{
      id: 'reading-fallback-1',
      type: 'reading',
      question: 'Read the text and answer questions',
      text: 'This is a sample reading text for level testing. It contains some information that you can use to answer questions.',
      questions: [
        {
          question: 'What is the main topic?',
          options: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
          correctAnswer: 0,
        },
      ],
      points: 1,
    }];
  }

  private static getFallbackListeningQuestions(level: string): ListeningQuestion[] {
    return [{
      id: 'listening-fallback-1',
      type: 'listening',
      question: 'Listen and answer questions',
      transcript: 'This is a sample listening transcript for level testing.',
      questions: [
        {
          question: 'What did the speaker say?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
        },
      ],
      points: 1,
    }];
  }

  private static getFallbackWritingQuestions(level: string): WritingQuestion[] {
    return [{
      id: 'writing-1',
      type: 'writing',
      question: 'Напишите о себе',
      prompt: 'Напишите короткий рассказ о себе (50-100 слов). Расскажите о том, где вы живете, чем занимаетесь, и что вам нравится.',
      wordLimit: 100,
      criteria: ['Грамматика', 'Словарь', 'Структура текста'],
      points: 10,
    }];
  }

  private static getWordCountForLevel(level: string): number {
    const counts: Record<string, number> = {
      A1: 100,
      A2: 150,
      B1: 200,
      B2: 250,
      C1: 300,
      C2: 350,
    };
    return counts[level] || 150;
  }

  private static estimateDuration(questions: TestQuestion[]): number {
    // Примерная оценка времени
    let minutes = 0;
    questions.forEach((q) => {
      switch (q.type) {
        case 'grammar':
        case 'vocabulary':
          minutes += 1;
          break;
        case 'reading':
          minutes += 5;
          break;
        case 'listening':
          minutes += 5;
          break;
        case 'writing':
          minutes += 10;
          break;
        case 'speaking':
          minutes += 3;
          break;
      }
    });
    return minutes;
  }

  private static getLevelRange(estimatedLevel: string): string {
    const ranges: Record<string, string> = {
      A1: 'A1-A2',
      A2: 'A2-B1',
      B1: 'B1-B2',
      B2: 'B2-C1',
      C1: 'C1-C2',
      C2: 'C2',
    };
    return ranges[estimatedLevel] || 'A2-B1';
  }
}

