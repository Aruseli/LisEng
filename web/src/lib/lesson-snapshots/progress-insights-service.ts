import type { Hasyx } from '@/lib/hasura/compat';
import { getAllStates, MASTERY_STABILITY_DAYS } from '@/lib/srs';
import { LessonSnapshotService } from './lesson-snapshot-service';
import { ShuHaRiService } from './shu-ha-ri-service';
import { ScheduleService } from '@/lib/schedule/schedule-service';

export interface ProgressInsights {
  // Kumon insights
  kumon: {
    currentLevels: Record<string, number>;
    progressTrend: 'improving' | 'stable' | 'declining';
    weakSkills: string[];
    strongSkills: string[];
    recommendedFocus: string[];
  };

  // Active Recall insights
  activeRecall: {
    totalSessions: number;
    dueCards: number;
    masteryRate: number;
    difficultWords: string[];
    reviewEfficiency: number;
  };

  // Shu-Ha-Ri insights
  shuHaRi: {
    currentStage: 'shu' | 'ha' | 'ri';
    progressToNext: number; // 0-100%
    stageDuration: number; // days
    recommendedTransition: boolean;
    nextTestDate?: string;
  };

  // Kaizen insights
  kaizen: {
    accuracyTrend: 'improving' | 'stable' | 'declining';
    speedTrend: 'improving' | 'stable' | 'declining';
    consistencyScore: number; // 0-100
    recentImprovements: string[];
    areasForImprovement: string[];
  };

  // Overall insights
  overall: {
    learningStreak: number;
    totalSessions: number;
    averageSessionDuration: number;
    motivationLevel: 'high' | 'medium' | 'low';
    recommendedActions: string[];
  };
}

export interface SnapshotInsights {
  problemAreas: Array<{
    content: string;
    severity: 'low' | 'medium' | 'high';
    frequency: number;
  }>;
  kaizenMomentum: {
    accuracyDelta: number;
    speedDelta: number;
    overall: 'positive' | 'neutral' | 'negative';
  };
  shuHaRi: {
    stage: 'shu' | 'ha' | 'ri';
    readinessForNext: number; // 0-100%
  };
  sm2Schedule: {
    dueToday: number;
    dueThisWeek: number;
    overdue: number;
  };
  methodologyHighlights: string[];
}

export class ProgressInsightsService {
  constructor(
    private readonly hasyx: Hasyx,
    private readonly lessonSnapshotService: LessonSnapshotService,
    private readonly shuHaRiService: ShuHaRiService,
    private readonly scheduleService: ScheduleService
  ) {}

  /**
   * Получить полную картину прогресса пользователя
   */
  async getProgressInsights(userId: string): Promise<ProgressInsights> {
    console.log(`📊 Generating progress insights for user ${userId}`);

    // Параллельные запросы для оптимизации
    const [
      kumonInsights,
      activeRecallInsights,
      shuHaRiInsights,
      kaizenInsights,
      overallInsights
    ] = await Promise.all([
      this.analyzeKumonProgress(userId),
      this.analyzeActiveRecallProgress(userId),
      this.analyzeShuHaRiProgress(userId),
      this.analyzeKaizenProgress(userId),
      this.analyzeOverallProgress(userId)
    ]);

    return {
      kumon: kumonInsights,
      activeRecall: activeRecallInsights,
      shuHaRi: shuHaRiInsights,
      kaizen: kaizenInsights,
      overall: overallInsights
    };
  }

  /**
   * Получить инсайты для генерации плана на основе слепков
   */
  async getSnapshotInsights(userId: string, days: number = 30): Promise<SnapshotInsights | null> {
    console.log(`🔍 Generating snapshot insights for user ${userId} (${days} days)`);

    try {
      // Получить недавние слепки
      const recentSnapshots = await this.hasyx.select({
        table: 'lesson_snapshots',
        where: {
          user_id: { _eq: userId },
          lesson_date: { _gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() }
        },
        returning: ['problem_areas', 'kaizen_metrics', 'created_at'],
        order_by: [{ lesson_date: 'desc' }],
        limit: 50
      });

      if (!recentSnapshots || recentSnapshots.length === 0) {
        return null;
      }

      const problemAreas = this.aggregateProblemAreas(recentSnapshots);
      const kaizenMomentum = this.calculateKaizenMomentum(recentSnapshots);
      const shuHaRi = await this.getCurrentShuHaRiStage(userId);
      const sm2Schedule = await this.getActiveRecallSchedule(userId);

      const methodologyHighlights = this.generateMethodologyHighlights(
        problemAreas,
        kaizenMomentum,
        shuHaRi,
        sm2Schedule
      );

      return {
        problemAreas,
        kaizenMomentum,
        shuHaRi,
        sm2Schedule,
        methodologyHighlights
      };
    } catch (error) {
      console.warn('⚠️ Failed to generate snapshot insights:', error);
      return null;
    }
  }

  /**
   * Анализ прогресса Kumon
   */
  private async analyzeKumonProgress(userId: string): Promise<ProgressInsights['kumon']> {
    const kumonProgress = await this.hasyx.select({
      table: 'kumon_progress',
      where: { user_id: { _eq: userId } },
      returning: [
        'skill_category',
        'skill_subcategory',
        'current_level',
        'consecutive_correct',
        'accuracy_rate',
        'last_practiced_at'
      ]
    });

    const currentLevels: Record<string, number> = {};
    const skillStats: Array<{ skill: string; level: number; accuracy: number }> = [];

    kumonProgress.forEach((progress: any) => {
      const skill = progress.skill_subcategory || progress.skill_category;
      currentLevels[skill] = progress.current_level || 1;
      skillStats.push({
        skill,
        level: progress.current_level || 1,
        accuracy: progress.accuracy_rate || 0
      });
    });

    // Анализ тренда прогресса
    const progressTrend = this.calculateProgressTrend(skillStats);

    // Определение слабых и сильных навыков
    const weakSkills = skillStats
      .filter(s => s.level <= 2 || s.accuracy < 0.7)
      .map(s => s.skill);

    const strongSkills = skillStats
      .filter(s => s.level >= 5 && s.accuracy >= 0.9)
      .map(s => s.skill);

    // Рекомендации по фокусу
    const recommendedFocus = this.generateKumonFocusRecommendations(weakSkills, currentLevels);

    return {
      currentLevels,
      progressTrend,
      weakSkills,
      strongSkills,
      recommendedFocus
    };
  }

  /**
   * Анализ прогресса Active Recall (FSRS: srs_state — источник истины)
   */
  private async analyzeActiveRecallProgress(userId: string): Promise<ProgressInsights['activeRecall']> {
    const today = new Date().toISOString().split('T')[0];
    const [states, history] = await Promise.all([
      getAllStates(this.hasyx, userId, 'vocabulary_card'),
      this.hasyx.select({
        table: 'review_history',
        where: { user_id: { _eq: userId } },
        returning: ['was_correct']
      })
    ]);

    const totalSessions = Array.isArray(history) ? history.length : history ? 1 : 0;
    const totalCards = states.length;

    if (totalCards === 0) {
      return {
        totalSessions,
        dueCards: 0,
        masteryRate: 0,
        difficultWords: [],
        reviewEfficiency: 0
      };
    }

    // Карточки к повторению (due <= сегодня)
    const dueCards = states.filter((s) => s.due <= today).length;

    // Уровень освоения: доля карточек с stability >= 30 дней
    const masteredCount = states.filter((s) => s.stability >= MASTERY_STABILITY_DAYS).length;
    const masteryRate = Math.round((masteredCount / totalCards) * 100);

    // Сложные слова: топ-5 по FSRS difficulty
    const hardest = states
      .slice()
      .sort((a, b) => b.difficulty - a.difficulty)
      .slice(0, 5);
    let difficultWords: string[] = [];
    if (hardest.length > 0) {
      const words = await this.hasyx.select({
        table: 'vocabulary_cards',
        where: { id: { _in: hardest.map((s) => s.item_id) } },
        returning: ['id', 'word']
      });
      const wordById = new Map(
        (Array.isArray(words) ? words : words ? [words] : []).map((w: any) => [w.id, w.word])
      );
      difficultWords = hardest.map((s) => wordById.get(s.item_id)).filter(Boolean) as string[];
    }

    // Эффективность повторений: доля правильных ответов в истории
    const historyList = Array.isArray(history) ? history : history ? [history] : [];
    const totalCorrect = historyList.filter((h: any) => h.was_correct).length;
    const reviewEfficiency = historyList.length > 0 ? totalCorrect / historyList.length : 0;

    return {
      totalSessions,
      dueCards,
      masteryRate,
      difficultWords,
      reviewEfficiency: Math.round(reviewEfficiency * 100)
    };
  }

  /**
   * Анализ прогресса Shu-Ha-Ri
   */
  private async analyzeShuHaRiProgress(userId: string): Promise<ProgressInsights['shuHaRi']> {
    const progress = await this.hasyx.select({
      table: 'shu_ha_ri_progress',
      where: { user_id: { _eq: userId } },
      returning: ['stage', 'shu_started_at', 'ha_started_at', 'ri_achieved_at', 'updated_at', 'shu_accuracy', 'shu_mastery_count', 'ha_understanding_score', 'ha_creative_applications'],
      order_by: [{ updated_at: 'desc' }],
      limit: 1
    });

    if (!progress || progress.length === 0) {
      return {
        currentStage: 'shu',
        progressToNext: 0,
        stageDuration: 0,
        recommendedTransition: false
      };
    }

    const currentProgress = progress[0];
    const currentStage = currentProgress.stage || 'shu';
    
    // Определяем дату начала текущей стадии
    let stageStartDate: Date;
    if (currentStage === 'shu' && currentProgress.shu_started_at) {
      stageStartDate = new Date(currentProgress.shu_started_at);
    } else if (currentStage === 'ha' && currentProgress.ha_started_at) {
      stageStartDate = new Date(currentProgress.ha_started_at);
    } else if (currentStage === 'ri' && currentProgress.ri_achieved_at) {
      stageStartDate = new Date(currentProgress.ri_achieved_at);
    } else {
      stageStartDate = new Date(currentProgress.updated_at || Date.now());
    }
    const stageDuration = Math.floor((Date.now() - stageStartDate.getTime()) / (1000 * 60 * 60 * 24));

    // Расчет прогресса к следующей стадии
    const progressToNext = this.calculateProgressToNextStage(currentProgress);

    // Проверка готовности к переходу
    const recommendedTransition = progressToNext >= 85 && stageDuration >= 7;

    // Следующий тест
    const nextTestDate = await this.getNextShuHaRiTestDate(userId);

    return {
      currentStage,
      progressToNext,
      stageDuration,
      recommendedTransition,
      nextTestDate
    };
  }

  /**
   * Анализ Kaizen метрик
   */
  private async analyzeKaizenProgress(userId: string): Promise<ProgressInsights['kaizen']> {
    const recentSnapshots = await this.hasyx.select({
      table: 'lesson_snapshots',
      where: {
        user_id: { _eq: userId },
        lesson_date: { _gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      },
      returning: ['kaizen_metrics', 'lesson_date'],
      order_by: [{ lesson_date: 'asc' }]
    });

    if (!recentSnapshots || recentSnapshots.length < 2) {
      return {
        accuracyTrend: 'stable',
        speedTrend: 'stable',
        consistencyScore: 50,
        recentImprovements: [],
        areasForImprovement: []
      };
    }

    // Анализ трендов
    const accuracyTrend = this.calculateAccuracyTrend(recentSnapshots);
    const speedTrend = this.calculateSpeedTrend(recentSnapshots);
    const consistencyScore = this.calculateConsistencyScore(recentSnapshots);

    // Недавние улучшения и области для улучшения
    const improvements = this.identifyRecentImprovements(recentSnapshots);
    const areasForImprovement = this.identifyAreasForImprovement(recentSnapshots);

    return {
      accuracyTrend,
      speedTrend,
      consistencyScore,
      recentImprovements: improvements,
      areasForImprovement: areasForImprovement
    };
  }

  /**
   * Общий анализ прогресса
   */
  private async analyzeOverallProgress(userId: string): Promise<ProgressInsights['overall']> {
    const [sessions, streak] = await Promise.all([
      this.hasyx.select({
        table: 'ai_sessions',
        where: { user_id: { _eq: userId } },
        returning: ['created_at', 'duration_seconds']
      }),
      this.hasyx.select({
        table: 'user_streaks',
        where: { user_id: { _eq: userId } },
        returning: ['current_streak', 'longest_streak'],
        limit: 1
      })
    ]);

    const totalSessions = sessions.length;
    const learningStreak = streak?.[0]?.current_streak || 0;

    // Средняя продолжительность сессии
    const totalDuration = sessions.reduce((sum: number, session: any) =>
      sum + (session.duration_seconds || 0), 0);
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Уровень мотивации на основе активности
    const recentSessions = sessions.filter((session: any) => {
      const sessionDate = new Date(session.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo;
    });

    let motivationLevel: 'high' | 'medium' | 'low';
    if (recentSessions.length >= 5) motivationLevel = 'high';
    else if (recentSessions.length >= 2) motivationLevel = 'low';
    else motivationLevel = 'low';

    // Рекомендуемые действия
    const recommendedActions = this.generateRecommendedActions({
      streak: learningStreak,
      recentActivity: recentSessions.length,
      totalSessions
    });

    return {
      learningStreak,
      totalSessions,
      averageSessionDuration: Math.round(averageSessionDuration / 60), // в минутах
      motivationLevel,
      recommendedActions
    };
  }

  // Вспомогательные методы для расчетов

  private aggregateProblemAreas(snapshots: any[]): Array<{ content: string; severity: 'low' | 'medium' | 'high'; frequency: number }> {
    const problemMap = new Map<string, { severity: 'low' | 'medium' | 'high'; count: number }>();

    snapshots.forEach(snapshot => {
      const problems = snapshot.problem_areas || [];
      problems.forEach((problem: any) => {
        const key = `${problem.content}_${problem.severity}`;
        const existing = problemMap.get(key);
        // Проверяем и нормализуем severity
        const severity: 'low' | 'medium' | 'high' = ['low', 'medium', 'high'].includes(problem.severity)
          ? problem.severity
          : 'medium'; // default to medium if invalid
        problemMap.set(key, {
          severity,
          count: (existing?.count || 0) + 1
        });
      });
    });

    return Array.from(problemMap.entries()).map(([key, data]) => ({
      content: key.split('_')[0],
      severity: data.severity,
      frequency: data.count
    })).sort((a, b) => b.frequency - a.frequency);
  }

  private calculateKaizenMomentum(snapshots: any[]): SnapshotInsights['kaizenMomentum'] {
    if (snapshots.length < 2) {
      return { accuracyDelta: 0, speedDelta: 0, overall: 'neutral' };
    }

    const first = snapshots[0]?.kaizen_metrics || {};
    const last = snapshots[snapshots.length - 1]?.kaizen_metrics || {};

    const accuracyDelta = (last.accuracy_rate || 0) - (first.accuracy_rate || 0);
    const speedDelta = (last.avg_response_time || 0) - (first.avg_response_time || 0);

    let overall: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (accuracyDelta > 0.05 || speedDelta < -0.1) overall = 'positive';
    if (accuracyDelta < -0.05 || speedDelta > 0.1) overall = 'negative';

    return { accuracyDelta, speedDelta, overall };
  }

  private async getCurrentShuHaRiStage(userId: string): Promise<SnapshotInsights['shuHaRi']> {
    const progress = await this.hasyx.select({
      table: 'shu_ha_ri_progress',
      where: { user_id: { _eq: userId } },
      returning: ['stage', 'updated_at', 'shu_accuracy', 'shu_mastery_count', 'ha_understanding_score', 'ha_creative_applications'],
      order_by: [{ updated_at: 'desc' }],
      limit: 1
    });

    if (!progress || progress.length === 0) {
      return { stage: 'shu', readinessForNext: 0 };
    }

    const current = progress[0];
    const readinessForNext = this.calculateProgressToNextStage(current);

    return {
      stage: current.stage || 'shu',
      readinessForNext
    };
  }

  private async getActiveRecallSchedule(userId: string): Promise<SnapshotInsights['sm2Schedule']> {
    // FSRS: due из srs_state (источник истины)
    const states = await getAllStates(this.hasyx, userId, 'vocabulary_card');

    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let dueToday = 0;
    let dueThisWeek = 0;
    let overdue = 0;

    states.forEach((state) => {
      if (state.due < today) {
        overdue++;
      } else if (state.due === today) {
        dueToday++;
      } else if (state.due <= weekFromNow) {
        dueThisWeek++;
      }
    });

    return { dueToday, dueThisWeek, overdue };
  }

  private generateMethodologyHighlights(
    problemAreas: any[],
    kaizenMomentum: any,
    shuHaRi: any,
    sm2Schedule: any
  ): string[] {
    const highlights: string[] = [];

    if (problemAreas.length > 0) {
      highlights.push(`Проблемные области: ${problemAreas.slice(0, 3).map(p => p.content).join(', ')}`);
    }

    if (kaizenMomentum.overall === 'positive') {
      highlights.push('Положительная динамика Кайдзен - продолжай в том же духе!');
    } else if (kaizenMomentum.overall === 'negative') {
      highlights.push('Нужен дополнительный фокус на Кайдзен метриках');
    }

    highlights.push(`Текущая стадия Shu-Ha-Ri: ${shuHaRi.stage} (${shuHaRi.readinessForNext}% готовности к следующей)`);

    if (sm2Schedule.overdue > 0) {
      highlights.push(`Просрочено повторений: ${sm2Schedule.overdue} - нужно наверстать`);
    }

    return highlights;
  }

  private calculateProgressTrend(skillStats: Array<{ skill: string; level: number; accuracy: number }>): 'improving' | 'stable' | 'declining' {
    const avgLevel = skillStats.reduce((sum, s) => sum + s.level, 0) / skillStats.length;
    const avgAccuracy = skillStats.reduce((sum, s) => sum + s.accuracy, 0) / skillStats.length;

    if (avgLevel >= 4 && avgAccuracy >= 0.8) return 'improving';
    if (avgLevel <= 2 || avgAccuracy <= 0.6) return 'declining';
    return 'stable';
  }

  private generateKumonFocusRecommendations(weakSkills: string[], currentLevels: Record<string, number>): string[] {
    const recommendations: string[] = [];

    if (weakSkills.length > 0) {
      recommendations.push(`Укрепить навыки: ${weakSkills.join(', ')}`);
    }

    // Найти навыки, которые можно поднять на следующий уровень
    const readyForNext = Object.entries(currentLevels)
      .filter(([skill, level]) => level >= 3 && level < 7 && !weakSkills.includes(skill))
      .map(([skill]) => skill);

    if (readyForNext.length > 0) {
      recommendations.push(`Развить дальше: ${readyForNext.join(', ')}`);
    }

    return recommendations;
  }

  private calculateProgressToNextStage(progress: any): number {
    const stage = progress.stage || 'shu';
    
    // Расчёт прогресса на основе метрик для каждой стадии
    if (stage === 'shu') {
      const accuracy = progress.shu_accuracy ?? 0;
      const masteryCount = progress.shu_mastery_count ?? 0;
      // Прогресс к Ha: нужна точность >= 80% и минимум 10 освоенных элементов
      const accuracyProgress = Math.min(100, (accuracy / 0.8) * 50);
      const masteryProgress = Math.min(50, (masteryCount / 10) * 50);
      return Math.min(100, accuracyProgress + masteryProgress);
    }
    
    if (stage === 'ha') {
      const understanding = progress.ha_understanding_score ?? 0;
      const creative = progress.ha_creative_applications ?? 0;
      // Прогресс к Ri: понимание >= 85% и креативное применение >= 5
      const understandingProgress = Math.min(50, (understanding / 0.85) * 50);
      const creativeProgress = Math.min(50, (creative / 5) * 50);
      return Math.min(100, understandingProgress + creativeProgress);
    }
    
    if (stage === 'ri') {
      // На стадии Ri прогресс уже 100%
      return 100;
    }
    
    return 0;
  }

  private async getNextShuHaRiTestDate(userId: string): Promise<string | undefined> {
    const schedules = await this.scheduleService.getUserSchedules(userId);
    const shuHaRiSchedule = schedules.find(s => s.meta?.type === 'shu_ha_ri_test');

    if (shuHaRiSchedule) {
      const nextEvent = await this.hasyx.select({
        table: 'events',
        where: {
          schedule_id: { _eq: shuHaRiSchedule.id },
          status: { _eq: 'pending' }
        },
        returning: ['plan_start'],
        order_by: [{ plan_start: 'asc' }],
        limit: 1
      });

      if (nextEvent && nextEvent.length > 0) {
        return new Date(nextEvent[0].plan_start * 1000).toISOString();
      }
    }

    return undefined;
  }

  private calculateAccuracyTrend(snapshots: any[]): 'improving' | 'stable' | 'declining' {
    if (snapshots.length < 3) return 'stable';

    const recent = snapshots.slice(-3);
    const older = snapshots.slice(-6, -3);

    const recentAvg = recent.reduce((sum, s) => sum + (s.kaizen_metrics?.accuracy_rate || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.kaizen_metrics?.accuracy_rate || 0), 0) / older.length;

    const diff = recentAvg - olderAvg;
    if (diff > 0.05) return 'improving';
    if (diff < -0.05) return 'declining';
    return 'stable';
  }

  private calculateSpeedTrend(snapshots: any[]): 'improving' | 'stable' | 'declining' {
    if (snapshots.length < 3) return 'stable';

    const recent = snapshots.slice(-3);
    const older = snapshots.slice(-6, -3);

    const recentAvg = recent.reduce((sum, s) => sum + (s.kaizen_metrics?.avg_response_time || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.kaizen_metrics?.avg_response_time || 0), 0) / older.length;

    const diff = olderAvg - recentAvg; // положительная разница = улучшение скорости
    if (diff > 0.1) return 'improving';
    if (diff < -0.1) return 'declining';
    return 'stable';
  }

  private calculateConsistencyScore(snapshots: any[]): number {
    if (snapshots.length < 5) return 50;

    const accuracies = snapshots.map(s => s.kaizen_metrics?.accuracy_rate || 0);
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length;
    const stdDev = Math.sqrt(variance);

    // Чем меньше стандартное отклонение, тем выше consistency
    const consistency = Math.max(0, 100 - (stdDev * 200));
    return Math.round(consistency);
  }

  private identifyRecentImprovements(snapshots: any[]): string[] {
    const improvements: string[] = [];

    if (snapshots.length >= 2) {
      const latest = snapshots[snapshots.length - 1];
      const previous = snapshots[snapshots.length - 2];

      const latestMetrics = latest.kaizen_metrics || {};
      const previousMetrics = previous.kaizen_metrics || {};

      if ((latestMetrics.accuracy_rate || 0) > (previousMetrics.accuracy_rate || 0) + 0.05) {
        improvements.push('Точность ответов улучшилась');
      }

      if ((previousMetrics.avg_response_time || 0) > (latestMetrics.avg_response_time || 0) + 0.1) {
        improvements.push('Скорость ответа увеличилась');
      }
    }

    return improvements;
  }

  private identifyAreasForImprovement(snapshots: any[]): string[] {
    const areas: string[] = [];

    if (snapshots.length >= 3) {
      const recent = snapshots.slice(-3);
      const avgAccuracy = recent.reduce((sum, s) => sum + (s.kaizen_metrics?.accuracy_rate || 0), 0) / recent.length;

      if (avgAccuracy < 0.7) {
        areas.push('Нужно улучшить точность ответов');
      }

      const avgSpeed = recent.reduce((sum, s) => sum + (s.kaizen_metrics?.avg_response_time || 0), 0) / recent.length;
      if (avgSpeed > 30) { // больше 30 секунд в среднем
        areas.push('Можно ускорить время ответа');
      }
    }

    return areas;
  }

  private generateRecommendedActions(context: { streak: number; recentActivity: number; totalSessions: number }): string[] {
    const actions: string[] = [];

    if (context.streak === 0) {
      actions.push('Возобновить обучение - начни с короткой сессии');
    } else if (context.streak >= 7) {
      actions.push('Отличная серия! Продолжай в том же духе');
    }

    if (context.recentActivity < 3) {
      actions.push('Увеличь частоту занятий до 3-5 раз в неделю');
    }

    if (context.totalSessions < 10) {
      actions.push('Набери больше опыта - цель 50+ завершенных сессий');
    }

    return actions;
  }
}
