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
import { ClaudeService } from '@/lib/ai/claude-service';

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

interface DailyPlanAiSummary {
  summary: string;
  focus: string[];
  motivation: string;
  aiTasks: Array<{
    type: string;
    prompt: string;
    context: string;
  }>;
  reviewReminders?: string[];
  fallbackUsed?: boolean;
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

    const stageId = stageProgress?.stage_id ?? stageProgress?.stage?.id ?? null;
    const weeklyStructure = stageId
      ? await getWeeklyStructureForStage(this.hasyx, stageId, this.getIsoDayOfWeek(targetDate))
      : [];

    if (stageProgress?.id && weeklyStructure.length) {
      const tasksTotal = Math.max(stageProgress.tasks_total ?? 0, weeklyStructure.length);
      if (tasksTotal !== stageProgress.tasks_total) {
        await updateStageProgressStats(this.hasyx, stageProgress.id, {
          tasksTotal,
        });
        stageProgress.tasks_total = tasksTotal;
      }
    }

    if (weeklyStructure.length) {
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
      stageProgress,
      weeklyStructure,
      latestMetrics
    );

    const readiness = StageProgressionService.isReadyForTest(requirementChecks);
    const completionPercentage = StageProgressionService.getCompletionPercentage(requirementChecks);

    const aiSummary = await this.buildAiSummary({
      user,
      stageProgress,
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

        if (aiTask) {
          task.ai_context = dataToUpdate.aiContext;
          task.suggested_prompt = aiTask.prompt;
        }
        task.type_specific_payload = dataToUpdate.typeSpecificPayload;
      })
    );

    return {
      date: targetDate,
      stage: stageProgress?.stage ?? null,
      tasks: dailyTasks,
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

    if (!params.forceAi && !process.env.ANTHROPIC_API_KEY) {
      return this.buildFallbackSummary(taskPayload, requirementsPayload);
    }

    try {
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

      const response = await ClaudeService.generateJSON<DailyPlanAiSummary>(prompt, {
        maxTokens: 900,
        systemPrompt,
      });

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
}


