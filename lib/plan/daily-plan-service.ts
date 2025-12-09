import { Hasyx } from 'hasyx';

import {
  getAchievements,
  getActiveStageProgress,
  getDailyTasks,
  getLatestProgressMetric,
  getStageRequirements,
  getStreak,
  getUserProfile,
  getUserInstructionLanguage,
  getVocabularyCardsForReview,
  getWeeklyStructureForStage,
  updateDailyTaskMetadata,
  updateStageProgressStats,
  upsertDailyTaskFromStructure,
} from '@/lib/hasura-queries';
import { StageProgressionService, RequirementCheck } from '@/lib/stage-progression';
import { generateJSON } from '@/lib/ai/llm';
import { DailyPlanAiSummary } from '@/types/daily-plan';
import {
  SnapshotInsightsService,
  MethodologyAdvisor,
  type SnapshotInsights,
} from '@/lib/lesson-snapshots';
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service';

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
  methodologyHighlights: string[];
  snapshotInsights: SnapshotInsights | null;
}

export class DailyPlanService {
  constructor(
    private readonly hasyx: Hasyx,
    private readonly snapshotInsightsService: SnapshotInsightsService = new SnapshotInsightsService(hasyx),
    private readonly vocabularyGenerationService: VocabularyGenerationService = new VocabularyGenerationService(hasyx)
  ) {}

  /**
   * Проверяет, есть ли уже урок с произношением в списке задач
   */
  private hasPronunciationTask(tasks: DailyTaskRecord[]): boolean {
    for (const task of tasks) {
      // speaking - всегда голосовой
      if (task.type === 'speaking') {
        return true;
      }

      // ai_practice - если название/описание содержит "голос" или "запись голосовых сообщений"
      if (task.type === 'ai_practice') {
        const title = (task.title || '').toLowerCase();
        const description = ((task as any).description || '').toLowerCase();
        if (title.includes('голос') || title.includes('запись голосовых сообщений') ||
            description.includes('голос') || description.includes('запись голосовых сообщений')) {
          return true;
        }
      }

      // vocabulary - если есть pronunciationScript или requiresPronunciation
      if (task.type === 'vocabulary') {
        const payload = (task as any)?.type_specific_payload as Record<string, any> | undefined;
        if (payload) {
          const lessonMaterials = payload.lesson_materials as Record<string, any> | undefined;
          if (lessonMaterials?.pronunciationScript || lessonMaterials?.requiresPronunciation) {
            return true;
          }
          if (payload.pronunciationScript || payload.requiresPronunciation) {
            return true;
          }
        }
      }

      // Любой урок с флагом requiresPronunciation
      const payload = (task as any)?.type_specific_payload as Record<string, any> | undefined;
      if (payload?.requiresPronunciation === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Сгенерировать (или пересобрать) план дня
   */
  async generateDailyPlan(options: GenerateDailyPlanOptions): Promise<DailyPlanResult> {
    const targetDate = options.targetDate ?? this.formatDate(new Date());
    const userId = options.userId;

    if (!userId) {
      throw new Error('userId is required to generate the daily plan');
    }

    const snapshotInsightsPromise = this.snapshotInsightsService
      .getInsights(userId, { referenceDate: targetDate })
      .catch((error) => {
        console.warn('[DailyPlanService] Failed to build snapshot insights', error);
        return null;
      });

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

    let dailyTasksRaw = await getDailyTasks(this.hasyx, userId, targetDate);
    const snapshotInsights = await snapshotInsightsPromise;
    let vocabularyDue = await getVocabularyCardsForReview(this.hasyx, userId, targetDate);

    if ((Array.isArray(vocabularyDue) ? vocabularyDue.length : 0) === 0) {
      const generatedCards = await this.vocabularyGenerationService.generateCardsForUser({
        userId,
        level: user?.current_level || 'A2',
        snapshotInsights,
      });
      if ((generatedCards?.length ?? 0) > 0) {
        vocabularyDue = await getVocabularyCardsForReview(this.hasyx, userId, targetDate);
      }
    }
    const methodologyAdvisor = snapshotInsights ? new MethodologyAdvisor(snapshotInsights) : null;
    const methodologyFocus =
      methodologyAdvisor?.buildFocusTags({
        userLevel: user?.current_level ?? null,
        targetLevel: user?.target_level ?? null,
      }) ?? snapshotInsights?.methodologyHighlights ?? [];

    if (weeklyStructure.length === 0 && snapshotInsights) {
      const augmented = await this.ensureSnapshotDrivenTasks({
        userId,
        stageId,
        targetDate,
        insights: snapshotInsights,
        regenerate: options.regenerate ?? false,
        existingTasks: Array.isArray(dailyTasksRaw) ? dailyTasksRaw : [],
      });

      if (augmented) {
        dailyTasksRaw = await getDailyTasks(this.hasyx, userId, targetDate);
      }
    }

    const dailyTasks = Array.isArray(dailyTasksRaw) ? dailyTasksRaw : [];
    const latestMetrics = await getLatestProgressMetric(this.hasyx, userId);

    const requirementChecks = await this.calculateRequirementChecks(
      activeStageProgress,
      weeklyStructure,
      latestMetrics,
      userId
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
      snapshotInsights,
    });
    const planFocus = aiSummary.focus.length > 0 ? aiSummary.focus : methodologyFocus;

    const sharedPayload = {
      plan_date: targetDate,
      summary: aiSummary.summary,
      motivation: aiSummary.motivation,
      focus: planFocus,
      review_reminders: aiSummary.reviewReminders ?? [],
      methodology_focus: methodologyFocus,
      methodology_highlights: snapshotInsights?.methodologyHighlights ?? [],
      snapshot_insights: snapshotInsights
        ? {
            dominant_stage: snapshotInsights.shuHaRi?.dominantStage ?? null,
            problem_areas: snapshotInsights.problemAreas,
            kaizen_momentum: snapshotInsights.kaizenMomentum,
            sm2_schedule: {
              due_today: snapshotInsights.sm2Schedule.dueTodayCount,
              upcoming: snapshotInsights.sm2Schedule.upcomingCount,
            },
          }
        : undefined,
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
      focus: planFocus,
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
      methodologyHighlights: snapshotInsights?.methodologyHighlights ?? [],
      snapshotInsights: snapshotInsights ?? null,
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
    const snapshotInsightsPromise = this.snapshotInsightsService
      .getInsights(userId, { referenceDate: date })
      .catch((error) => {
        console.warn('[DailyPlanService] Failed to load snapshot insights (getDailyPlan):', error);
        return null;
      });
    const [
      stageProgress,
      tasksRaw,
      vocabularyDue,
      latestMetrics,
      streakRaw,
      achievementsRaw,
      snapshotInsights,
    ] =
      await Promise.all([
        getActiveStageProgress(this.hasyx, userId),
        getDailyTasks(this.hasyx, userId, date),
        getVocabularyCardsForReview(this.hasyx, userId, date),
        getLatestProgressMetric(this.hasyx, userId),
        getStreak(this.hasyx, userId),
        getAchievements(this.hasyx, userId),
        snapshotInsightsPromise,
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
      latestMetrics,
      userId
    );

    const dailyTasks = Array.isArray(tasksRaw) ? tasksRaw : [];
    const streak = Array.isArray(streakRaw) ? streakRaw[0] ?? null : streakRaw ?? null;
    const achievements = Array.isArray(achievementsRaw)
      ? achievementsRaw.slice(0, 5)
      : [];
    const planMetadata = this.extractPlanMetadata(dailyTasks);

    const resolvedSnapshotInsights =
      (planMetadata?.snapshotInsights as SnapshotInsights | undefined) ?? (snapshotInsights ?? null);
    const methodologyHighlights =
      planMetadata?.methodologyHighlights ?? resolvedSnapshotInsights?.methodologyHighlights ?? [];

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
      methodologyHighlights,
      snapshotInsights: resolvedSnapshotInsights ?? null,
    };
  }

  private async calculateRequirementChecks(
    stageProgress: StageProgressRecord,
    weeklyStructure: WeeklyStructureRecord[],
    latestMetrics: Awaited<ReturnType<typeof getLatestProgressMetric>>,
    userId: string
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

    // Вычисляем errors_pending динамически
    // Если errors_pending в БД = 0, но это может быть про слова из Active Recall
    // Проверяем количество неповторенных слов из vocabulary_cards
    let calculatedErrorsPending = stageProgress.errors_pending ?? 0;
    
    // Если errors_pending = 0, но это может быть про слова, проверяем vocabulary_cards
    // TODO: Разобраться, что именно имеется в виду под "ошибками" в requirements
    // Возможно, это неповторенные слова из Active Recall
    if (calculatedErrorsPending === 0) {
      try {
        // Проверяем, есть ли неповторенные слова для Active Recall
        const today = new Date().toISOString().split('T')[0];
        const vocabularyCards = await getVocabularyCardsForReview(this.hasyx, userId, today);
        // Если есть слова для повторения, это может быть то, что имеется в виду под "ошибками"
        // Но пока оставляем как есть, так как нужно уточнить логику
      } catch (error) {
        // Игнорируем ошибку, используем значение из БД
      }
    }

    const stageProgressData = {
      tasks_completed: stageProgress.tasks_completed ?? 0,
      tasks_total: stageProgress.tasks_total ?? weeklyStructure.length,
      words_learned: stageProgress.words_learned ?? 0,
      errors_pending: calculatedErrorsPending,
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

    // Получаем существующие задачи для проверки дубликатов
    const existingTasks = await getDailyTasks(this.hasyx, params.userId, params.targetDate);
    const existingTasksArray = Array.isArray(existingTasks) ? existingTasks : [];

    await Promise.all(
      (params.weeklyStructure as WeeklyStructureRecord[]).map((slot) => {
        // Проверяем, не создаем ли мы дубликат урока с произношением
        const isPronunciationTask =
          slot.activity_type === 'speaking' ||
          (slot.activity_type === 'ai_practice' &&
            (slot.title?.toLowerCase().includes('голос') ||
             slot.title?.toLowerCase().includes('запись голосовых сообщений'))) ||
          (slot.activity_type === 'vocabulary' && slot.requires_pronunciation);

        if (isPronunciationTask && this.hasPronunciationTask(existingTasksArray)) {
          // Пропускаем создание задачи, если уже есть урок с произношением
          return Promise.resolve();
        }

        return upsertDailyTaskFromStructure(this.hasyx, {
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
        });
      })
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
    snapshotInsights?: SnapshotInsights | null;
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

    // Получаем язык инструкций пользователя
    let instructionLanguage = 'ru';
    if (params.user?.id) {
      try {
        instructionLanguage = await getUserInstructionLanguage(this.hasyx, params.user.id);
      } catch (error) {
        console.warn('[DailyPlanService] Failed to get user instruction language, using default');
      }
    }

    const systemPrompt = `Ты — наставник японской методики обучения (Кумон, Сю-Ха-Ри, Кайдзен, Active Recall).
Составь поддерживающее объяснение учебного дня для подростка, который учит английский.
${instructionLanguage === 'ru' 
  ? 'Все ответы должны быть на русском языке.' 
  : `Все ответы должны быть на языке: ${instructionLanguage}.`}`;

    if (!params.forceAi && !process.env.OPENROUTER_API_KEY) {
      return this.buildFallbackSummary(taskPayload, requirementsPayload, params.snapshotInsights ?? null);
    }

    try {
      const promptParts = [
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
      ];

      if (params.snapshotInsights) {
        promptParts.push(
          `Проблемные области (Кайдзен): ${JSON.stringify(params.snapshotInsights.problemAreas, null, 2)}`
        );
        promptParts.push(`Динамика Кайдзен: ${JSON.stringify(params.snapshotInsights.kaizenMomentum, null, 2)}`);
        promptParts.push(`Шу-Ха-Ри стадия: ${JSON.stringify(params.snapshotInsights.shuHaRi, null, 2)}`);
        promptParts.push(`SM-2 повторения: ${JSON.stringify(params.snapshotInsights.sm2Schedule, null, 2)}`);
        promptParts.push(
          `Методические акценты: ${JSON.stringify(params.snapshotInsights.methodologyHighlights, null, 2)}`
        );
      } else {
        promptParts.push('Инсайты snapshot недоступны — сгенерируй общий план с учетом требований.');
      }

      promptParts.push(
        '',
        'ВАЖНО: Учитывай японские методики. Привяжи задания к проблемным областям и напомни про SM-2 повторения, если они есть.',
        '',
        instructionLanguage === 'ru'
          ? 'ВАЖНО: Все ответы (summary, focus, motivation, aiTasks, reviewReminders) должны быть на русском языке.'
          : `ВАЖНО: Все ответы должны быть на языке: ${instructionLanguage}.`,
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
}`
      );

      const prompt = promptParts.join('\n');

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
      return this.buildFallbackSummary(taskPayload, requirementsPayload, params.snapshotInsights ?? null, true);
    }
  }

  private buildFallbackSummary(
    taskPayload: Array<{ type: string; title: string; duration: number; status: string; aiEnabled: boolean }>,
    requirementsPayload: Array<{ type: string; met: boolean; message: string }>,
    snapshotInsights: SnapshotInsights | null,
    fallbackUsed = false
  ): DailyPlanAiSummary {
    const totalMinutes = taskPayload.reduce((sum, task) => sum + (task.duration || 0), 0);
    const focus = requirementsPayload
      .filter((req) => !req.met)
      .map((req) => req.message)
      .slice(0, 3);

    if (focus.length === 0 && snapshotInsights?.problemAreas?.length) {
      focus.push(
        ...snapshotInsights.problemAreas
          .slice(0, 2)
          .map((area) => `Повтори тему: ${area.content} (${area.severity})`)
      );
    }

    const summary = `Сегодня ${taskPayload.length} заданий на ${totalMinutes} минут. Начни с самых важных и двигайся шаг за шагом.`;
    let motivation =
      'Держи ритм и помни про маленькие улучшения каждый день — так работает Кайдзен. Ты справишься!';

    if (snapshotInsights?.shuHaRi) {
      const stage = snapshotInsights.shuHaRi.dominantStage;
      if (stage === 'shu') {
        focus.unshift('Shu: повтори правила без импровизации.');
        motivation = 'Сохраняй дисциплину: точные повторения сейчас важнее скорости.';
      } else if (stage === 'ha') {
        focus.unshift('Ha: применяй правило в новых контекстах.');
        motivation = 'Пробуй перестраивать фразы под себя — так рождается понимание.';
      } else {
        focus.unshift('Ri: свободно расскажи историю или мнение.');
        motivation = 'Доверься интуиции: говори свободно и отмечай идеи для улучшения.';
      }
    }

    const reviewReminders =
      snapshotInsights?.sm2Schedule.dueToday.slice(0, 3).map((recall) => `Active Recall: ${recall.contextPrompt}`) ||
      [];

    return {
      summary,
      focus,
      motivation,
      aiTasks: taskPayload
        .filter((task) => task.aiEnabled)
        .map((task) => {
          // Базовый контекст
          let context = 'Поддерживай короткий диалог, уточняй ошибки и хвали за прогресс.';
          
          // Для speaking уроков добавляем инструкции для ролевой игры
          if (task.type === 'speaking') {
            context = 'Ты играешь роль друга в ролевой игре. Отвечай короткими репликами, подходящими для голосового диалога. Мягко направляй разговор, чтобы ученик использовал целевые слова урока.';
          }
          
          // Для ai_practice с голосовыми сообщениями
          if (task.type === 'ai_practice') {
            const title = (task.title || '').toLowerCase();
            if (title.includes('запись голосовых сообщений') || title.includes('голос')) {
              context = 'Ты анализируешь голосовые сообщения ученика. Проверь произношение, использование целевых слов, грамматику и дай конструктивный фидбек.';
            }
          }
          
          return {
            type: task.type,
            prompt: 'Обсудим тему дня. Расскажи, что уже знаешь, и задавай вопросы.',
            context,
          };
        }),
      reviewReminders,
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
            methodology_focus?: string[];
            methodology_highlights?: string[];
            snapshot_insights?: SnapshotInsights;
          }
        | undefined
        | null;

      if (payload && (payload.summary || payload.focus || payload.motivation)) {
        const resolvedFocus =
          (payload.focus && payload.focus.length > 0
            ? payload.focus
            : payload.methodology_focus?.slice(0, 4)) ?? [];
        return {
          summary: payload.summary ?? '',
          motivation: payload.motivation ?? '',
          focus: resolvedFocus,
          reviewReminders: payload.review_reminders ?? [],
          source: (payload.source as 'ai' | 'structure' | undefined) ?? 'structure',
          snapshotInsights: payload.snapshot_insights,
          methodologyHighlights: payload.methodology_highlights,
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
    // Получаем существующие задачи для проверки дубликатов
    const existingTasks = await getDailyTasks(this.hasyx, params.userId, params.targetDate);
    const existingTasksArray = Array.isArray(existingTasks) ? existingTasks : [];

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

    // Фильтруем задачи, чтобы не создавать дубликаты уроков с произношением
    const filteredTasks = defaultTasks.filter((task) => {
      const isPronunciationTask = task.type === 'speaking' ||
        (task.type === 'ai_practice' && (task.title.toLowerCase().includes('голос') || task.description.toLowerCase().includes('голос'))) ||
        (task.type === 'vocabulary' && (task as any).requiresPronunciation);
      
      if (isPronunciationTask && this.hasPronunciationTask(existingTasksArray)) {
        return false; // Пропускаем
      }
      return true;
    });

    await Promise.all(
      filteredTasks.map((task) =>
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

  private async ensureSnapshotDrivenTasks(params: {
    userId: string;
    stageId: string | null;
    targetDate: string;
    insights: SnapshotInsights;
    existingTasks: DailyTaskRecord[];
    regenerate: boolean;
  }): Promise<boolean> {
    const existingInsightRefs = new Set<string>();
    for (const task of params.existingTasks) {
      const payload = (task as any)?.type_specific_payload as { insight_reference?: string } | undefined;
      if (payload?.insight_reference) {
        existingInsightRefs.add(String(payload.insight_reference));
      }
    }

    const advisor = new MethodologyAdvisor(params.insights);
    const descriptors = advisor.buildTaskBlueprints({
      targetDate: params.targetDate,
      existingInsightRefs,
    });

    if (descriptors.length === 0) {
      return false;
    }

    // Фильтруем дескрипторы, чтобы не создавать дубликаты уроков с произношением
    const filteredDescriptors = descriptors.filter((descriptor) => {
      // Проверяем, является ли этот дескриптор уроком с произношением
      const isPronunciationTask =
        descriptor.type === 'speaking' ||
        (descriptor.type === 'ai_practice' &&
          (descriptor.title?.toLowerCase().includes('голос') ||
           descriptor.title?.toLowerCase().includes('запись голосовых сообщений') ||
           descriptor.description?.toLowerCase().includes('голос'))) ||
        (descriptor.type === 'vocabulary' &&
          (descriptor.title?.toLowerCase().includes('произношение') ||
           descriptor.description?.toLowerCase().includes('произношение')));

      // Если это урок с произношением, проверяем, нет ли уже такого
      if (isPronunciationTask && this.hasPronunciationTask(params.existingTasks)) {
        return false; // Пропускаем этот дескриптор
      }
      return true;
    });

    await Promise.all(
      filteredDescriptors.map((descriptor) =>
        upsertDailyTaskFromStructure(this.hasyx, {
          userId: params.userId,
          stageId: params.stageId,
          taskDate: params.targetDate,
          type: descriptor.type,
          title: descriptor.title,
          description: descriptor.description,
          duration: descriptor.duration,
          aiEnabled: descriptor.aiEnabled,
          aiContext: params.regenerate ? null : undefined,
          suggestedPrompt: params.regenerate
            ? descriptor.recommendedPrompt ?? null
            : descriptor.recommendedPrompt ?? undefined,
          typeSpecificPayload: {
            source: 'snapshot_insights',
            insight_type: descriptor.insightType,
            insight_reference: descriptor.reference,
            snapshot_summary: descriptor.snapshotSummary,
            methodology_focus: descriptor.methodologyFocus,
            recommended_prompt: descriptor.recommendedPrompt,
            regenerate: params.regenerate,
          },
        })
      )
    );

    return true;
  }
}


