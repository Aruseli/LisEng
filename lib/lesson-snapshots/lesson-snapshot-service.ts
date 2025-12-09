import getAI, { parseJSONResponse } from '@/lib/ai/llm';
import { Hasyx } from 'hasyx';
import { calculateSM2, getQualityScore, initializeSM2 } from './sm2-algorithm';

interface ErrorAnalysisResult {
  errors: Array<{
    mistake: string;
    context: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  hesitations: Array<{
    content: string;
    context: string;
  }>;
}

interface UnknownWordExtraction {
  unknown_words: Array<{
    word: string;
    form?: string;
    contextSentence?: string;
    contextParagraph?: "string";
    frequency?: number;
    user_confidence?: string;
  }>;
}

export interface ProblemArea {
  type: 'error' | 'struggle' | 'hesitation' | 'unknown_word';
  content: string;
  context: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface LessonSnapshotData {
  userId: string;
  sessionId?: string;
  taskId?: string;
  lessonType: string;
  durationSeconds?: number;
  contentSnapshot: {
    originalContent?: any;
    userResponses?: any[];
    aiFeedback?: any;
    interactionLog?: any[];
  };
  userResponses?: any[];
  correctAnswers?: any[];
  performanceScore?: number;
}

export interface KaizenMetrics {
  accuracyDelta?: number;
  speedDelta?: number;
  confidenceDelta?: number;
  mistakesReduced?: number;
}

export class LessonSnapshotService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Создать слепок урока после завершения задания
   */
  async createSnapshot(data: LessonSnapshotData): Promise<string> {
    // 1. Извлечение проблемных мест (только проблемных!)
    const problemAreas = await this.extractProblemAreas(data);

    // 2. Кайдзен анализ (сравнение с предыдущей версией, если есть)
    const kaizenMetrics = await this.calculateKaizenMetrics(data);

    // 3. Определение mastery level
    const masteryLevel = this.determineMasteryLevel(data.performanceScore || 0);

    // 4. Создание слепка
    const snapshot = await this.hasyx.insert({
      table: 'lesson_snapshots',
      object: {
        user_id: data.userId,
        session_id: data.sessionId || null,
        task_id: data.taskId || null,
        lesson_type: data.lessonType,
        lesson_date: new Date().toISOString(),
        duration_seconds: data.durationSeconds || null,
        content_snapshot: data.contentSnapshot,
        problem_areas: problemAreas,
        kaizen_metrics: kaizenMetrics,
        performance_score: data.performanceScore || null,
        mastery_level: masteryLevel,
        methodology_tags: [],
        version: 1,
        is_improvement: false,
      },
      returning: ['id'],
    });

    const snapshotId = Array.isArray(snapshot) ? snapshot[0]?.id : snapshot?.id;
    if (!snapshotId) {
      throw new Error('Failed to create lesson snapshot');
    }

    // 5. Обновление Kumon прогресса
    await this.updateKumonProgress(data, snapshotId, problemAreas);

    // 6. Создание Active Recall сессий для незнакомых слов и ошибок
    await this.createActiveRecallSessions(data, snapshotId, problemAreas);

    // 7. Извлечение незнакомых слов
    await this.extractUnknownWords(data, snapshotId);

    return snapshotId;
  }

  /**
   * Извлечение проблемных мест из ответов пользователя
   */
  private async extractProblemAreas(data: LessonSnapshotData): Promise<ProblemArea[]> {
    const problemAreas: ProblemArea[] = [];

    if (!data.userResponses || !data.correctAnswers) {
      return problemAreas;
    }

    // Анализ ошибок через AI
    try {
      // Получаем язык инструкций пользователя
      let instructionLanguage = 'ru';
      try {
        const { getUserInstructionLanguage } = await import('@/lib/hasura-queries');
        instructionLanguage = await getUserInstructionLanguage(this.hasyx, data.userId);
      } catch (error) {
        console.warn('[LessonSnapshotService] Failed to get instruction language');
      }

      const ai = getAI();
      const prompt = `
        Analyze the following user responses and correct answers for errors and hesitations.
        User Responses: ${JSON.stringify(data.userResponses)}
        Correct Answers: ${JSON.stringify(data.correctAnswers)}
        Lesson Type: ${data.lessonType}
        IMPORTANT: All error descriptions, context explanations, and hesitation notes must be in ${instructionLanguage === 'ru' ? 'Russian' : instructionLanguage} language.
        Please return a JSON object with 'errors' and 'hesitations' arrays.
        Each error should have 'mistake', 'context', 'severity', and 'timestamp'.
        Each hesitation should have 'content', 'context', and 'timestamp'.
      `;
      const response = await ai.query({ role: 'user', content: prompt });

      if (!response) {
        console.error('[LessonSnapshotService] Empty AI analysis response for prompt:', prompt.substring(0, 300));
        throw new Error('AI returned an empty analysis');
      }

      const analysis = await parseJSONResponse<ErrorAnalysisResult>(response);

      // Преобразуем анализ в problem_areas
      for (const error of analysis.errors || []) {
        problemAreas.push({
          type: 'error',
          content: error.mistake || '',
          context: error.context || '',
          severity: error.severity || 'medium',
          timestamp: new Date().toISOString(),
        });
      }

      // Добавляем места нерешительности
      for (const hesitation of analysis.hesitations || []) {
        problemAreas.push({
          type: 'hesitation',
          content: hesitation.content || '',
          context: hesitation.context || '',
          severity: 'low',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error extracting problem areas:', error);
      // Fallback: простая проверка совпадений
      if (data.userResponses && data.correctAnswers) {
        for (let i = 0; i < Math.min(data.userResponses.length, data.correctAnswers.length); i++) {
          if (data.userResponses[i] !== data.correctAnswers[i]) {
            problemAreas.push({
              type: 'error',
              content: String(data.userResponses[i]),
              context: `Response ${i + 1}`,
              severity: 'medium',
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
    }

    return problemAreas;
  }

  /**
   * Расчет метрик Кайдзен (сравнение с предыдущей версией)
   */
  private async calculateKaizenMetrics(data: LessonSnapshotData): Promise<KaizenMetrics | null> {
    if (!data.taskId) {
      return null;
    }

    // Найти предыдущий слепок для этого задания
    const previousSnapshots = await this.hasyx.select({
      table: 'lesson_snapshots',
      where: {
        task_id: { _eq: data.taskId },
        user_id: { _eq: data.userId },
      },
      order_by: [{ version: 'desc' }],
      limit: 1,
      returning: ['performance_score', 'duration_seconds', 'kaizen_metrics'],
    });

    const previous = Array.isArray(previousSnapshots) ? previousSnapshots[0] : previousSnapshots;
    if (!previous) {
      return null; // Первая версия, нет сравнения
    }

    const currentScore = data.performanceScore || 0;
    const previousScore = previous.performance_score || 0;
    const accuracyDelta = currentScore - previousScore;

    const currentDuration = data.durationSeconds || 0;
    const previousDuration = previous.duration_seconds || 0;
    const speedDelta = previousDuration - currentDuration; // Положительное = быстрее

    // Подсчет исправленных ошибок
    const previousProblems = (previous.kaizen_metrics as any)?.mistakesCount || 0;
    const currentProblems = data.userResponses?.length || 0;
    const mistakesReduced = Math.max(0, previousProblems - currentProblems);

    return {
      accuracyDelta,
      speedDelta,
      mistakesReduced,
    };
  }

  /**
   * Определение уровня мастерства
   */
  private determineMasteryLevel(performanceScore: number): string {
    if (performanceScore >= 0.9) return 'mastered';
    if (performanceScore >= 0.75) return 'proficient';
    if (performanceScore >= 0.6) return 'developing';
    return 'beginner';
  }

  /**
   * Обновление прогресса Кумон
   */
  private async updateKumonProgress(
    data: LessonSnapshotData,
    snapshotId: string,
    problemAreas: ProblemArea[]
  ): Promise<void> {
    // Извлекаем навыки из problem_areas и lesson_type
    const skills = this.extractSkills(data, problemAreas);

    for (const skill of skills) {
      // Найти или создать прогресс Кумон для навыка
      const existing = await this.hasyx.select({
        table: 'kumon_progress',
        where: {
          user_id: { _eq: data.userId },
          skill_category: { _eq: skill.category },
          skill_subcategory: { _eq: skill.subcategory || null },
        },
        returning: ['id', 'current_level', 'consecutive_correct', 'accuracy_rate'],
        limit: 1,
      });

      const progress = Array.isArray(existing) ? existing[0] : existing;

      if (progress) {
        // Обновить существующий прогресс
        const wasCorrect = skill.wasCorrect;
        let newConsecutive = progress.consecutive_correct || 0;
        const masteryThreshold = 3; // Можно получить из OPTIONS

        let newLevel = progress.current_level || 1;
        let newStatus = 'practicing';

        if (wasCorrect) {
          newConsecutive++;
          if (newConsecutive >= masteryThreshold && newLevel < 7) {
            newLevel++;
            newConsecutive = 0;
            newStatus = 'ready_for_next';
          }
        } else {
          newConsecutive = 0;
          if (newLevel > 1) {
            newLevel--;
          }
        }

        await this.hasyx.update({
          table: 'kumon_progress',
          pk_columns: { id: progress.id },
          _set: {
            current_level: newLevel,
            consecutive_correct: newConsecutive,
            last_practiced_snapshot_id: snapshotId,
            last_practiced_at: new Date().toISOString(),
            status: newStatus,
            session_id: data.sessionId || null,
          },
        });
      } else {
        // Создать новый прогресс
        await this.hasyx.insert({
          table: 'kumon_progress',
          object: {
            user_id: data.userId,
            skill_category: skill.category,
            skill_subcategory: skill.subcategory || null,
            current_level: 1,
            consecutive_correct: skill.wasCorrect ? 1 : 0,
            last_practiced_snapshot_id: snapshotId,
            last_practiced_at: new Date().toISOString(),
            session_id: data.sessionId || null,
            status: 'practicing',
          },
        });
      }
    }
  }

  /**
   * Создание Active Recall сессий
   */
  private async createActiveRecallSessions(
    data: LessonSnapshotData,
    snapshotId: string,
    problemAreas: ProblemArea[]
  ): Promise<void> {
    // Для незнакомых слов
    const unknownWords = problemAreas.filter((p) => p.type === 'unknown_word');
    for (const word of unknownWords) {
      // Создать Active Recall сессию
      const sm2Params = initializeSM2();
      const sm2Result = calculateSM2({ ...sm2Params, quality: 0 }); // Начинаем с качества 0

      await this.hasyx.insert({
        table: 'active_recall_sessions',
        object: {
          user_id: data.userId,
          lesson_snapshot_id: snapshotId,
          recall_type: 'vocabulary',
          recall_item_type: 'vocabulary_card',
          context_prompt: `Вспомни слово, которое означает "${word.content}"`,
          correct_response: word.content,
          quality: 0,
          ease_factor: sm2Result.easeFactor,
          interval_days: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          recall_attempts: 1,
          recall_success: false,
        },
      });
    }

    // Для ошибок (создаем recall с правильными ответами)
    const errors = problemAreas.filter((p) => p.type === 'error');
    for (const error of errors) {
      const sm2Params = initializeSM2();
      const sm2Result = calculateSM2({ ...sm2Params, quality: 1 }); // Начинаем с качества 1 (ошибка)

      await this.hasyx.insert({
        table: 'active_recall_sessions',
        object: {
          user_id: data.userId,
          lesson_snapshot_id: snapshotId,
          recall_type: 'grammar_rule',
          recall_item_type: 'error_pattern',
          context_prompt: `Правильный вариант: "${error.context}"`,
          correct_response: error.context,
          quality: 1,
          ease_factor: sm2Result.easeFactor,
          interval_days: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          recall_attempts: 1,
          recall_success: false,
        },
      });
    }
  }

  /**
   * Извлечение незнакомых слов из текста
   */
  private async extractUnknownWords(
    data: LessonSnapshotData,
    snapshotId: string
  ): Promise<void> {
    if (data.lessonType !== 'reading' && data.lessonType !== 'listening') {
      return; // Только для чтения и аудирования
    }

    try {
      // Получаем язык инструкций пользователя
      let instructionLanguage = 'ru';
      try {
        const { getUserInstructionLanguage } = await import('@/lib/hasura-queries');
        instructionLanguage = await getUserInstructionLanguage(this.hasyx, data.userId);
      } catch (error) {
        console.warn('[LessonSnapshotService] Failed to get instruction language');
      }

      const ai = getAI();
      const prompt = `
        Extract unknown words from the following text.
        Text: ${data.contentSnapshot.originalContent?.text || ''}
        User ID: ${data.userId}
        IMPORTANT: All descriptions and context explanations must be in ${instructionLanguage === 'ru' ? 'Russian' : instructionLanguage} language.
        Please return a JSON object with an 'unknown_words' array.
        Each word should have 'word', 'form', 'contextSentence', 'contextParagraph', 'frequency', and 'user_confidence'.
      `;
      const response = await ai.query({ role: 'user', content: prompt });

      if (!response) {
        console.error('[LessonSnapshotService] Empty AI word extraction response for prompt:', prompt.substring(0, 300));
        throw new Error('AI returned an empty response for word extraction');
      }

      const extraction = await parseJSONResponse<UnknownWordExtraction>(response);

      if (!extraction || !Array.isArray(extraction.unknown_words)) {
        throw new Error('AI did not return an array of unknown words');
      }

      for (const word of extraction.unknown_words) {
        await this.hasyx.insert({
          table: 'lesson_vocabulary_extractions',
          object: {
            lesson_snapshot_id: snapshotId,
            word: word.word,
            word_form: word.form || null,
            context_sentence: word.contextSentence || null,
            context_paragraph: word.contextParagraph || null,
            frequency_in_lesson: word.frequency || 1,
            user_confidence: 'unknown',
            active_recall_context: word.contextSentence || null,
          },
        });
      }
    } catch (error) {
      console.error('Error extracting unknown words:', error);
    }
  }

  /**
   * Извлечение навыков из данных урока
   */
  private extractSkills(
    data: LessonSnapshotData,
    problemAreas: ProblemArea[]
  ): Array<{ category: string; subcategory?: string; wasCorrect: boolean }> {
    const skills: Array<{ category: string; subcategory?: string; wasCorrect: boolean }> = [];

    // Основной навык из типа урока
    skills.push({
      category: data.lessonType,
      wasCorrect: (data.performanceScore || 0) >= 0.7,
    });

    // Навыки из проблемных мест
    for (const problem of problemAreas) {
      if (problem.type === 'error') {
        // Попытаться определить категорию ошибки
        const category = this.categorizeError(problem.content);
        skills.push({
          category: category.main,
          subcategory: category.sub,
          wasCorrect: false,
        });
      }
    }

    return skills;
  }

  /**
   * Категоризация ошибки
   */
  private categorizeError(errorContent: string): { main: string; sub?: string } {
    // Простая эвристика (можно улучшить через AI)
    const lower = errorContent.toLowerCase();
    if (lower.includes('present perfect') || lower.includes('have/has')) {
      return { main: 'grammar', sub: 'present_perfect' };
    }
    if (lower.includes('article') || lower.includes('a/an/the')) {
      return { main: 'grammar', sub: 'articles' };
    }
    return { main: 'grammar' };
  }
}

