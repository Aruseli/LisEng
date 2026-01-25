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
  ProgressInsightsService,
  MethodologyAdvisor,
  type SnapshotInsights,
} from '@/lib/lesson-snapshots';
import type { SnapshotInsights as OldSnapshotInsights } from '@/lib/lesson-snapshots/methodology-advisor';
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
    private readonly progressInsightsService: ProgressInsightsService,
    private readonly vocabularyGenerationService: VocabularyGenerationService = new VocabularyGenerationService(hasyx)
  ) {}

  /**
   * Адаптирует новый SnapshotInsights к старому формату для MethodologyAdvisor
   */
  private adaptSnapshotInsights(newInsights: SnapshotInsights): OldSnapshotInsights {
    return {
      referenceDate: new Date().toISOString(),
      problemAreas: newInsights.problemAreas.map(area => ({
        type: area.content.includes('unknown') ? 'unknown_word' : 'error',
        content: area.content,
        severity: area.severity,
        frequency: area.frequency,
        context: '',
        timestamp: new Date().toISOString(),
        lessonTypes: ['reading', 'writing', 'speaking', 'listening'], // Обобщенные типы уроков
        lastSeen: new Date().toISOString() // Текущее время как последнее появление
      })),
      kaizenMomentum: {
        accuracyDeltaAvg: newInsights.kaizenMomentum.accuracyDelta,
        speedDeltaAvg: newInsights.kaizenMomentum.speedDelta,
        mistakesReducedTotal: 0, // Не доступно в новом интерфейсе
        trend: newInsights.kaizenMomentum.overall === 'positive' ? 'improving' as const :
               newInsights.kaizenMomentum.overall === 'negative' ? 'regressing' as const : 'stable' as const
      },
      masteryDistribution: {}, // Пустой объект, так как новый интерфейс не имеет этого
      shuHaRi: newInsights.shuHaRi ? {
        dominantStage: newInsights.shuHaRi.stage,
        skills: [], // Пустой массив, так как новый интерфейс не имеет детальной информации по навыкам
        recommendations: [], // Пустой массив рекомендаций
        pendingTestRecommended: newInsights.shuHaRi.readinessForNext > 80 // Рекомендовать тест если готовность > 80%
      } : null,
      shuHaRiStages: {}, // Пустой объект
      sm2Schedule: {
        dueTodayCount: newInsights.sm2Schedule.dueToday,
        upcomingCount: newInsights.sm2Schedule.dueThisWeek,
        dueToday: [], // Пустой массив, так как новый интерфейс не имеет деталей
        upcoming: [] // Пустой массив, так как новый интерфейс не имеет деталей
      },
      methodologyHighlights: newInsights.methodologyHighlights
    };
  }

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

    const snapshotInsightsPromise = this.progressInsightsService
      .getSnapshotInsights(userId, 30) // последние 30 дней
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

    console.log(`[DailyPlanService] Initial weeklyStructure for day ${dayOfWeek}:`, weeklyStructure.length, 'items');

    // Если нет структуры для текущего дня, пробуем получить любую структуру для этапа
    if (stageId && weeklyStructure.length === 0) {
      weeklyStructure = await getWeeklyStructureForStage(this.hasyx, stageId);
      console.log(`[DailyPlanService] No structure for day ${dayOfWeek}, using any structure for stage ${stageId}:`, weeklyStructure.length, 'items');
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
      console.log(`[DailyPlanService] Using weeklyStructure:`, weeklyStructure.map((s: any) => ({ type: s.activity_type, day: s.day_of_week })));
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
    // Адаптируем новый SnapshotInsights к старому формату для MethodologyAdvisor
    const adaptedInsights = snapshotInsights ? this.adaptSnapshotInsights(snapshotInsights) : null;
    const methodologyAdvisor = adaptedInsights ? new MethodologyAdvisor(adaptedInsights) : null;
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

    // Получаем Kumon уровни пользователя
    const kumonLevels = await this.getUserKumonLevels(userId);

    // Получаем Shu-Ha-Ri стадии пользователя
    const shuHaRiStages = await this.getUserShuHaRiStages(userId);

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
      kumonLevels,
      shuHaRiStages,
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
            dominant_stage: snapshotInsights.shuHaRi?.stage ?? null,
            problem_areas: snapshotInsights.problemAreas,
            kaizen_momentum: snapshotInsights.kaizenMomentum,
            sm2_schedule: {
              due_today: snapshotInsights.sm2Schedule.dueToday,
              upcoming: snapshotInsights.sm2Schedule.dueThisWeek,
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
    const snapshotInsightsPromise = this.progressInsightsService
      .getSnapshotInsights(userId, 30) // последние 30 дней
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
    console.log(`[ensureTasksFromStructure] Creating tasks from ${params.weeklyStructure.length} structure items`);
    
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

  /**
   * Получение специализированных инструкций по сложности заданий
   */
  private getComplexityInstructions(
    kumonLevels: Record<string, number> | undefined,
    shuHaRiStages: Record<string, 'shu' | 'ha' | 'ri'> | undefined
  ): string {
    const instructions: string[] = [];

    // Анализ Kumon уровней для определения общей сложности
    const levels = kumonLevels ? Object.values(kumonLevels) : [];
    const avgLevel = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 3.5;
    const maxLevel = levels.length > 0 ? Math.max(...levels) : 3;

    // Определяем общий уровень сложности
    let overallComplexity: 'beginner' | 'intermediate' | 'advanced';
    if (avgLevel < 2.5) overallComplexity = 'beginner';
    else if (avgLevel < 5) overallComplexity = 'intermediate';
    else overallComplexity = 'advanced';

    // Специализированные инструкции по типам заданий
    const complexityInstructions = {
      beginner: {
        vocabulary: 'Используй базовую лексику (A1-A2 уровень): цвета, числа, семья, еда, животные. Избегай сложных идиом.',
        grammar: 'Фокус на Present Simple, Present Continuous, базовые времена. Используй простые предложения.',
        reading: 'Короткие тексты (50-100 слов) с большими картинками. Темы: повседневная жизнь, хобби.',
        listening: 'Медленная речь, четкое произношение. Короткие диалоги (30 сек).',
        speaking: 'Простые вопросы: "What is your name?", "How are you?". Много подсказок и примеров.',
        writing: 'Короткие предложения (5-10 слов). Темы: описать себя, семью, хобби.'
      },
      intermediate: {
        vocabulary: 'Средний уровень лексики (B1-B2): работа, путешествия, технологии. Включай распространенные идиомы.',
        grammar: 'Все основные времена, условные предложения, пассивный залог. Разнообразные структуры.',
        reading: 'Средней длины тексты (200-400 слов). Темы: новости, биографии, описания процессов.',
        listening: 'Нормальная скорость речи. Диалоги и монологи (1-2 мин). Различные акценты.',
        speaking: 'Свободные разговоры на повседневные темы. Описание картинок, мнения.',
        writing: 'Абзацы (5-8 предложений). Темы: письма, описания, аргументация.'
      },
      advanced: {
        vocabulary: 'Продвинутый словарь (C1-C2): академическая лексика, редкие слова, сложные идиомы.',
        grammar: 'Сложные конструкции: инверсия, сложные времена, стилистические приемы.',
        reading: 'Длинные тексты (500+ слов). Темы: академические, литературные, технические.',
        listening: 'Быстрая речь, различные акценты. Длинные монологи, лекции.',
        speaking: 'Дискуссии, дебаты, презентации. Анализ сложных тем.',
        writing: 'Эссе, статьи (200+ слов). Темы: анализ, критика, творческое письмо.'
      }
    };

    instructions.push(`ОБЩИЙ УРОВЕНЬ СЛОЖНОСТИ: ${overallComplexity.toUpperCase()} (средний Kumon уровень: ${avgLevel.toFixed(1)}, максимальный: ${maxLevel})`);

    instructions.push(`СПЕЦИАЛИЗИРОВАННЫЕ ИНСТРУКЦИИ ПО ТИПАМ ЗАДАНИЙ:`);
    instructions.push(`• Словарь: ${complexityInstructions[overallComplexity].vocabulary}`);
    instructions.push(`• Грамматика: ${complexityInstructions[overallComplexity].grammar}`);
    instructions.push(`• Чтение: ${complexityInstructions[overallComplexity].reading}`);
    instructions.push(`• Аудирование: ${complexityInstructions[overallComplexity].listening}`);
    instructions.push(`• Говорение: ${complexityInstructions[overallComplexity].speaking}`);
    instructions.push(`• Письмо: ${complexityInstructions[overallComplexity].writing}`);

    // Инструкции по прогрессии сложности
    instructions.push(`ПРОГРЕССИЯ СЛОЖНОСТИ ВНУТРИ СЕССИИ:`);
    instructions.push(`• Начни с заданий на 1 уровень ниже текущего Kumon уровня`);
    instructions.push(`• Постепенно повышай сложность на 0.5-1 уровень`);
    instructions.push(`• Закончи заданиями соответствующего текущему уровню`);

    // Особые инструкции для высоких уровней Kumon
    if (maxLevel >= 6) {
      instructions.push(`ОСОБЫЕ ИНСТРУКЦИИ ДЛЯ ПРОДВИНУТЫХ УЧАЩИХСЯ:`);
      instructions.push(`• Добавляй творческие элементы и вариации`);
      instructions.push(`• Фокус на нюансах и точности`);
      instructions.push(`• Включай культурный контекст и идиомы`);
      instructions.push(`• Предлагай альтернативные подходы к решению`);
    }

    return instructions.join('\n');
  }

  /**
   * Генерация вариативных заданий для разнообразия
   */
  private generateTaskVariations(baseTask: any, count: number = 3): any[] {
    const variations: any[] = [baseTask]; // Всегда включаем оригинал

    // Создаем вариации на основе типа задания
    const taskType = baseTask.type;

    const variationStrategies = {
      ai_practice: [
        { prompt: `${baseTask.prompt} (вариант: используй диалог)`, context: `${baseTask.context} - диалоговая форма` },
        { prompt: `${baseTask.prompt} (вариант: используй ролевую игру)`, context: `${baseTask.context} - ролевая игра` },
        { prompt: `${baseTask.prompt} (вариант: добавь творческий элемент)`, context: `${baseTask.context} - творческое задание` }
      ],
      speaking: [
        { prompt: `${baseTask.prompt} (вариант: запись видео)`, context: `${baseTask.context} - видеозапись ответа` },
        { prompt: `${baseTask.prompt} (вариант: групповой разговор)`, context: `${baseTask.context} - обсуждение в группе` },
        { prompt: `${baseTask.prompt} (вариант: презентация)`, context: `${baseTask.context} - подготовка презентации` }
      ],
      reading: [
        { prompt: `${baseTask.prompt} (вариант: с таймером)`, context: `${baseTask.context} - чтение на время` },
        { prompt: `${baseTask.prompt} (вариант: вслух)`, context: `${baseTask.context} - чтение вслух с записью` },
        { prompt: `${baseTask.prompt} (вариант: анализ)`, context: `${baseTask.context} - детальный анализ текста` }
      ],
      writing: [
        { prompt: `${baseTask.prompt} (вариант: email)`, context: `${baseTask.context} - написать email` },
        { prompt: `${baseTask.prompt} (вариант: рассказ)`, context: `${baseTask.context} - написать короткий рассказ` },
        { prompt: `${baseTask.prompt} (вариант: отзыв)`, context: `${baseTask.context} - написать отзыв` }
      ]
    };

    const availableVariations = variationStrategies[taskType] || [];
    const variationsToAdd = Math.min(count - 1, availableVariations.length);

    for (let i = 0; i < variationsToAdd; i++) {
      const variation = availableVariations[i];
      if (variation) {
        variations.push({
          type: taskType,
          prompt: variation.prompt,
          context: variation.context
        });
      }
    }

    return variations;
  }

  /**
   * Оптимизация AI промпта для лучшей генерации
   */
  private optimizeAiPrompt(basePrompt: string, context: any): string {
    let optimizedPrompt = basePrompt;

    // Добавляем контекст недавних ошибок
    if (context.recentErrors && context.recentErrors.length > 0) {
      optimizedPrompt += `\n\nКОНТЕКСТ ОШИБОК: Ученик недавно допускал ошибки в: ${context.recentErrors.join(', ')}.`;
      optimizedPrompt += ` Избегай подобных тем или добавь дополнительную практику по этим областям.`;
    }

    // Добавляем информацию о предпочтениях
    if (context.userPreferences) {
      optimizedPrompt += `\n\nПРЕДПОЧТЕНИЯ УЧЕНИКА: ${context.userPreferences}`;
    }

    // Добавляем информацию о времени
    if (context.sessionTime) {
      optimizedPrompt += `\n\nВРЕМЯ НА СЕССИЮ: ${context.sessionTime} минут. Адаптируй сложность заданий под доступное время.`;
    }

    // Добавляем инструкции по разнообразию
    optimizedPrompt += `\n\nРАЗНООБРАЗИЕ ЗАДАНИЙ: Создавай разные типы упражнений. Не повторяй одни и те же форматы.`;
    optimizedPrompt += ` Включай как структурированные задания (с инструкциями), так и свободные (креативные).`;

    return optimizedPrompt;
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
    kumonLevels?: Record<string, number>;
    shuHaRiStages?: Record<string, 'shu' | 'ha' | 'ri'>;
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

      // Добавляем Kumon уровни
      if (params.kumonLevels && Object.keys(params.kumonLevels).length > 0) {
        const kumonDescriptions = Object.entries(params.kumonLevels).map(([skill, level]) => {
          let difficulty = 'неизвестная';
          if (level <= 2) difficulty = 'базовая (начальный уровень)';
          else if (level <= 4) difficulty = 'средняя (применение)';
          else if (level <= 7) difficulty = 'продвинутая (мастерство)';
          return `${skill}: уровень ${level} (${difficulty})`;
        });

        promptParts.push(`Kumon уровни навыков: ${kumonDescriptions.join(', ')}`);
        promptParts.push(
          'ВАЖНО: Адаптируй сложность заданий под Kumon уровни! Для низких уровней (1-2) используй простые конструкции, много подсказок. Для средних (3-4) - применение в контексте. Для высоких (5-7) - свободное использование без подсказок.'
        );
      } else {
        promptParts.push('Kumon уровни неизвестны — используй стандартную сложность.');
      }

      // Добавляем Shu-Ha-Ri стадии
      if (params.shuHaRiStages && Object.keys(params.shuHaRiStages).length > 0) {
        const stageDescriptions = Object.entries(params.shuHaRiStages).map(([skill, stage]) => {
          const descriptions = {
            shu: 'строгое следование правилам, повторение основ',
            ha: 'отход от формы, понимание сути, применение в новых ситуациях',
            ri: 'трансценденция, свободное владение, творческое использование'
          };
          return `${skill}: стадия ${stage} (${descriptions[stage]})`;
        });

        promptParts.push(`Шу-Ха-Ри стадии навыков: ${stageDescriptions.join(', ')}`);
        promptParts.push(
          'ВАЖНО: Адаптируй ТИПЫ заданий под Shu-Ha-Ri стадии! ' +
          'Для навыков в стадии ШУ: задания на повторение основ, drill упражнения, много подсказок. ' +
          'Для навыков в стадии ХА: задания на применение в новых контекстах, понимание сути, средняя поддержка. ' +
          'Для навыков в стадии РИ: свободные творческие задания, минимум подсказок, фокус на fluency.'
        );
      } else {
        promptParts.push('Shu-Ha-Ri стадии неизвестны — используй сбалансированные типы заданий.');
      }

      // Специализированные инструкции по сложности
      promptParts.push(this.getComplexityInstructions(params.kumonLevels, params.shuHaRiStages));

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

      // Оптимизируем промпт перед отправкой
      const basePrompt = promptParts.join('\n');
      const optimizedPrompt = this.optimizeAiPrompt(basePrompt, {
        recentErrors: params.snapshotInsights?.problemAreas?.slice(0, 3).map(p => p.content) || [],
        userPreferences: params.user?.preferences || null,
        sessionTime: params.stageProgress?.expected_duration_minutes || 60
      });

      const prompt = optimizedPrompt;

      const response = await generateJSON<DailyPlanAiSummary>(prompt, { systemPrompt });

      // Добавляем вариативность к заданиям
      let aiTasks = response.aiTasks ?? [];
      if (aiTasks.length > 0) {
        const variedTasks: any[] = [];
        for (const task of aiTasks) {
          // Для каждого задания создаем 2-3 вариации
          const variations = this.generateTaskVariations(task, 2);
          variedTasks.push(...variations);
        }
        aiTasks = variedTasks.slice(0, Math.min(6, variedTasks.length)); // Ограничиваем до 6 заданий
      }

      return {
        summary: response.summary,
        focus: response.focus ?? [],
        motivation: response.motivation,
        aiTasks,
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
      const stage = snapshotInsights.shuHaRi.stage;
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

    const reviewReminders: string[] = [];
    if (snapshotInsights?.sm2Schedule.dueToday && snapshotInsights.sm2Schedule.dueToday > 0) {
      reviewReminders.push(`Active Recall: ${snapshotInsights.sm2Schedule.dueToday} карточек ждут повторения`);
    }

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

    // Адаптируем новый SnapshotInsights к старому формату для MethodologyAdvisor
    const adaptedInsights = this.adaptSnapshotInsights(params.insights);
    const advisor = new MethodologyAdvisor(adaptedInsights);
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

  /**
   * Получает текущие Shu-Ha-Ri стадии пользователя для всех навыков
   */
  private async getUserShuHaRiStages(userId: string): Promise<Record<string, 'shu' | 'ha' | 'ri'>> {
    try {
      const { ShuHaRiService } = await import('@/lib/lesson-snapshots');
      const shuHaRiService = new ShuHaRiService(this.hasyx);

      return await shuHaRiService.getUserShuHaRiStages(userId);
    } catch (error) {
      console.warn(`⚠️ Failed to get Shu-Ha-Ri stages for user ${userId}:`, error);
      return {};
    }
  }

  /**
   * Получает текущие Kumon уровни пользователя для всех навыков
   */
  private async getUserKumonLevels(userId: string): Promise<Record<string, number>> {
    try {
      const kumonProgress = await this.hasyx.select({
        table: 'kumon_progress',
        where: { user_id: { _eq: userId } },
        returning: ['skill_category', 'skill_subcategory', 'current_level'],
        order_by: [{ last_practiced_at: 'desc' }]
      });

      const levels: Record<string, number> = {};
      const progressList = Array.isArray(kumonProgress) ? kumonProgress : kumonProgress ? [kumonProgress] : [];

      for (const progress of progressList) {
        const skillKey = progress.skill_subcategory
          ? `${progress.skill_category}_${progress.skill_subcategory}`
          : progress.skill_category;

        levels[skillKey] = progress.current_level || 1;
      }

      console.log(`📊 Kumon levels for user ${userId}:`, levels);
      return levels;

    } catch (error) {
      console.warn(`⚠️ Failed to get Kumon levels for user ${userId}:`, error);
      return {};
    }
  }
}


