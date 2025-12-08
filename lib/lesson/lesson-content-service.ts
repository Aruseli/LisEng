import { Hasyx } from 'hasyx';

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
    const payload = await this.invokeAi(params).catch((error) => {
      console.warn('[LessonContentService] AI generation failed, using fallback:', error);
      return this.buildFallbackLesson(params);
    });

    const lesson = this.normalizeLesson(payload, params);
    return lesson;
  }

  private async invokeAi(params: {
    task: TaskRow;
    currentLevel: string;
    targetLevel: string;
    userId: string;
  }) {
    const { task, currentLevel, targetLevel } = params;
    const typeSpecificDirective = (() => {
      switch (task.type) {
        case 'listening':
          return 'Обязательно включи блок "readingPassages" с полным текстом диалога (5-8 реплик), чтобы пользователь мог видеть транскрипт.';
        case 'reading':
          return 'Обязательно создай блок "readingPassages" с цельным текстом (минимум 120-150 слов) по теме урока.';
        case 'vocabulary':
          return 'ВАЖНО: Для уроков vocabulary (Active Recall) НЕ создавай questions в exercise. Вместо этого создай только overview и explanation о методе Active Recall. Карточки будут загружены автоматически из базы данных. Exercise должен содержать только title и steps с инструкциями по работе с карточками.';
        case 'grammar':
          return 'Для грамматических тем создавай ПОДРОБНЫЕ и РАЗВЕРНУТЫЕ объяснения (минимум 5-7 пунктов в explanation). Каждый пункт должен быть полным предложением или небольшим абзацем. Используй жизненные примеры из повседневной жизни подростка: школа, друзья, хобби, мобильные и настольные игры, литература, социальные сети, современная музыка. Объясняй не только правило, но и когда и почему его используют. Добавляй контекст использования и типичные ошибки.';
        default:
          return '';
      }
    })();

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
      `Структура JSON (строго соблюдай формат):`,
      task.type === 'grammar'
        ? `{
  "lesson": {
    "overview": "короткое описание урока",
    "explanation": ["первый пункт подробного объяснения без нумерации (минимум 5-7 пунктов)", "второй пункт с жизненными примерами", "третий пункт о контексте использования", "четвертый пункт о типичных ошибках", "пятый пункт с дополнительными примерами"],
    "keyPoints": ["ключевой пункт"],
    "examples": [
      { "prompt": "пример", "explanation": "разбор" }
    ],
    "targetWords": ["слово1", "слово2"]
  },
  "exercise": {
    "title": "название задания",
    "steps": ["шаг 1", "шаг 2"],
    "questions": [
      {
        "prompt": "вопрос/упражнение",
        "expectedAnswer": "пример ответа",
        "hint": "подсказка",
        "evaluationCriteria": ["критерий"]
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
        : `{
  "lesson": {
    "overview": "короткое описание урока",
    "explanation": ["пункт объяснения без нумерации", "еще один пункт без нумерации"],
    "examples": [
      { "prompt": "пример", "explanation": "разбор" }
    ],
    "readingPassages": [
      {
        "title": "название",
        "text": "текст (для чтения)",
        "targetWords": ["слово1", "слово2"]
      }
    ],
    "pronunciationScript": "если нужен сценарий произношения",
    "targetWords": ["слово1", "слово2"]
  },
  "exercise": {
    "title": "название задания",
    "steps": ["шаг 1", "шаг 2"],
    "questions": [
      {
        "prompt": "вопрос/упражнение",
        "expectedAnswer": "пример ответа",
        "hint": "подсказка",
        "evaluationCriteria": ["критерий"]
      }
    ]
  }
}`,
      task.type === 'reading' || task.type === 'listening'
        ? 'Обязательно добавь блок чтения/pronunciationScript и targetWords.'
        : '',
      'Ответ должен быть валидным JSON без комментариев.',
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt = task.type === 'grammar'
      ? 'Ты — опытный методист английского, создающий структурированные уроки с заданиями и примерами. Для грамматических тем ОБЯЗАТЕЛЬНО создавай ПОДРОБНЫЕ и РАЗВЕРНУТЫЕ объяснения (минимум 5-7 пунктов). Каждый пункт должен быть полным и информативным. Используй жизненные примеры из повседневной жизни подростка (школа, друзья, хобби, игры, литература, соцсети, музыка). Объясняй не только правило, но и когда и почему его используют, добавляй контекст и типичные ошибки.'
      : 'Ты — опытный методист английского, создающий структурированные уроки с заданиями и примерами.';

    return await generateJSON<any>(basePrompt, {
      maxTokens: 2000,
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
      params.task.description ?? ''
    );

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
        const fallbackLesson = this.buildFallbackLesson(params);
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
          const fallbackLesson = this.buildFallbackLesson(params);
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

  private buildFallbackLesson(params: {
    task: TaskRow;
    currentLevel: string;
    targetLevel: string;
  }): LessonMaterials {
    const { task } = params;
    return {
      overview: `Разбираем тему "${task.title}" на уровне ${params.currentLevel}.`,
      explanation: [
        'Прочитай правило или описание темы.',
        'Обрати внимание на примеры.',
        'Попробуй составить собственные предложения.',
      ],
      keyPoints: ['Повтори основу правила', 'Собери 2-3 примера', 'Применяй в речи и письме'],
      examples: [
        {
          prompt: 'Example sentence with the target structure.',
          explanation: 'Объяснение того, почему используется именно такая форма.',
        },
      ],
      exercise: {
        title: 'Применяем тему на практике',
        steps: [
          'Составь 3 предложения с новой структурой.',
          'Перепроверь грамматику и лексику.',
        ],
        questions: [
          {
            prompt: 'Напиши предложение с темой урока.',
            expectedAnswer: 'Собственное предложение ученика.',
            hint: 'Вспомни пример из объяснения.',
          },
        ],
      },
      meta: {
        generatedAt: new Date().toISOString(),
        level: params.currentLevel,
        targetLevel: params.targetLevel,
        taskType: task.type,
      },
    };
  }

  private ensureReadingPassages(
    passages: Array<{ title?: string; text?: string; targetWords?: string[] }>,
    taskType: string,
    taskDescription?: string | null
  ) {
    if (
      (taskType === 'reading' || taskType === 'listening') &&
      (passages.length === 0 || !passages[0]?.text)
    ) {
      const fallbackText =
        taskDescription?.trim() ||
        'Контент временно недоступен. Используй тему и ключевые слова урока, чтобы составить короткий текст самостоятельно.';
      return [
        {
          title: taskType === 'reading' ? 'Reading passage' : 'Listening transcript',
          text: fallbackText,
          targetWords: [],
        },
      ];
    }
    return passages;
  }
}


