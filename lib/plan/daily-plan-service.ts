import { Hasyx } from 'hasyx';

import {
  getAchievements,
  getActiveStageProgress,
  getDailyTasks,
  getLatestProgressMetric,
  getStageRequirements,
  getStreak,
  getUserProfile,
  getVocabularyCardsForReview,
  getWeeklyStructureForStage,
  updateDailyTaskMetadata,
  updateStageProgressStats,
  upsertDailyTaskFromStructure,
} from '@/lib/hasura-queries';
import { StageProgressionService, RequirementCheck } from '@/lib/stage-progression';
import { generateJSON } from '@/lib/ai/llm';
import { DailyPlan, DailyPlanAiSummary, EnrichedDailyPlan } from '@/types/daily-plan';
import { User } from 'next-auth';

type DailyTaskRecord = Awaited<ReturnType<typeof getDailyTasks>> extends (infer T)[]
  ? T
  : Awaited<ReturnType<typeof getDailyTasks>>;

type WeeklyStructureRecord = Awaited<ReturnType<typeof getWeeklyStructureForStage>> extends (infer T)[]
  ? T
  : Awaited<ReturnType<typeof getWeeklyStructureForStage>>;

type StageProgressRecord = Awaited<ReturnType<typeof getActiveStageProgress>>;

type AchievementRecord = Awaited<ReturnType<typeof getAchievements>> extends (infer A)[]
  ? A
  : Awaited<ReturnType<typeof getAchievements>>;

interface GenerateDailyPlanOptions {
  userId: string;
  targetDate?: string;
  regenerate?: boolean;
  forceAi?: boolean;
}

export interface DailyPlanResult {
  date: string;
  stage: StageProgressRecord extends infer S
    ? S extends { stage: any }
      ? S['stage'] | null
      : null
    : null;
  tasks: DailyTaskRecord[];
  summary: string;
  focus: string[];
  motivation: string;
  reviewReminders: string[];
  requirementChecks: RequirementCheck[];
  readiness: boolean;
  completionPercentage: number;
  vocabulary: {
    dueToday: number;
  };
  streak: Awaited<ReturnType<typeof getStreak>> extends (infer S)[] ? S | null : any;
  achievements: Awaited<ReturnType<typeof getAchievements>> extends (infer A)[]
    ? A[]
    : never;
  weeklyStructure: WeeklyStructureRecord[];
  source: 'ai' | 'structure';
}

export class DailyPlanService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Сгенерировать (или пересобрать) план дня
   */
  async generateDailyPlan(options: GenerateDailyPlanOptions): Promise<DailyPlanResult> {
    const targetDate = options.targetDate ?? this.formatDate(new Date());
    const userId = options.userId;

    if (!userId) {
      throw new Error('userId is required to generate the daily plan');
    }

    const [user, stageProgress, streakRaw, achievementsRaw] = await Promise.all([
      getUserProfile(this.hasyx, userId),
      getActiveStageProgress(this.hasyx, userId),
      getStreak(this.hasyx, userId),
      getAchievements(this.hasyx, userId),
    ]);

    const streak = Array.isArray(streakRaw) ? streakRaw[0] ?? null : streakRaw ?? null;
    const achievements = Array.isArray(achievementsRaw)
      ? achievementsRaw.slice(0, 5)
      : [];

    // Если у пользователя нет активного этапа, создаем его на основе уровня
    let activeStageProgress = stageProgress;
    if (!activeStageProgress && user) {
      // Используем fallback для null/undefined уровня
      const userLevel = user.current_level || 'A2';
      activeStageProgress = await this.ensureInitialStageProgress(userId, userLevel);
    }

    const stageId = activeStageProgress?.stage_id ?? activeStageProgress?.stage?.id ?? null;
    const dayOfWeek = this.getIsoDayOfWeek(targetDate);
    
    let weeklyStructure = stageId
      ? await getWeeklyStructureForStage(this.hasyx, stageId, dayOfWeek)
      : [];

    // Если нет структуры для текущего дня, пробуем получить любую структуру для этапа
    if (stageId && weeklyStructure.length === 0) {
      weeklyStructure = await getWeeklyStructureForStage(this.hasyx, stageId);
      console.log(`[DailyPlanService] No structure for day ${dayOfWeek}, using any structure for stage ${stageId}`);
    }

    // Если все еще нет структуры, создаем базовые задания
    if (weeklyStructure.length === 0 && stageId) {
      console.log(`[DailyPlanService] No weekly structure found, creating default tasks for stage ${stageId}`);
      await this.createDefaultTasks({
        userId,
        stageId,
        targetDate,
        userLevel: user?.current_level || 'A2',
        regenerate: options.regenerate ?? false,
      });
    } else if (weeklyStructure.length > 0) {
      if (activeStageProgress?.id) {
        const tasksTotal = Math.max(activeStageProgress.tasks_total ?? 0, weeklyStructure.length);
        if (tasksTotal !== activeStageProgress.tasks_total) {
          await updateStageProgressStats(this.hasyx, activeStageProgress.id, {
            tasksTotal,
          });
          activeStageProgress.tasks_total = tasksTotal;
        }
      }

      await this.ensureTasksFromStructure({
        userId,
        stageId,
        targetDate,
        weeklyStructure,
        regenerate: options.regenerate ?? false,
      });
    }

    const dailyTasksRaw = await getDailyTasks(this.hasyx, userId, targetDate);
    const dailyTasks = Array.isArray(dailyTasksRaw) ? dailyTasksRaw : [];

    const vocabularyDue = await getVocabularyCardsForReview(this.hasyx, userId, targetDate);
    const latestMetrics = await getLatestProgressMetric(this.hasyx, userId);

    const requirementChecks = await this.calculateRequirementChecks(
      activeStageProgress,
      weeklyStructure,
      latestMetrics
    );

    const readiness = StageProgressionService.isReadyForTest(requirementChecks);
    const completionPercentage = StageProgressionService.getCompletionPercentage(requirementChecks);

    const aiSummary = await this.buildAiSummary({
      user,
      stageProgress: activeStageProgress,
      tasks: dailyTasks,
      requirementChecks,
      vocabularyDue: Array.isArray(vocabularyDue) ? vocabularyDue.length : 0,
      streak,
      achievements,
      targetDate,
      forceAi: options.forceAi ?? false,
    });

    const sharedPayload = {
      plan_date: targetDate,
      summary: aiSummary.summary,
      motivation: aiSummary.motivation,
      focus: aiSummary.focus,
      review_reminders: aiSummary.reviewReminders ?? [],
      requirement_checks: requirementChecks.map((check) => ({
        id: check.requirement.id,
        type: check.requirement.requirement_type,
        met: check.met,
        message: check.message,
      })),
      readiness,
      completion_percentage: completionPercentage,
      source: aiSummary.fallbackUsed ? 'structure' : 'ai',
      generated_at: new Date().toISOString(),
    };

    await Promise.all(
      dailyTasks.map(async (task) => {
        const aiTask = aiSummary.aiTasks.find((item) => item.type === task.type);

        const dataToUpdate: {
          aiContext?: any;
          suggestedPrompt?: string | null;
          typeSpecificPayload?: any;
        } = {
          typeSpecificPayload: {
            ...sharedPayload,
            task_type: task.type,
          },
        };

        if (aiTask) {
          dataToUpdate.aiContext = {
            context: aiTask.context,
          };
          dataToUpdate.suggestedPrompt = aiTask.prompt;
        }

        await updateDailyTaskMetadata(this.hasyx, task.id, dataToUpdate);
      })
    );

    // Перезагружаем задания после обновления метаданных, чтобы получить актуальные данные
    const updatedTasksRaw = await getDailyTasks(this.hasyx, userId, targetDate);
    const updatedTasks = Array.isArray(updatedTasksRaw) ? updatedTasksRaw : [];

    return {
      date: targetDate,
      stage: activeStageProgress?.stage ?? null,
      tasks: updatedTasks.length > 0 ? updatedTasks : dailyTasks,
      summary: aiSummary.summary,
      focus: aiSummary.focus,
      motivation: aiSummary.motivation,
      reviewReminders: aiSummary.reviewReminders ?? [],
      requirementChecks,
      readiness,
      completionPercentage,
      vocabulary: {
        dueToday: Array.isArray(vocabularyDue) ? vocabularyDue.length : 0,
      },
      streak,
      achievements,
      weeklyStructure,
      source: aiSummary.fallbackUsed ? 'structure' : 'ai',
    };
  }

  /**
   * Получить план без пересборки (используется в /api/plan/today)
   */
  async getDailyPlan(
    userId: string,
    targetDate?: string
  ): Promise<DailyPlanResult> {
    const date = targetDate ?? this.formatDate(new Date());
    const [stageProgress, tasksRaw, vocabularyDue, latestMetrics, streakRaw, achievementsRaw] =
      await Promise.all([
        getActiveStageProgress(this.hasyx, userId),
        getDailyTasks(this.hasyx, userId, date),
        getVocabularyCardsForReview(this.hasyx, userId, date),
        getLatestProgressMetric(this.hasyx, userId),
        getStreak(this.hasyx, userId),
        getAchievements(this.hasyx, userId),
      ]);

    const weeklyStructure = stageProgress?.stage_id
      ? await getWeeklyStructureForStage(
          this.hasyx,
          stageProgress.stage_id,
          this.getIsoDayOfWeek(date)
        )
      : [];

    const requirementChecks = await this.calculateRequirementChecks(
      stageProgress,
      weeklyStructure,
      latestMetrics
    );

    const dailyTasks = Array.isArray(tasksRaw) ? tasksRaw : [];
    const streak = Array.isArray(streakRaw) ? streakRaw[0] ?? null : streakRaw ?? null;
    const achievements = Array.isArray(achievementsRaw)
      ? achievementsRaw.slice(0, 5)
      : [];
    const planMetadata = this.extractPlanMetadata(dailyTasks);

    const readiness = StageProgressionService.isReadyForTest(requirementChecks);
    const completionPercentage = StageProgressionService.getCompletionPercentage(requirementChecks);

    return {
      date,
      stage: stageProgress?.stage ?? null,
      tasks: dailyTasks,
      summary: planMetadata?.summary ?? '',
      focus: planMetadata?.focus ?? [],
      motivation: planMetadata?.motivation ?? '',
      reviewReminders: planMetadata?.reviewReminders ?? [],
      requirementChecks,
      readiness,
      completionPercentage,
      vocabulary: {
        dueToday: Array.isArray(vocabularyDue) ? vocabularyDue.length : 0,
      },
      streak,
      achievements,
      weeklyStructure,
      source: planMetadata?.source ?? 'structure',
    };
  }

  private async calculateRequirementChecks(
    stageProgress: StageProgressRecord,
    weeklyStructure: WeeklyStructureRecord[],
    latestMetrics: Awaited<ReturnType<typeof getLatestProgressMetric>>
  ): Promise<RequirementCheck[]> {
    if (!stageProgress?.stage_id) {
      return [];
    }

    const requirements = await getStageRequirements(this.hasyx, stageProgress.stage_id);
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return [];
    }

    const averageAccuracyFromMetrics = StageProgressionService.calculateAverageAccuracy(
      latestMetrics ?? {}
    );

    const stageProgressData = {
      tasks_completed: stageProgress.tasks_completed ?? 0,
      tasks_total: stageProgress.tasks_total ?? weeklyStructure.length,
      words_learned: stageProgress.words_learned ?? 0,
      errors_pending: stageProgress.errors_pending ?? 0,
      average_accuracy:
        stageProgress.average_accuracy ??
        averageAccuracyFromMetrics ??
        0,
      status: (stageProgress.status ??
        'in_progress') as Parameters<typeof StageProgressionService.checkStageRequirements>[0]['status'],
    };

    if (
      stageProgress?.id &&
      typeof averageAccuracyFromMetrics === 'number' &&
      !stageProgress.average_accuracy
    ) {
      await updateStageProgressStats(this.hasyx, stageProgress.id, {
        averageAccuracy: averageAccuracyFromMetrics,
      });
    }

    return StageProgressionService.checkStageRequirements(
      stageProgressData,
      requirements
    );
  }

  private async ensureTasksFromStructure(params: {
    userId: string;
    stageId: string | null;
    targetDate: string;
    weeklyStructure: WeeklyStructureRecord[];
    regenerate: boolean;
  }) {
    const titleFallback = (activityType: string) => {
      switch (activityType) {
        case 'grammar':
          return 'Грамматическое задание';
        case 'vocabulary':
          return 'Повтор словаря';
        case 'reading':
          return 'Чтение текста';
        case 'listening':
          return 'Аудирование';
        case 'writing':
          return 'Письменная практика';
        case 'speaking':
          return 'Говорение';
        case 'ai_practice':
          return 'Практика с AI';
        default:
          return 'Учебное задание';
      }
    };

    await Promise.all(
      (params.weeklyStructure as WeeklyStructureRecord[]).map((slot) =>
        upsertDailyTaskFromStructure(this.hasyx, {
          userId: params.userId,
          stageId: params.stageId,
          taskDate: params.targetDate,
          type: slot.activity_type,
          title: slot.description || titleFallback(slot.activity_type),
          description: slot.description,
          duration: slot.duration_minutes ?? 10,
          aiEnabled: ['ai_practice', 'speaking', 'writing'].includes(slot.activity_type),
          aiContext: params.regenerate ? null : undefined,
          suggestedPrompt: params.regenerate ? null : undefined,
          typeSpecificPayload: {
            source: 'weekly_structure',
            weekly_structure_id: slot.id,
            regenerate: params.regenerate,
          },
        })
      )
    );
  }

  private async buildAiSummary(params: {
    user: Awaited<ReturnType<typeof getUserProfile>>;
    stageProgress: StageProgressRecord;
    tasks: DailyTaskRecord[];
    requirementChecks: RequirementCheck[];
    vocabularyDue: number;
    streak: Awaited<ReturnType<typeof getStreak>> extends (infer S)[] ? S | null : any;
    achievements: Awaited<ReturnType<typeof getAchievements>> extends (infer A)[]
      ? A[]
      : never;
    targetDate: string;
    forceAi: boolean;
  }): Promise<DailyPlanAiSummary> {
    const taskPayload = (params.tasks as DailyTaskRecord[]).map((task) => ({
      id: task.id,
      type: task.type,
      title: task.title,
      duration: task.duration_minutes,
      status: task.status,
      aiEnabled: task.ai_enabled,
    }));

    const requirementsPayload = params.requirementChecks.map((check) => ({
      id: check.requirement.id,
      type: check.requirement.requirement_type,
      met: check.met,
      message: check.message,
    }));

    const streakInfo =
      params.streak && typeof params.streak === 'object'
        ? {
            current: params.streak.current_streak,
            longest: params.streak.longest_streak,
          }
        : null;

    const achievementsPayload = ((params.achievements ?? []) as AchievementRecord[]).map((achievement) => ({
      type: achievement.type,
      title: achievement.title,
      unlocked_at: achievement.unlocked_at,
    }));

    const systemPrompt = `Ты — наставник японской методики обучения (Кумон, Шю, Кайдзен).
Составь поддерживающее объяснение учебного дня для подростка, который учит английский.`;

    if (!params.forceAi && !process.env.OPENROUTER_API_KEY) {
      return this.buildFallbackSummary(taskPayload, requirementsPayload);
    }

    try {
      // Получить проблемные области из последних слепков
      const problemAreas = await this.getRecentProblemAreas(params.user?.id || '');
      
      // Получить прогресс Кумон
      const kumonProgress = await this.getKumonProgress(params.user?.id || '');
      
      // Получить Active Recall задания на сегодня
      const activeRecallDue = await this.getActiveRecallDue(params.user?.id || '', params.targetDate);

      const prompt = [
        `Дата: ${params.targetDate}`,
        params.user
          ? `Ученик: ${params.user.name || 'без имени'}, уровень ${params.user.current_level}, цель ${params.user.target_level}`
          : 'Ученик: данные отсутствуют',
        params.stageProgress?.stage
          ? `Текущий этап: ${params.stageProgress.stage.name} (${params.stageProgress.stage.focus || 'без фокуса'})`
          : 'Этап не найден',
        `Задачи на день: ${JSON.stringify(taskPayload, null, 2)}`,
        `Проверки требований: ${JSON.stringify(requirementsPayload, null, 2)}`,
        `Словарных карточек к повторению: ${params.vocabularyDue}`,
        streakInfo ? `Сейчас стрик: ${JSON.stringify(streakInfo)}` : 'Стрик неизвестен',
        achievementsPayload.length
          ? `Последние достижения: ${JSON.stringify(achievementsPayload, null, 2)}`
          : 'Достижения пока не зафиксированы',
        problemAreas.length > 0
          ? `Проблемные области из последних уроков (на них нужно сделать акцент): ${JSON.stringify(problemAreas, null, 2)}`
          : 'Проблемных областей не обнаружено',
        kumonProgress.length > 0
          ? `Текущий прогресс Кумон (уровни навыков): ${JSON.stringify(kumonProgress, null, 2)}`
          : '',
        activeRecallDue.length > 0
          ? `Active Recall задания на сегодня: ${JSON.stringify(activeRecallDue, null, 2)}`
          : '',
        '',
        'ВАЖНО: Учитывай проблемные области при генерации заданий. Сфокусируйся на них!',
        '',
        'Сформируй JSON вида:',
        `{
  "summary": "краткое описание плана (2-3 предложения)",
  "focus": ["основные акценты обучения"],
  "motivation": "дружелюбная мотивация (1-2 предложения)",
  "aiTasks": [
    {
      "type": "тип задания (например, ai_practice или speaking)",
      "prompt": "какой промпт дать ученику",
      "context": "какую роль сыграет AI, что отработать"
    }
  ],
  "reviewReminders": ["при необходимости, что повторить"]
}`,
      ].join('\n');

      const response = await generateJSON<DailyPlanAiSummary>(prompt, { systemPrompt });

      return {
        summary: response.summary,
        focus: response.focus ?? [],
        motivation: response.motivation,
        aiTasks: response.aiTasks ?? [],
        reviewReminders: response.reviewReminders ?? [],
        fallbackUsed: false,
      };
    } catch (error) {
      console.warn('AI summary generation failed, using fallback:', error);
      return this.buildFallbackSummary(taskPayload, requirementsPayload, true);
    }
  }

  private buildFallbackSummary(
    taskPayload: Array<{ type: string; title: string; duration: number; status: string; aiEnabled: boolean }>,
    requirementsPayload: Array<{ type: string; met: boolean; message: string }>,
    fallbackUsed = false
  ): DailyPlanAiSummary {
    const totalMinutes = taskPayload.reduce((sum, task) => sum + (task.duration || 0), 0);
    const focus = requirementsPayload
      .filter((req) => !req.met)
      .map((req) => req.message)
      .slice(0, 3);

    const summary = `Сегодня ${taskPayload.length} заданий на ${totalMinutes} минут. Начни с самых важных и двигайся шаг за шагом.`;
    const motivation =
      'Держи ритм и помни про маленькие улучшения каждый день — так работает Кайдзен. Ты справишься!';

    return {
      summary,
      focus,
      motivation,
      aiTasks: taskPayload
        .filter((task) => task.aiEnabled)
        .map((task) => ({
          type: task.type,
          prompt: 'Обсудим тему дня. Расскажи, что уже знаешь, и задавай вопросы.',
          context: 'Поддерживай короткий диалог, уточняй ошибки и хвали за прогресс.',
        })),
      reviewReminders: [],
      fallbackUsed,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getIsoDayOfWeek(dateString: string): number {
    const date = new Date(`${dateString}T00:00:00`);
    const day = date.getUTCDay();
    return day === 0 ? 7 : day;
  }

  /**
   * Получить проблемные области из последних слепков
   */
  private async getRecentProblemAreas(userId: string): Promise<any[]> {
    if (!userId) return [];

    try {
      const snapshots = await this.hasyx.select({
        table: 'lesson_snapshots',
        where: {
          user_id: { _eq: userId },
        },
        order_by: [{ lesson_date: 'desc' }],
        limit: 10,
        returning: ['problem_areas', 'lesson_type'],
      });

      const allSnapshots = Array.isArray(snapshots) ? snapshots : snapshots ? [snapshots] : [];
      const problemAreas: any[] = [];

      for (const snapshot of allSnapshots) {
        const areas = (snapshot.problem_areas as any[]) || [];
        for (const area of areas) {
          problemAreas.push({
            ...area,
            lesson_type: snapshot.lesson_type,
          });
        }
      }

      // Группировка по типу и категории
      const grouped = new Map<string, any>();
      for (const area of problemAreas) {
        const key = `${area.type}_${area.content?.substring(0, 20)}`;
        if (!grouped.has(key)) {
          grouped.set(key, { ...area, frequency: 1 });
        } else {
          grouped.get(key)!.frequency++;
        }
      }

      return Array.from(grouped.values())
        .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
        .slice(0, 5); // Топ-5 проблемных областей
    } catch (error) {
      console.error('Error getting problem areas:', error);
      return [];
    }
  }

  /**
   * Получить прогресс Кумон
   */
  private async getKumonProgress(userId: string): Promise<any[]> {
    if (!userId) return [];

    try {
      const progress = await this.hasyx.select({
        table: 'kumon_progress',
        where: {
          user_id: { _eq: userId },
          status: { _in: ['practicing', 'ready_for_next'] },
        },
        returning: ['skill_category', 'skill_subcategory', 'current_level', 'status'],
        limit: 10,
      });

      return Array.isArray(progress) ? progress : progress ? [progress] : [];
    } catch (error) {
      console.error('Error getting Kumon progress:', error);
      return [];
    }
  }

  /**
   * Получить Active Recall задания на сегодня
   */
  private async getActiveRecallDue(userId: string, date: string): Promise<any[]> {
    if (!userId) return [];

    try {
      const recalls = await this.hasyx.select({
        table: 'active_recall_sessions',
        where: {
          user_id: { _eq: userId },
          next_review_date: { _lte: date },
        },
        returning: ['recall_type', 'context_prompt', 'correct_response'],
        limit: 5,
      });

      return Array.isArray(recalls) ? recalls : recalls ? [recalls] : [];
    } catch (error) {
      console.error('Error getting Active Recall due:', error);
      return [];
    }
  }

  private extractPlanMetadata(tasks: DailyTaskRecord[]) {
    for (const task of tasks) {
      const payload = (task as any)?.type_specific_payload as
        | {
            summary?: string;
            motivation?: string;
            focus?: string[];
            review_reminders?: string[];
            source?: string;
          }
        | undefined
        | null;

      if (payload && (payload.summary || payload.focus || payload.motivation)) {
        return {
          summary: payload.summary ?? '',
          motivation: payload.motivation ?? '',
          focus: payload.focus ?? [],
          reviewReminders: payload.review_reminders ?? [],
          source: (payload.source as 'ai' | 'structure' | undefined) ?? 'structure',
        };
      }
    }

    return null;
  }

  /**
   * Создать начальный этап для пользователя на основе его уровня
   */
  private async ensureInitialStageProgress(
    userId: string,
    currentLevel: string
  ): Promise<StageProgressRecord | null> {
    try {
      // Найти первый этап, который подходит для уровня пользователя
      let stages = await this.hasyx.select({
        table: 'study_stages',
        where: {
          level_from: { _eq: currentLevel },
        },
        order_by: [{ order_index: 'asc' }],
        limit: 1,
        returning: ['id', 'name', 'level_from', 'level_to', 'focus'],
      });

      let stage = Array.isArray(stages) ? stages[0] : stages;
      
      // Если не нашли этап для текущего уровня, ищем первый этап (fallback)
      if (!stage) {
        console.warn(`[DailyPlanService] No stage found for level ${currentLevel}, trying first stage`);
        stages = await this.hasyx.select({
          table: 'study_stages',
          order_by: [{ order_index: 'asc' }],
          limit: 1,
          returning: ['id', 'name', 'level_from', 'level_to', 'focus'],
        });
        stage = Array.isArray(stages) ? stages[0] : stages;
      }

      if (!stage) {
        console.error(`[DailyPlanService] No stages found in database`);
        return null;
      }

      // Создать stage_progress для этого этапа
      const progress = await this.hasyx.insert({
        table: 'stage_progress',
        object: {
          user_id: userId,
          stage_id: stage.id,
          status: 'in_progress',
          tasks_completed: 0,
          tasks_total: 0,
          words_learned: 0,
          errors_pending: 0,
        },
        returning: [
          'id',
          'stage_id',
          'started_at',
          'tasks_completed',
          'tasks_total',
          'words_learned',
          'errors_pending',
          'average_accuracy',
          'status',
        ],
      });

      const progressData = Array.isArray(progress) ? progress[0] : progress;
      return {
        ...progressData,
        stage,
      } as StageProgressRecord;
    } catch (error) {
      console.error('[DailyPlanService] Failed to create initial stage progress:', error);
      return null;
    }
  }

  /**
   * Создать базовые задания, если нет weekly_structure
   */
  private async createDefaultTasks(params: {
    userId: string;
    stageId: string | null;
    targetDate: string;
    userLevel: string;
    regenerate: boolean;
  }) {
    const defaultTasks = [
      {
        type: 'grammar',
        title: 'Грамматическое задание',
        description: 'Практика грамматики уровня ' + params.userLevel,
        duration: 15,
        aiEnabled: false,
      },
      {
        type: 'vocabulary',
        title: 'Повтор словаря',
        description: 'Повторение изученных слов',
        duration: 10,
        aiEnabled: false,
      },
      {
        type: 'reading',
        title: 'Чтение текста',
        description: 'Чтение адаптированного текста',
        duration: 20,
        aiEnabled: false,
      },
    ];

    await Promise.all(
      defaultTasks.map((task) =>
        upsertDailyTaskFromStructure(this.hasyx, {
          userId: params.userId,
          stageId: params.stageId,
          taskDate: params.targetDate,
          type: task.type,
          title: task.title,
          description: task.description,
          duration: task.duration,
          aiEnabled: task.aiEnabled,
          aiContext: params.regenerate ? null : undefined,
          suggestedPrompt: params.regenerate ? null : undefined,
          typeSpecificPayload: {
            source: 'default',
            regenerate: params.regenerate,
          },
        })
      )
    );
  }
}


