import type { Hasyx } from '@/lib/hasura/compat';

import { generateJSON } from '@/lib/ai/llm';
import { getUserProfile, updateDailyTaskMetadata, getUserInstructionLanguage } from '@/lib/hasura-queries';

interface TaskRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string | null;
  type_specific_payload?: Record<string, any> | null;
}

interface LessonExample {
  prompt: string;
  explanation: string;
}

interface LessonQuestion {
  prompt: string;
  expectedAnswer: string;
  hint?: string | null;
  evaluationCriteria?: string[];
}

export interface LessonMaterials {
  overview: string;
  explanation: string[];
  keyPoints: string[];
  examples: LessonExample[];
  readingPassages?: Array<{
    title?: string;
    text?: string;
    targetWords?: string[];
  }>;
  pronunciationScript?: string | null;
  targetWords?: string[];
  requiresPronunciation?: boolean;
  exercise: {
    title: string;
    steps: string[];
    questions: LessonQuestion[];
  };
  meta: {
    generatedAt: string;
    level: string;
    targetLevel: string;
    taskType: string;
  };
}

interface GenerateLessonOptions {
  userId: string;
  task: TaskRow;
}

export class LessonContentService {
  constructor(private readonly hasyx: Hasyx) {}

  async getOrGenerateLesson(options: GenerateLessonOptions): Promise<LessonMaterials> {
    const existing = this.extractLesson(options.task);
    if (existing) {
      return existing;
    }

    const user = await getUserProfile(this.hasyx, options.userId);
    const currentLevel = user?.current_level || 'A2';
    const targetLevel = user?.target_level || currentLevel;

    const lesson = await this.generateLessonFromAI({
      task: options.task,
      currentLevel,
      targetLevel,
      userId: options.userId,
    });

    const mergedPayload = {
      ...(options.task.type_specific_payload ?? {}),
      lesson_materials: lesson,
    };

    await updateDailyTaskMetadata(this.hasyx, options.task.id, {
      typeSpecificPayload: mergedPayload,
    });

    return lesson;
  }

  /**
   * Парсит заголовок задачи для извлечения темы и уровня
   */
  private parseTaskTitle(title: string): {
    topic: string;
    level?: string;
    wordCount?: number;
  } {
    // Извлекаем уровень (A1, A2, B1, B2 и т.д.)
    const levelMatch = title.match(/\b([A-C][12])\b/i);
    const level = levelMatch ? levelMatch[1].toUpperCase() : undefined;

    // Извлекаем количество слов (150-200 слов, 120-150 слов и т.д.)
    const wordCountMatch = title.match(/(\d+)-(\d+)\s*слов/i);
    const wordCount = wordCountMatch
      ? Math.floor((parseInt(wordCountMatch[1]) + parseInt(wordCountMatch[2])) / 2)
      : undefined;

    // Извлекаем тему (убираем служебные слова)
    let topic = title
      .replace(/Разберём тему:\s*/i, '')
      .replace(/Адаптированный текст\s*/i, '')
      .replace(/Новая грамматическая структура\s*/i, '')
      .replace(/\(микро-урок\)/i, '')
      .replace(/\([^)]+\)/g, '') // Убираем все скобки с содержимым
      .replace(/\d+-\d+\s*слов/gi, '')
      .replace(/[A-C][12]-[A-C][12]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Если тема пустая, используем весь заголовок
    if (!topic || topic.length < 3) {
      topic = title;
    }

    return { topic, level, wordCount };
  }

  private extractLesson(task: TaskRow): LessonMaterials | null {
    const raw = task.type_specific_payload;
    if (!raw || typeof raw !== 'object') {
      return null;
    }
    const lesson = raw.lesson_materials;
    if (!lesson) {
      return null;
    }
    return lesson as LessonMaterials;
  }

  private async generateLessonFromAI(params: {
    task: TaskRow;
    currentLevel: string;
    targetLevel: string;
    userId: string;
  }): Promise<LessonMaterials> {
    // КРИТИЧНО: Для reading/listening сначала генерируем текст/диалог отдельно
    let preGeneratedText: string | null = null;
    if (params.task.type === 'reading' || params.task.type === 'listening') {
      try {
        preGeneratedText = await this.generateTextOrDialogueOnly(params);
      } catch (error) {
        console.warn('[LessonContentService] Failed to pre-generate text/dialogue:', error);
      }
    }

    let attempt = 0;
    // Для reading/listening делаем больше попыток, так как критично получить реальный текст
    const maxAttempts = params.task.type === 'reading' || params.task.type === 'listening' ? 4 : 2;
    let lastValidLesson: LessonMaterials | null = null;

    while (attempt < maxAttempts) {
      try {
        const payload = await this.invokeAi({ ...params, preGeneratedText }, attempt > 0);
        
        // Если был предгенерированный текст, но AI его не использовал или перезаписал - восстанавливаем его
        if (preGeneratedText && payload?.lesson?.readingPassages) {
          const firstPassage = payload.lesson.readingPassages[0];
          const text = firstPassage?.text || '';
          // Проверяем, что текст валидный (не пустой, не заголовок, достаточной длины)
          if (!text || text.length < 100 || this.isTextJustTitle(text, params.task.title)) {
            // Восстанавливаем предгенерированный текст
            payload.lesson.readingPassages[0] = {
              title: params.task.type === 'listening' ? 'Диалог для прослушивания' : 'Текст для чтения',
              text: preGeneratedText,
              targetWords: firstPassage?.targetWords || [],
            };
          }
        }
        
        const lesson = this.normalizeLesson(payload, params);

        // Валидация: проверяем, что критичные поля заполнены
        const validationErrors = this.validateLesson(lesson, params.task.type, params.task.title);
        
        if (validationErrors.length === 0) {
          return lesson;
        }

        console.warn(
          `[LessonContentService] Validation failed (attempt ${attempt + 1}/${maxAttempts}):`,
          validationErrors
        );

        // Сохраняем последний урок для возможного использования
        lastValidLesson = lesson;

        // Для reading/listening на последних попытках пробуем сгенерировать только текст/диалог
        if (
          (params.task.type === 'reading' || params.task.type === 'listening') &&
          attempt >= maxAttempts - 2
        ) {
          try {
            const generatedText = await this.generateTextOrDialogueOnly(params);
            
            if (generatedText) {
              // Обновляем урок с сгенерированным текстом
              if (params.task.type === 'reading') {
                lesson.readingPassages = [
                  {
                    title: 'Текст для чтения',
                    text: generatedText,
                    targetWords: [],
                  },
                ];
              } else {
                lesson.readingPassages = [
                  {
                    title: 'Диалог для прослушивания',
                    text: generatedText,
                    targetWords: [],
                  },
                ];
              }

              // Проверяем валидацию снова
              const newValidationErrors = this.validateLesson(lesson, params.task.type, params.task.title);
              
              if (newValidationErrors.length === 0) {
                return lesson;
              }
            }
          } catch (textGenError) {
            console.warn('[LessonContentService] Failed to generate text/dialogue separately:', textGenError);
          }
        }

        if (attempt === maxAttempts - 1) {
          // Последняя попытка - используем fallback с улучшенным контентом
          return this.buildEnhancedFallbackLesson(params, lastValidLesson);
        }
      } catch (error) {
        console.warn(
          `[LessonContentService] AI generation failed (attempt ${attempt + 1}/${maxAttempts}):`,
          error
        );
        if (attempt === maxAttempts - 1) {
          return this.buildEnhancedFallbackLesson(params, lastValidLesson ?? undefined);
        }
      }

      attempt++;
    }

    // Fallback на случай, если все попытки провалились
    return this.buildEnhancedFallbackLesson(params, lastValidLesson ?? undefined);
  }

  /**
   * Генерирует только текст или диалог отдельным запросом
   */
  private async generateTextOrDialogueOnly(params: {
    task: TaskRow;
    currentLevel: string;
    targetLevel: string;
    userId: string;
  }): Promise<string | null> {
    const parsedTitle = this.parseTaskTitle(params.task.title);
    const effectiveLevel = parsedTitle.level || params.currentLevel;
    const wordCount = parsedTitle.wordCount || 150;

    const isDialogue = params.task.type === 'listening';
    const prompt = isDialogue
      ? `Create a dialogue in English for a listening lesson.

Topic: "${parsedTitle.topic}"
Level: ${effectiveLevel}
Audience: teenager

Requirements:
- Natural conversation between 2-3 characters
- Minimum 5-8 exchanges
- Realistic situations from teenager's life
- Appropriate for level ${effectiveLevel}

Format example:
Sarah: "Hi Tom! How was your weekend?"
Tom: "It was great! I went to the cinema with my friends."
Sarah: "That sounds fun! What movie did you watch?"

Return ONLY the dialogue text, nothing else.`
      : `Create a reading text in English for a reading lesson.

Topic: "${parsedTitle.topic}"
Level: ${effectiveLevel}
Audience: teenager
Length: minimum ${wordCount} words

Requirements:
- Interesting and engaging text
- Suitable for teenager
- Appropriate for level ${effectiveLevel}
- Complete sentences, coherent text

Return ONLY the text, nothing else.`;

    try {
      // Пробуем сначала получить простой текст без JSON
      const simpleResponse = await generateJSON<string>(
        `${prompt}\n\nReturn the text/dialogue directly as a string.`,
        {
          maxTokens: 2000,
          systemPrompt: isDialogue
            ? 'You create dialogues for English lessons. Always create real, natural dialogues with character lines. Return only the dialogue text.'
            : 'You create texts for English lessons. Always create real, complete texts of the specified length. Return only the text.',
        }
      );

      // Если получили строку напрямую
      if (typeof simpleResponse === 'string') {
        const text = simpleResponse.trim();
        if (text && text.length > 50 && !this.isTextJustTitle(text, params.task.title)) {
          return text;
        }
      }

      // Если не получилось, пробуем JSON формат
      const jsonResponse = await generateJSON<{ text: string }>(
        `${prompt}\n\nReturn in JSON format: {"text": "your text or dialogue here"}`,
        {
          maxTokens: 2000,
          systemPrompt: isDialogue
            ? 'You create dialogues for English lessons. Always create real, natural dialogues with character lines.'
            : 'You create texts for English lessons. Always create real, complete texts of the specified length.',
        }
      );

      const text = jsonResponse?.text?.trim();
      if (text && text.length > 50 && !this.isTextJustTitle(text, params.task.title)) {
        return text;
      }
    } catch (error) {
      console.warn('[LessonContentService] Failed to generate text/dialogue separately:', error);
    }

    return null;
  }

  /**
   * Проверяет, является ли текст просто заголовком или шаблоном
   */
  private isTextJustTitle(text: string, taskTitle: string): boolean {
    if (!text || !taskTitle) return false;
    
    const normalizedText = text.trim().toLowerCase();
    const normalizedTitle = taskTitle.trim().toLowerCase();
    
    // Проверяем fallback сообщения
    if (normalizedText.includes('[fallback_message]') || 
        normalizedText.includes('временно недоступен') ||
        normalizedText.includes('попробуй позже') ||
        normalizedText.includes('обратись к преподавателю')) {
      return true;
    }
    
    // Проверяем, содержит ли текст заголовок задачи
    if (normalizedText.includes(normalizedTitle) && normalizedText.length < normalizedTitle.length * 2) {
      return true;
    }
    
    // Проверяем типичные шаблоны
    const templatePatterns = [
      /^текст\s*(для|по)/i,
      /^диалог\s*(для|по)/i,
      /^адаптированный\s*текст/i,
      /^аудирование/i,
      /^короткий\s*диалог/i,
      /^\d+-\d+\s*слов/i,
      /^[a-c][12]-[a-c][12]/i,
    ];
    
    return templatePatterns.some(pattern => pattern.test(normalizedText));
  }

  /**
   * Валидирует сгенерированный урок
   */
  private validateLesson(lesson: LessonMaterials, taskType: string, taskTitle: string): string[] {
    const errors: string[] = [];

    if (taskType === 'grammar') {
      if (lesson.examples.length === 0) {
        errors.push('Grammar lesson must have at least 3 examples');
      }
      if (lesson.explanation.length < 3) {
        errors.push('Grammar lesson must have at least 3 explanation points');
      }
      if (lesson.exercise.questions.length === 0) {
        errors.push('Grammar lesson must have at least 2 practice questions');
      }
    }

    if (taskType === 'reading') {
      if (!lesson.readingPassages || lesson.readingPassages.length === 0) {
        errors.push('Reading lesson must have at least one reading passage');
      } else {
        const text = lesson.readingPassages[0]?.text || '';
        if (text.length < 200) { // Увеличиваем минимум до 200 символов
          errors.push('Reading passage must be at least 200 characters long');
        }
        // Проверяем, что это не просто заголовок
        if (this.isTextJustTitle(text, taskTitle)) {
          errors.push('Reading passage must be a real text, not just a title or template');
        }
        // Проверяем, что текст содержит реальные предложения (минимум 2 точки)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length < 3) {
          errors.push('Reading passage must contain at least 3 complete sentences');
        }
      }
    }

    if (taskType === 'listening') {
      if (!lesson.readingPassages || lesson.readingPassages.length === 0) {
        errors.push('Listening lesson must have a transcript');
      } else {
        const text = lesson.readingPassages[0]?.text || '';
        if (text.length < 100) { // Увеличиваем минимум до 100 символов
          errors.push('Listening transcript must be at least 100 characters long');
        }
        // Проверяем, что это не просто заголовок
        if (this.isTextJustTitle(text, taskTitle)) {
          errors.push('Listening transcript must be a real dialogue, not just a title or template');
        }
        // Проверяем, что это диалог (содержит реплики разных персонажей)
        const hasDialogueMarkers = /(said|says|asked|replied|answered|:|—|-)/i.test(text);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
        if (!hasDialogueMarkers && sentences.length < 4) {
          errors.push('Listening transcript must be a real dialogue with multiple exchanges');
        }
      }
      if (lesson.exercise.questions.length === 0) {
        errors.push('Listening lesson must have comprehension questions');
      }
    }

    return errors;
  }

  private async invokeAi(
    params: {
      task: TaskRow;
      currentLevel: string;
      targetLevel: string;
      userId: string;
      preGeneratedText?: string | null;
    },
    isRetry: boolean = false
  ) {
    const { task, currentLevel, targetLevel, preGeneratedText } = params;
    const parsedTitle = this.parseTaskTitle(task.title);
    const effectiveLevel = parsedTitle.level || currentLevel;

    const typeSpecificDirective = (() => {
      switch (task.type) {
        case 'listening':
          return preGeneratedText
            ? `Диалог уже сгенерирован и находится в поле "readingPassages[0].text". Используй его как есть. Создай минимум 3-5 вопросов на понимание в exercise.questions на основе этого диалога.`
            : `КРИТИЧНО ВАЖНО: Создай полный диалог для прослушивания. Диалог должен быть естественным разговором между 2-3 персонажами (минимум 5-8 реплик). Тема диалога: "${parsedTitle.topic}". Уровень сложности: ${effectiveLevel}. Диалог должен быть реалистичным и подходящим для подростка. 

ЗАПРЕЩЕНО использовать в поле "text" заголовок задачи, описание или шаблоны типа "Аудирование короткого диалога". Должен быть РЕАЛЬНЫЙ диалог с репликами персонажей, например:
- Person A: "Hello, how are you?"
- Person B: "I'm fine, thanks. And you?"
- Person A: "Great! I'm going to the cinema today."

Включи блок "readingPassages" с полным текстом диалога. Также создай минимум 3-5 вопросов на понимание в exercise.questions.`;
        case 'reading':
          const wordCount = parsedTitle.wordCount || 150;
          return preGeneratedText
            ? `Текст уже сгенерирован и находится в поле "readingPassages[0].text". Используй его как есть. Создай минимум 3-5 вопросов на понимание в exercise.questions на основе этого текста.`
            : `КРИТИЧНО ВАЖНО: Создай цельный текст для чтения. Тема текста: "${parsedTitle.topic}". Уровень сложности: ${effectiveLevel}. Текст должен быть интересным и подходящим для подростка. Минимальная длина: ${wordCount} слов (реально ${wordCount} слов, не меньше!). 

ЗАПРЕЩЕНО использовать в поле "text" заголовок задачи, описание или шаблоны типа "Адаптированный текст A2-B1 (150-200 слов)". Должен быть РЕАЛЬНЫЙ текст с полными предложениями, например:
"Last summer, I went to London with my family. It was my first time visiting England, and I was very excited. We stayed in a small hotel near the city center. Every day, we visited different places..."

Включи блок "readingPassages" с полным текстом. Также создай минимум 3-5 вопросов на понимание в exercise.questions.`;
        case 'vocabulary':
          return 'ВАЖНО: Для уроков vocabulary (Active Recall) НЕ создавай questions в exercise. Вместо этого создай только overview и explanation о методе Active Recall. Карточки будут загружены автоматически из базы данных. Exercise должен содержать только title и steps с инструкциями по работе с карточками.';
        case 'grammar':
          return `КРИТИЧНО ВАЖНО: Тема грамматики: "${parsedTitle.topic}". Уровень: ${effectiveLevel}. Создай ПОДРОБНОЕ грамматическое правило с объяснением КАК ИСПОЛЬЗОВАТЬ эту структуру. Объяснение должно включать минимум 5-7 пунктов, каждый пункт - полное предложение или абзац. Используй жизненные примеры из повседневной жизни подростка: школа, друзья, хобби, игры, литература, соцсети, музыка. Объясняй не только правило, но и КОГДА и ПОЧЕМУ его используют. Добавляй контекст использования и типичные ошибки. Создай минимум 3-5 КОНКРЕТНЫХ примеров предложений в examples (каждый пример должен демонстрировать правило). Создай минимум 3 практических задания в exercise.questions.`;
        default:
          return '';
      }
    })();

    const retryNote = isRetry
      ? '\n\nВАЖНО: Это повторная попытка генерации. Убедись, что все обязательные поля заполнены реальным контентом, а не шаблонами!'
      : '';

    const grammarSpecificNote = 'ВАЖНО: В поле "explanation" НЕ используй нумерацию (1., 2., 3. или 1), 2), 3)). Просто перечисляй пункты описания без цифр и скобок, так как нумерация будет добавлена автоматически в интерфейсе. Каждый пункт должен быть отдельным элементом массива.';

    // Получаем язык инструкций пользователя
    const instructionLanguage = await getUserInstructionLanguage(this.hasyx, params.userId);
    
    const languageNote = instructionLanguage === 'ru' 
      ? 'Все объяснения, инструкции, шаги (explanation, steps, keyPoints) должны быть на русском языке.'
      : `Все объяснения, инструкции, шаги (explanation, steps, keyPoints) должны быть на языке: ${instructionLanguage}.`;

    const basePrompt = [
      `Ты — наставник японских методик (Кайдзен, Кумон, Shu-Ha-Ri, Active Recall).`,
      `Создай учебный мини-урок для подростка, который учит английский.`,
      `Тип задания: ${task.type}. Заголовок: ${task.title}.`,
      languageNote,
      task.description ? `Описание задания: ${task.description}` : '',
      `Текущий уровень ученика: ${currentLevel}. Цель: ${targetLevel}.`,
      typeSpecificDirective,
      grammarSpecificNote,
      retryNote,
      `\nСтруктура JSON (строго соблюдай формат и заполняй ВСЕ поля реальным контентом):`,
      task.type === 'grammar'
        ? `{
  "lesson": {
    "overview": "Короткое описание грамматической темы '${parsedTitle.topic}' (1-2 предложения)",
    "explanation": [
      "ПЕРВЫЙ ПУНКТ: Что это за грамматическая структура и как она формируется (полное предложение с примером)",
      "ВТОРОЙ ПУНКТ: Когда и в каких ситуациях используется эта структура (конкретные примеры из жизни подростка)",
      "ТРЕТИЙ ПУНКТ: Как правильно строить предложения с этой структурой (пошаговое объяснение)",
      "ЧЕТВЕРТЫЙ ПУНКТ: Типичные ошибки и как их избежать (с примерами неправильного и правильного использования)",
      "ПЯТЫЙ ПУНКТ: Дополнительные примеры использования в разных контекстах (школа, друзья, хобби, игры)"
    ],
    "keyPoints": [
      "Ключевой момент 1: основная формула или правило",
      "Ключевой момент 2: когда использовать",
      "Ключевой момент 3: на что обратить внимание"
    ],
    "examples": [
      {
        "prompt": "Пример предложения 1 на английском, демонстрирующий правило",
        "explanation": "Разбор: почему здесь используется именно эта форма, какие элементы важны"
      },
      {
        "prompt": "Пример предложения 2 на английском, демонстрирующий правило",
        "explanation": "Разбор: контекст использования, альтернативные варианты"
      },
      {
        "prompt": "Пример предложения 3 на английском, демонстрирующий правило",
        "explanation": "Разбор: типичная ошибка и правильный вариант"
      }
    ],
    "targetWords": ["ключевые слова, связанные с темой"]
  },
  "exercise": {
    "title": "Практика: применение грамматической структуры",
    "steps": [
      "Прочитай все примеры и объяснения",
      "Составь 3 собственных предложения с этой структурой",
      "Проверь правильность использования структуры"
    ],
    "questions": [
      {
        "prompt": "Составь предложение, используя изученную грамматическую структуру. Тема: [конкретная ситуация]",
        "expectedAnswer": "Пример правильного ответа на английском",
        "hint": "Вспомни формулу из объяснения",
        "evaluationCriteria": ["Правильное использование структуры", "Соответствие теме", "Грамматическая корректность"]
      },
      {
        "prompt": "Исправь ошибку в предложении: [пример с ошибкой]",
        "expectedAnswer": "Исправленный вариант",
        "hint": "Обрати внимание на [конкретный аспект]",
        "evaluationCriteria": ["Правильное исправление", "Понимание правила"]
      },
      {
        "prompt": "Составь предложение о [конкретной теме из жизни подростка]",
        "expectedAnswer": "Пример ответа",
        "hint": "Используй структуру из урока",
        "evaluationCriteria": ["Использование структуры", "Релевантность теме"]
      }
    ]
  }
}`
        : task.type === 'vocabulary'
        ? `{
  "lesson": {
    "overview": "короткое описание метода Active Recall",
    "explanation": ["пункт объяснения метода без нумерации", "еще один пункт о работе с карточками"],
    "keyPoints": ["ключевой пункт"],
    "targetWords": []
  },
  "exercise": {
    "title": "Работа с карточками",
    "steps": ["Возьмите стопку карточек", "На одной стороне слово, на другой - перевод и пример", "Попробуйте вспомнить значение слова", "Проверьте себя, перевернув карточку", "Рассортируйте карточки на выученные и требующие повторения"],
    "questions": []
  }
}`
        : (() => {
          // Для reading/listening используем предгенерированный текст или инструкцию
          const textField = preGeneratedText
            ? JSON.stringify(preGeneratedText).replace(/^"|"$/g, '') // Убираем внешние кавычки, так как они уже в JSON
            : task.type === 'listening'
            ? `Создай диалог на английском языке. Тема: ${parsedTitle.topic}. Уровень: ${effectiveLevel}. Минимум 5-8 реплик между персонажами. Формат: Person A: "реплика", Person B: "реплика".`
            : `Создай текст на английском языке. Тема: ${parsedTitle.topic}. Уровень: ${effectiveLevel}. Минимум ${parsedTitle.wordCount || 150} слов. Текст должен быть интересным для подростка.`;
          
          return `{
  "lesson": {
    "overview": "Короткое описание урока (1-2 предложения о том, что будет изучаться)",
    "explanation": [
      "Первый пункт: что нужно делать и на что обратить внимание",
      "Второй пункт: как работать с материалом",
      "Третий пункт: что важно запомнить"
    ],
    "examples": [
      {
        "prompt": "Пример использования или демонстрация концепции",
        "explanation": "Разбор примера"
      }
    ],
    "readingPassages": [
      {
        "title": "${task.type === 'listening' ? 'Диалог для прослушивания' : 'Текст для чтения'}",
        "text": ${preGeneratedText ? JSON.stringify(preGeneratedText) : `"${textField}"`},
        "targetWords": ["ключевые слова из текста"]
      }
    ],
    "pronunciationScript": "${task.type === 'listening' ? 'IPA транскрипция ключевых слов из диалога' : 'если нужен сценарий произношения'}",
    "targetWords": ["ключевые слова для изучения"]
  },
  "exercise": {
    "title": "Задания на понимание",
    "steps": [
      "${task.type === 'listening' ? 'Прослушай диалог внимательно' : 'Прочитай текст внимательно'}",
      "Ответь на вопросы",
      "Проверь свои ответы"
    ],
    "questions": [
      {
        "prompt": "Вопрос 1 на понимание основного содержания",
        "expectedAnswer": "Правильный ответ или пример ответа",
        "hint": "Подсказка, где найти ответ",
        "evaluationCriteria": ["Правильность ответа", "Понимание содержания"]
      },
      {
        "prompt": "Вопрос 2 на понимание деталей",
        "expectedAnswer": "Правильный ответ",
        "hint": "Подсказка",
        "evaluationCriteria": ["Точность", "Внимательность"]
      },
      {
        "prompt": "Вопрос 3 на понимание контекста или выводы",
        "expectedAnswer": "Правильный ответ",
        "hint": "Подсказка",
        "evaluationCriteria": ["Логичность", "Понимание"]
      }
    ]
  }
}`;
        })(),
      task.type === 'reading' || task.type === 'listening'
        ? preGeneratedText
          ? `\n✅ Текст/диалог уже сгенерирован и находится в поле "readingPassages[0].text". Используй его как есть.`
          : `\n🚨 КРИТИЧНО ВАЖНО 🚨: 
В поле "readingPassages[0].text" ДОЛЖЕН БЫТЬ РЕАЛЬНЫЙ КОНТЕНТ на английском языке:
- Для reading: полный текст минимум ${parsedTitle.wordCount || 150} слов с реальными предложениями
- Для listening: полный диалог с репликами персонажей (минимум 5-8 реплик)

НЕ используй заголовок задачи, описания или шаблоны. Генерируй реальный текст/диалог прямо сейчас.`
        : '',
      '\nВАЖНО: Заполняй ВСЕ поля реальным контентом. Не используй шаблоны типа "пример", "текст (для чтения)" и т.д. Генерируй конкретные примеры, тексты, вопросы и ответы.',
      'Ответ должен быть валидным JSON без комментариев.',
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt = (() => {
      switch (task.type) {
        case 'grammar':
          return 'Ты — опытный методист английского, создающий структурированные уроки с заданиями и примерами. Для грамматических тем ОБЯЗАТЕЛЬНО создавай ПОДРОБНЫЕ и РАЗВЕРНУТЫЕ объяснения (минимум 5-7 пунктов). Каждый пункт должен быть полным и информативным. Используй жизненные примеры из повседневной жизни подростка (школа, друзья, хобби, игры, литература, соцсети, музыка). Объясняй не только правило, но и когда и почему его используют, добавляй контекст и типичные ошибки. ВСЕГДА генерируй реальные примеры предложений, а не шаблоны.';
        case 'reading':
          return 'Ты — опытный методист английского, создающий тексты для чтения. ВСЕГДА создавай полные, цельные тексты указанной длины. Тексты должны быть интересными, подходящими для подростка и соответствовать указанному уровню сложности. НЕ используй шаблоны или описания - создавай реальный текст.';
        case 'listening':
          return 'Ты — опытный методист английского, создающий диалоги для прослушивания. ВСЕГДА создавай полные диалоги с реальными репликами между персонажами. Диалоги должны быть естественными, подходящими для подростка и соответствовать указанному уровню сложности. НЕ используй шаблоны - создавай реальный диалог.';
        default:
          return 'Ты — опытный методист английского, создающий структурированные уроки с заданиями и примерами. ВСЕГДА генерируй реальный контент, а не шаблоны или описания.';
      }
    })();

    return await generateJSON<any>(basePrompt, {
      maxTokens: 3000, // Увеличиваем лимит для более подробных уроков
      systemPrompt,
    });
  }

  private normalizeLesson(
    aiPayload: any,
    params: { task: TaskRow; currentLevel: string; targetLevel: string }
  ): LessonMaterials {
    const lesson = aiPayload?.lesson ?? {};
    const exercise = aiPayload?.exercise ?? {};

    const safeArray = <T>(value: any): T[] => (Array.isArray(value) ? value : []);

    const readingPassagesRaw = safeArray<{ title: string; text: string; targetWords: string[] }>(
      lesson.readingPassages
    ).slice(0, 2);
    const ensuredReadingPassages = this.ensureReadingPassages(
      readingPassagesRaw,
      params.task.type,
      params.task.description ?? '',
      params.task.title
    ).map(passage => ({
      ...passage,
      // Убираем маркер fallback из текста перед показом
      text: passage.text?.replace(/\[FALLBACK_MESSAGE\]\s*/gi, '').trim() || passage.text,
    }));

    // Убираем нумерацию из explanation (1., 2., 3. или 1), 2), 3) и т.д.)
    const cleanExplanation = safeArray<string>(lesson.explanation)
      .map((item) => {
        // Убираем нумерацию в начале строки: "1. ", "2. ", "1) ", "2) " и т.д.
        return item.replace(/^\d+[\.\)]\s+/, '').trim();
      })
      .filter((item) => Boolean(item) && item.length > 0)
      .slice(0, 8);

    // Если explanation пустой, используем fallback
    // Для грамматических уроков особенно важно иметь объяснение
    let finalExplanation = cleanExplanation;
    if (finalExplanation.length === 0) {
      console.warn('[LessonContentService] Empty explanation, using fallback for task type:', params.task.type);
      // Для грамматических уроков создаем подробное объяснение
      if (params.task.type === 'grammar') {
        finalExplanation = [
          'Изучи грамматическое правило, которое описывает эту структуру.',
          'Обрати внимание на форму и порядок слов в предложении.',
          'Посмотри на примеры использования этой структуры в разных контекстах.',
          'Попробуй понять, когда и почему используется именно такая форма.',
          'Составь собственные примеры, используя изученную структуру.',
          'Проверь правильность использования структуры в своих предложениях.',
        ];
      } else {
        // Для других типов уроков используем базовый fallback
        const fallbackLesson = this.buildEnhancedFallbackLesson(params);
        finalExplanation = fallbackLesson.explanation;
      }
    }
    
    // Дополнительная проверка: если после всех проверок explanation все еще пустой, принудительно добавляем fallback
    if (finalExplanation.length === 0) {
      console.error('[LessonContentService] Explanation still empty after fallback, forcing default');
      finalExplanation = params.task.type === 'grammar' 
        ? [
            'Изучи грамматическое правило, которое описывает эту структуру.',
            'Обрати внимание на форму и порядок слов в предложении.',
            'Посмотри на примеры использования этой структуры в разных контекстах.',
            'Попробуй понять, когда и почему используется именно такая форма.',
            'Составь собственные примеры, используя изученную структуру.',
            'Проверь правильность использования структуры в своих предложениях.',
          ]
        : ['Прочитай правило или описание темы.', 'Обрати внимание на примеры.', 'Попробуй составить собственные предложения.'];
    }

    return {
      overview: lesson.overview || `Разберём тему: ${params.task.title}`,
      explanation: finalExplanation,
      keyPoints: (() => {
        const keyPoints = safeArray<string>(lesson.keyPoints);
        if (keyPoints.length === 0) {
          const fallbackLesson = this.buildEnhancedFallbackLesson(params);
          return fallbackLesson.keyPoints;
        }
        return keyPoints;
      })().slice(0, 8),
      examples: safeArray(lesson.examples)
        .map((item: any) => ({
          prompt: item?.prompt ?? '',
          explanation: item?.explanation ?? '',
        }))
        .filter((item) => item.prompt && item.explanation)
        .slice(0, 5),
      readingPassages: ensuredReadingPassages,
      pronunciationScript:
        typeof lesson.pronunciationScript === 'string' ? lesson.pronunciationScript : null,
      targetWords: safeArray<string>(lesson.targetWords).slice(0, 10),
      requiresPronunciation:
        !!lesson.pronunciationScript ||
        safeArray(lesson.readingPassages).length > 0 ||
        ['reading', 'listening', 'speaking'].includes(params.task.type),
      exercise: {
        title: exercise.title || 'Практика по теме',
        steps: safeArray<string>(exercise.steps).slice(0, 8),
        questions: safeArray(exercise.questions)
          .map((question: any) => ({
            prompt: question?.prompt ?? '',
            expectedAnswer: question?.expectedAnswer ?? '',
            hint: question?.hint ?? null,
            evaluationCriteria: safeArray<string>(question?.evaluationCriteria).slice(0, 5),
          }))
          .filter((question) => question.prompt && question.expectedAnswer)
          .slice(0, 8),
      },
      meta: {
        generatedAt: new Date().toISOString(),
        level: params.currentLevel,
        targetLevel: params.targetLevel,
        taskType: params.task.type,
      },
    };
  }

  /**
   * Создает улучшенный fallback урок с попыткой использовать существующий контент
   */
  private buildEnhancedFallbackLesson(
    params: {
      task: TaskRow;
      currentLevel: string;
      targetLevel: string;
    },
    partialLesson?: LessonMaterials
  ): LessonMaterials {
    const { task } = params;
    const parsedTitle = this.parseTaskTitle(task.title);

    // Используем частично сгенерированный контент, если он есть
    const baseOverview = partialLesson?.overview || `Разбираем тему "${parsedTitle.topic}" на уровне ${params.currentLevel}.`;
    const baseExplanation = partialLesson?.explanation && partialLesson.explanation.length > 0
      ? partialLesson.explanation
      : this.getDefaultExplanation(task.type, parsedTitle.topic);

    const baseExamples = partialLesson?.examples && partialLesson.examples.length > 0
      ? partialLesson.examples
      : this.getDefaultExamples(task.type, parsedTitle.topic);

    const baseQuestions = partialLesson?.exercise.questions && partialLesson.exercise.questions.length > 0
      ? partialLesson.exercise.questions
      : this.getDefaultQuestions(task.type, parsedTitle.topic);

    const baseReadingPassages = partialLesson?.readingPassages && partialLesson.readingPassages.length > 0
      ? partialLesson.readingPassages
      : this.getDefaultReadingPassages(task.type, parsedTitle.topic, task.description, task.title);

    return {
      overview: baseOverview,
      explanation: baseExplanation,
      keyPoints: partialLesson?.keyPoints && partialLesson.keyPoints.length > 0
        ? partialLesson.keyPoints
        : ['Изучи материал внимательно', 'Обрати внимание на примеры', 'Применяй на практике'],
      examples: baseExamples,
      readingPassages: baseReadingPassages,
      pronunciationScript: partialLesson?.pronunciationScript || null,
      targetWords: partialLesson?.targetWords || [],
      requiresPronunciation: task.type === 'listening' || task.type === 'speaking',
      exercise: {
        title: partialLesson?.exercise.title || 'Практика по теме',
        steps: partialLesson?.exercise.steps && partialLesson.exercise.steps.length > 0
          ? partialLesson.exercise.steps
          : ['Изучи материал', 'Выполни задания', 'Проверь результаты'],
        questions: baseQuestions,
      },
      meta: {
        generatedAt: new Date().toISOString(),
        level: params.currentLevel,
        targetLevel: params.targetLevel,
        taskType: task.type,
      },
    };
  }

  private getDefaultExplanation(taskType: string, topic: string): string[] {
    if (taskType === 'grammar') {
      return [
        `Изучи грамматическую структуру "${topic}".`,
        'Обрати внимание на форму и порядок слов в предложении.',
        'Посмотри на примеры использования этой структуры в разных контекстах.',
        'Попробуй понять, когда и почему используется именно такая форма.',
        'Составь собственные примеры, используя изученную структуру.',
        'Проверь правильность использования структуры в своих предложениях.',
      ];
    }
    return [
      'Изучи материал по теме.',
      'Обрати внимание на ключевые моменты.',
      'Попробуй применить изученное на практике.',
    ];
  }

  private getDefaultExamples(taskType: string, topic: string): LessonExample[] {
    if (taskType === 'grammar') {
      return [
        {
          prompt: `Example sentence demonstrating "${topic}"`,
          explanation: 'Это пример использования грамматической структуры.',
        },
        {
          prompt: `Another example with "${topic}"`,
          explanation: 'Обрати внимание на форму и контекст.',
        },
      ];
    }
    return [];
  }

  private getDefaultQuestions(taskType: string, topic: string): LessonQuestion[] {
    if (taskType === 'grammar') {
      return [
        {
          prompt: `Составь предложение, используя "${topic}"`,
          expectedAnswer: 'Пример правильного ответа',
          hint: 'Вспомни правило из объяснения',
          evaluationCriteria: ['Правильность использования', 'Грамматическая корректность'],
        },
        {
          prompt: 'Составь еще одно предложение на эту тему',
          expectedAnswer: 'Пример ответа',
          hint: 'Используй изученную структуру',
          evaluationCriteria: ['Применение правила'],
        },
      ];
    }
    if (taskType === 'listening' || taskType === 'reading') {
      return [
        {
          prompt: 'Что является основной темой текста?',
          expectedAnswer: 'Основная тема текста',
          hint: 'Обрати внимание на ключевые слова',
          evaluationCriteria: ['Понимание содержания'],
        },
        {
          prompt: 'Какие детали ты запомнил?',
          expectedAnswer: 'Важные детали из текста',
          hint: 'Вспомни конкретные факты',
          evaluationCriteria: ['Внимательность', 'Понимание'],
        },
      ];
    }
    return [];
  }

  private getDefaultReadingPassages(
    taskType: string,
    topic: string,
    description?: string | null,
    taskTitle?: string
  ): Array<{ title?: string; text?: string; targetWords?: string[] }> {
    if (taskType === 'reading' || taskType === 'listening') {
      // Не используем description если он похож на заголовок
      let fallbackText = description?.trim() || '';
      if (fallbackText && taskTitle && this.isTextJustTitle(fallbackText, taskTitle)) {
        fallbackText = '';
      }
      
      // Если description не подходит, создаем информативное сообщение
      // ВАЖНО: используем специальный маркер, чтобы система не пыталась извлекать слова из этого текста
      if (!fallbackText || fallbackText.length < 50) {
        fallbackText = taskType === 'reading'
          ? `[FALLBACK_MESSAGE] Контент для урока "${topic}" временно недоступен. Пожалуйста, попробуй позже или обратись к преподавателю.`
          : `[FALLBACK_MESSAGE] Диалог для урока "${topic}" временно недоступен. Пожалуйста, попробуй позже или обратись к преподавателю.`;
      }
      
      return [
        {
          title: taskType === 'reading' ? 'Текст для чтения' : 'Диалог для прослушивания',
          text: fallbackText,
          targetWords: [],
        },
      ];
    }
    return [];
  }

  private ensureReadingPassages(
    passages: Array<{ title?: string; text?: string; targetWords?: string[] }>,
    taskType: string,
    taskDescription?: string | null,
    taskTitle?: string
  ) {
    if (
      (taskType === 'reading' || taskType === 'listening') &&
      (passages.length === 0 || !passages[0]?.text)
    ) {
      // Не используем description если он похож на заголовок
      let fallbackText = taskDescription?.trim() || '';
      if (fallbackText && taskTitle && this.isTextJustTitle(fallbackText, taskTitle)) {
        fallbackText = '';
      }
      
      if (!fallbackText || fallbackText.length < 50) {
        fallbackText = taskType === 'reading'
          ? 'Контент временно недоступен. Используй тему и ключевые слова урока, чтобы составить короткий текст самостоятельно.'
          : 'Контент временно недоступен. Используй тему урока, чтобы составить короткий диалог самостоятельно.';
      }
      
      return [
        {
          title: taskType === 'reading' ? 'Reading passage' : 'Listening transcript',
          text: fallbackText,
          targetWords: [],
        },
      ];
    }
    
    // Проверяем, что существующий текст не является просто заголовком
    if (passages.length > 0 && passages[0]?.text && taskTitle) {
      const text = passages[0].text;
      if (this.isTextJustTitle(text, taskTitle)) {
        // Текст является заголовком - заменяем на fallback
        const fallbackText = taskType === 'reading'
          ? 'Контент временно недоступен. Используй тему и ключевые слова урока, чтобы составить короткий текст самостоятельно.'
          : 'Контент временно недоступен. Используй тему урока, чтобы составить короткий диалог самостоятельно.';
        return [
          {
            ...passages[0],
            text: fallbackText,
          },
        ];
      }
    }
    
    return passages;
  }
}


