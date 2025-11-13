import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY //process.env.ANTHROPIC_API_KEY,
});

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIFeedback {
  strengths: string[];
  improvements: string[];
  score: number;
  detailedNotes?: string;
  correctedText?: string;
}

interface RequestOptions {
  maxTokens?: number;
  systemPrompt?: string;
  retries?: number;
}

export class ClaudeService {
  /**
   * Базовый метод для запросов к Claude с retry логикой
   * Можно легко заменить на другой AI SDK в будущем
   */
  private static async makeRequest(
    messages: Anthropic.MessageParam[],
    options: RequestOptions = {}
  ): Promise<string> {
    const { maxTokens = 1000, systemPrompt, retries = 2 } = options;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          system: systemPrompt,
          messages,
        });

        const content = response.content[0];
        if (content.type === 'text') {
          return content.text;
        }
        
        throw new Error('Unexpected response format: content is not text');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Не повторяем при определенных ошибках (например, неверный API ключ)
        if (error instanceof Anthropic.APIError) {
          if (error.status === 401 || error.status === 403) {
            throw error;
          }
        }
        
        // Экспоненциальная задержка перед повтором
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError || new Error('Failed to get response from Claude');
  }

  /**
   * Публичный метод для генерации произвольного JSON через AI
   * Полезно для генерации тестов и других структурированных данных
   */
  static async generateJSON<T>(
    prompt: string,
    options: { maxTokens?: number; systemPrompt?: string } = {}
  ): Promise<T> {
    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: options.maxTokens || 2000, systemPrompt: options.systemPrompt }
    );
    return this.parseJSONResponse<T>(response);
  }

  /**
   * Парсит JSON из ответа AI, убирая markdown форматирование
   */
  private static parseJSONResponse<T>(text: string): T {
    try {
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Пытаемся найти JSON в тексте, если он обернут в текст
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Failed to parse JSON response:', text);
      throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // ============================================
  // SPEAKING PRACTICE
  // ============================================
  static async conductSpeakingPractice(
    topic: string,
    level: string,
    conversationHistory: AIMessage[] = []
  ): Promise<string> {
    const systemPrompt = `Ты - дружелюбный учитель английского для ребёнка уровня ${level}.
Задача: проводить диалог на тему "${topic}".

Правила:
- Используй простые конструкции, подходящие для уровня ${level}
- Задавай открытые вопросы, чтобы ребёнок практиковал речь
- Если видишь ошибку, мягко исправляй в следующей реплике
- Будь поддерживающим и позитивным
- Говори коротко (1-2 предложения за раз)

Начни с приветствия и вопроса по теме.`;

    const messages: Anthropic.MessageParam[] = conversationHistory.length > 0 
      ? conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        }))
      : [{ role: 'user', content: 'Начни диалог' }];

    return await this.makeRequest(messages, {
      maxTokens: 300,
      systemPrompt,
    });
  }

  // ============================================
  // WRITING CHECK
  // ============================================
  static async checkWriting(
    text: string,
    topic: string,
    level: string
  ): Promise<AIFeedback> {
    const prompt = `Проверь письменное задание ученика уровня ${level}.
Тема: "${topic}"

Текст ученика:
"""
${text}
"""

Дай фидбек в формате JSON:
{
  "strengths": ["что хорошо - 2-3 пункта"],
  "improvements": ["главные ошибки с объяснениями - 3-4 пункта"],
  "score": 8.5,
  "detailedNotes": "общий комментарий",
  "correctedText": "исправленная версия текста"
}

Будь конструктивным и дружелюбным!`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 1000 }
    );

    return this.parseJSONResponse<AIFeedback>(response);
  }

  // ============================================
  // GENERATE READING TASK
  // ============================================
  static async generateReadingTask(
    level: string,
    topic: string,
    wordCount: number = 200
  ): Promise<{
    text: string;
    questions: Array<{ question: string; answer: string }>;
  }> {
    const prompt = `Создай учебный текст для чтения на английском языке.

Параметры:
- Уровень: ${level}
- Тема: ${topic}
- Длина: ${wordCount} слов
- Стиль: простой, понятный, интересный для ребёнка

После текста создай 5 вопросов:
- 3 на понимание фактов (What/Where/When)
- 2 на выводы (Why/inference)

Формат ответа - JSON:
{
  "text": "текст на английском",
  "questions": [
    {"question": "вопрос", "answer": "правильный ответ"}
  ]
}`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 1500 }
    );

    return this.parseJSONResponse<{
      text: string;
      questions: Array<{ question: string; answer: string }>;
    }>(response);
  }

  // ============================================
  // GRAMMAR DRILL
  // ============================================
  static async generateGrammarDrill(
    grammarTopic: string,
    level: string,
    count: number = 5
  ): Promise<Array<{
    sentence: string;
    correct: boolean;
    explanation?: string;
  }>> {
    const prompt = `Создай ${count} предложений для практики грамматики.

Тема: ${grammarTopic}
Уровень: ${level}

Требования:
- 50% предложений должны быть правильными
- 50% должны содержать типичную ошибку
- К каждой ошибке дай краткое объяснение

Формат JSON:
{
  "exercises": [
    {
      "sentence": "предложение",
      "correct": true/false,
      "explanation": "почему неправильно (если correct: false)"
    }
  ]
}`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 1000 }
    );

    const parsed = this.parseJSONResponse<{ exercises: Array<{
      sentence: string;
      correct: boolean;
      explanation?: string;
    }> }>(response);
    
    return parsed.exercises;
  }

  // ============================================
  // VOCABULARY PRACTICE
  // ============================================
  static async generateVocabularyExamples(
    word: string,
    level: string
  ): Promise<{
    definition: string;
    examples: string[];
    synonyms: string[];
    tip: string;
  }> {
    const prompt = `Объясни слово "${word}" для ученика уровня ${level}.

Формат JSON:
{
  "definition": "простое определение на русском",
  "examples": ["3 примера использования на английском"],
  "synonyms": ["2-3 синонима подходящие для уровня ${level}"],
  "tip": "мнемонический совет для запоминания"
}`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 500 }
    );

    return this.parseJSONResponse<{
      definition: string;
      examples: string[];
      synonyms: string[];
      tip: string;
    }>(response);
  }

  // ============================================
  // SESSION SUMMARY
  // ============================================
  static async generateSessionSummary(
    conversation: AIMessage[],
    sessionType: string
  ): Promise<AIFeedback> {
    const conversationText = conversation
      .map(msg => `${msg.role === 'user' ? 'Ученик' : 'Учитель'}: ${msg.content}`)
      .join('\n');

    const prompt = `Проанализируй учебную сессию и дай обратную связь.

Тип сессии: ${sessionType}
Диалог:
"""
${conversationText}
"""

Формат JSON:
{
  "strengths": ["что получилось хорошо - 2-3 пункта"],
  "improvements": ["над чем поработать - 2-3 пункта"],
  "score": 8.5,
  "detailedNotes": "общая оценка прогресса"
}

Будь конкретным и мотивирующим!`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 800 }
    );

    return this.parseJSONResponse<AIFeedback>(response);
  }

  // ============================================
  // PLAN SUMMARY & TASK PROMPTS
  // ============================================

  static async generatePlanSummary(options: {
    userName?: string;
    level: string;
    targetLevel?: string;
    date: string;
    focus?: string[];
    tasks: Array<{ type: string; title: string; status: string }>;
    requirementChecks?: Array<{ message: string; met: boolean }>;
  }): Promise<{
    summary: string;
    motivation: string;
    steps: string[];
    mantra: string;
  }> {
    const prompt = `Ты — наставник по методике Кумон/Кайдзен. Подготовь объяснение плана дня для ученика.

Данные:
- Имя: ${options.userName || 'ученик'}
- Уровень: ${options.level}
- Цель: ${options.targetLevel || 'не указана'}
- Дата: ${options.date}
- Фокус: ${(options.focus ?? []).join(', ') || 'не указан'}
- Задачи: ${JSON.stringify(options.tasks)}
- Проверки требований: ${JSON.stringify(options.requirementChecks ?? [])}

Сформируй JSON:
{
  "summary": "общее объяснение (2-3 предложения)",
  "motivation": "дружелюбная поддержка (1-2 предложения)",
  "steps": ["три конкретных шага на сегодня"],
  "mantra": "краткая фраза-напоминание"
}`;

    const result = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 600 }
    );

    return this.parseJSONResponse(result);
  }

  static async generateTaskPrompt(options: {
    type: 'speaking' | 'writing' | 'reading' | 'listening';
    level: string;
    topic: string;
    context?: string;
  }): Promise<{
    prompt: string;
    checklist: string[];
    tips: string[];
  }> {
    const prompt = `Подготовь инструкцию для задания типа "${options.type}" уровня ${options.level}.
Тема: ${options.topic}
Контекст: ${options.context || 'не указан'}

Сформируй JSON:
{
  "prompt": "что сделать ученику",
  "checklist": ["3-4 действия для проверки себя"],
  "tips": ["подсказки, мотивация"]
}`;

    const result = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      { maxTokens: 500 }
    );

    return this.parseJSONResponse(result);
  }
}