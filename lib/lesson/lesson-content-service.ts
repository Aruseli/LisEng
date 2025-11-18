import { Hasyx } from 'hasyx';

import { generateJSON } from '@/lib/ai/llm';
import { getUserProfile, updateDailyTaskMetadata } from '@/lib/hasura-queries';

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
    title: string;
    text: string;
    targetWords: string[];
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
  }) {
    const { task, currentLevel, targetLevel } = params;
    const basePrompt = [
      `Ты — наставник японских методик (Кайдзен, Кумон, Shu-Ha-Ri, Active Recall).`,
      `Создай учебный мини-урок для подростка, который учит английский.`,
      `Тип задания: ${task.type}. Заголовок: ${task.title}.`,
      task.description ? `Описание задания: ${task.description}` : '',
      `Текущий уровень ученика: ${currentLevel}. Цель: ${targetLevel}.`,
      `Структура JSON (строго соблюдай формат):`,
      `{
  "lesson": {
    "overview": "короткое описание урока",
    "explanation": ["пошаговое объяснение темы"],
    "keyPoints": ["ключевой пункт"],
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

    return await generateJSON<any>(basePrompt, {
      maxTokens: 2000,
      systemPrompt:
        'Ты — опытный методист английского, создающий структурированные уроки с заданиями и примерами.',
    });
  }

  private normalizeLesson(
    aiPayload: any,
    params: { task: TaskRow; currentLevel: string; targetLevel: string }
  ): LessonMaterials {
    const lesson = aiPayload?.lesson ?? {};
    const exercise = aiPayload?.exercise ?? {};

    const safeArray = <T>(value: any): T[] => (Array.isArray(value) ? value : []);

    return {
      overview: lesson.overview || `Разберём тему: ${params.task.title}`,
      explanation: safeArray<string>(lesson.explanation).slice(0, 8),
      keyPoints: safeArray<string>(lesson.keyPoints).slice(0, 8),
      examples: safeArray(lesson.examples)
        .map((item: any) => ({
          prompt: item?.prompt ?? '',
          explanation: item?.explanation ?? '',
        }))
        .filter((item) => item.prompt && item.explanation)
        .slice(0, 5),
      readingPassages: safeArray<{ title: string; text: string; targetWords: string[] }>(
        lesson.readingPassages
      ).slice(0, 2),
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
        '1. Прочитай правило или описание темы.',
        '2. Обрати внимание на примеры.',
        '3. Попробуй составить собственные предложения.',
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
}


