import { Hasyx } from 'hasyx';
import type { ProblemArea } from './lesson-snapshot-service';

export interface SnapshotInsightsOptions {
  snapshotLimit?: number;
  problemAreaLimit?: number;
  recallLimit?: number;
  shuHaRiSkillLimit?: number;
  upcomingDays?: number;
  referenceDate?: string;
}

export interface ProblemAreaSummary extends ProblemArea {
  lessonTypes: string[];
  frequency: number;
  lastSeen: string | null;
}

export interface KaizenMomentumSummary {
  accuracyDeltaAvg: number;
  speedDeltaAvg: number;
  mistakesReducedTotal: number;
  trend: 'improving' | 'stable' | 'regressing';
}

export interface ActiveRecallSummary {
  id: string;
  recallType: string;
  contextPrompt: string;
  correctResponse: string;
  nextReviewDate: string;
  intervalDays: number;
  easeFactor: number | null;
  due: boolean;
}

export interface ActiveRecallScheduleSummary {
  dueTodayCount: number;
  upcomingCount: number;
  dueToday: ActiveRecallSummary[];
  upcoming: ActiveRecallSummary[];
}

export interface ShuHaRiSkillSummary {
  skillId: string;
  skillType: string;
  stage: 'shu' | 'ha' | 'ri';
  readinessScore: number;
  lastStageChangeAt?: string | null;
}

export interface ShuHaRiStageSummary {
  dominantStage: 'shu' | 'ha' | 'ri';
  skills: ShuHaRiSkillSummary[];
  recommendations: string[];
  pendingTestRecommended: boolean;
}

export interface SnapshotInsights {
  referenceDate: string;
  problemAreas: ProblemAreaSummary[];
  kaizenMomentum: KaizenMomentumSummary;
  masteryDistribution: Record<string, number>;
  shuHaRi: ShuHaRiStageSummary | null;
  sm2Schedule: ActiveRecallScheduleSummary;
  methodologyHighlights: string[];
}

interface SnapshotRecord {
  id: string;
  lesson_type: string;
  lesson_date: string;
  problem_areas?: ProblemArea[] | null;
  kaizen_metrics?: {
    accuracyDelta?: number;
    speedDelta?: number;
    mistakesReduced?: number;
  } | null;
  mastery_level?: string | null;
}

interface ShuHaRiProgressRecord {
  id: string;
  skill_id: string;
  skill_type: string;
  stage: 'shu' | 'ha' | 'ri';
  shu_mastery_count?: number | null;
  ha_understanding_score?: number | null;
  ri_fluency_score?: number | null;
  updated_at?: string | null;
}

interface ActiveRecallRecord {
  id: string;
  recall_type: string;
  context_prompt: string;
  correct_response: string;
  next_review_date: string;
  interval_days: number;
  ease_factor?: number | null;
}

export class SnapshotInsightsService {
  constructor(private readonly hasyx: Hasyx) {}

  async getInsights(userId: string, options?: SnapshotInsightsOptions): Promise<SnapshotInsights> {
    if (!userId) {
      throw new Error('userId is required to get snapshot insights');
    }

    const opts: Required<Omit<SnapshotInsightsOptions, 'referenceDate'>> & { referenceDate: string } = {
      snapshotLimit: options?.snapshotLimit ?? 10,
      problemAreaLimit: options?.problemAreaLimit ?? 5,
      recallLimit: options?.recallLimit ?? 25,
      shuHaRiSkillLimit: options?.shuHaRiSkillLimit ?? 5,
      upcomingDays: options?.upcomingDays ?? 7,
      referenceDate: options?.referenceDate ?? this.formatDate(new Date()),
    };

    const upcomingBoundary = this.addDays(opts.referenceDate, opts.upcomingDays);

    const [snapshotRaw, shuHaRiProgressRaw, activeRecallRaw] = await Promise.all([
      this.hasyx.select({
        table: 'lesson_snapshots',
        where: {
          user_id: { _eq: userId },
        },
        order_by: [{ lesson_date: 'desc' }],
        limit: opts.snapshotLimit,
        returning: ['id', 'lesson_type', 'lesson_date', 'problem_areas', 'kaizen_metrics', 'mastery_level'],
      }),
      this.hasyx.select({
        table: 'shu_ha_ri_progress',
        where: {
          user_id: { _eq: userId },
        },
        returning: [
          'id',
          'skill_id',
          'skill_type',
          'stage',
          'shu_mastery_count',
          'ha_understanding_score',
          'ri_fluency_score',
          'updated_at',
        ],
      }),
      this.hasyx.select({
        table: 'active_recall_sessions',
        where: {
          user_id: { _eq: userId },
          next_review_date: { _lte: upcomingBoundary },
        },
        order_by: [{ next_review_date: 'asc' }],
        limit: opts.recallLimit,
        returning: ['id', 'recall_type', 'context_prompt', 'correct_response', 'next_review_date', 'interval_days', 'ease_factor'],
      }),
    ]);

    const snapshots = this.normalizeRecords<SnapshotRecord>(snapshotRaw);
    const shuHaRiProgress = this.normalizeRecords<ShuHaRiProgressRecord>(shuHaRiProgressRaw);
    const activeRecalls = this.normalizeRecords<ActiveRecallRecord>(activeRecallRaw);

    const problemAreas = this.buildProblemAreaSummary(snapshots, opts.problemAreaLimit);
    const kaizenMomentum = this.buildKaizenMomentumSummary(snapshots);
    const masteryDistribution = this.buildMasteryDistribution(snapshots);
    const shuHaRi = this.buildShuHaRiSummary(shuHaRiProgress, opts.shuHaRiSkillLimit);
    const sm2Schedule = this.buildActiveRecallSchedule(activeRecalls, opts.referenceDate);
    const methodologyHighlights = this.buildMethodologyHighlights(problemAreas, shuHaRi, sm2Schedule);

    return {
      referenceDate: opts.referenceDate,
      problemAreas,
      kaizenMomentum,
      masteryDistribution,
      shuHaRi,
      sm2Schedule,
      methodologyHighlights,
    };
  }

  private buildProblemAreaSummary(snapshots: SnapshotRecord[], limit: number): ProblemAreaSummary[] {
    const buckets = new Map<string, ProblemAreaSummary>();

    for (const snapshot of snapshots) {
      const areas = (snapshot.problem_areas as ProblemArea[] | undefined) ?? [];
      for (const area of areas) {
        const key = `${area.type}:${area.content}`;
        const existing = buckets.get(key);
        const lastSeen = snapshot.lesson_date || null;

        if (existing) {
          existing.frequency += 1;
          if (lastSeen && (!existing.lastSeen || new Date(lastSeen) > new Date(existing.lastSeen))) {
            existing.lastSeen = lastSeen;
          }
          if (snapshot.lesson_type && !existing.lessonTypes.includes(snapshot.lesson_type)) {
            existing.lessonTypes.push(snapshot.lesson_type);
          }
        } else {
          buckets.set(key, {
            ...area,
            lessonTypes: snapshot.lesson_type ? [snapshot.lesson_type] : [],
            frequency: 1,
            lastSeen,
          });
        }
      }
    }

    return Array.from(buckets.values())
      .sort((a, b) => {
        if (a.severity !== b.severity) {
          return this.severityRank(b.severity) - this.severityRank(a.severity);
        }
        if (b.frequency !== a.frequency) {
          return b.frequency - a.frequency;
        }
        return (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '');
      })
      .slice(0, limit);
  }

  private buildKaizenMomentumSummary(snapshots: SnapshotRecord[]): KaizenMomentumSummary {
    if (snapshots.length === 0) {
      return {
        accuracyDeltaAvg: 0,
        speedDeltaAvg: 0,
        mistakesReducedTotal: 0,
        trend: 'stable',
      };
    }

    let accuracySum = 0;
    let accuracyCount = 0;
    let speedSum = 0;
    let speedCount = 0;
    let mistakesReducedTotal = 0;

    for (const snapshot of snapshots) {
      const metrics = snapshot.kaizen_metrics || {};
      if (typeof metrics.accuracyDelta === 'number') {
        accuracySum += metrics.accuracyDelta;
        accuracyCount++;
      }
      if (typeof metrics.speedDelta === 'number') {
        speedSum += metrics.speedDelta;
        speedCount++;
      }
      if (typeof metrics.mistakesReduced === 'number') {
        mistakesReducedTotal += metrics.mistakesReduced;
      }
    }

    const accuracyDeltaAvg = accuracyCount > 0 ? accuracySum / accuracyCount : 0;
    const speedDeltaAvg = speedCount > 0 ? speedSum / speedCount : 0;

    let trend: KaizenMomentumSummary['trend'] = 'stable';
    if (accuracyDeltaAvg > 0.05 || speedDeltaAvg > 5) {
      trend = 'improving';
    } else if (accuracyDeltaAvg < -0.05) {
      trend = 'regressing';
    }

    return {
      accuracyDeltaAvg,
      speedDeltaAvg,
      mistakesReducedTotal,
      trend,
    };
  }

  private buildMasteryDistribution(snapshots: SnapshotRecord[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    for (const snapshot of snapshots) {
      const key = snapshot.mastery_level || 'unknown';
      distribution[key] = (distribution[key] ?? 0) + 1;
    }
    return distribution;
  }

  private buildShuHaRiSummary(
    progressRecords: ShuHaRiProgressRecord[],
    limit: number
  ): ShuHaRiStageSummary | null {
    if (progressRecords.length === 0) {
      return null;
    }

    const stageCounts: Record<'shu' | 'ha' | 'ri', number> = { shu: 0, ha: 0, ri: 0 };
    const skills: ShuHaRiSkillSummary[] = [];

    for (const record of progressRecords) {
      stageCounts[record.stage]++;
      if (skills.length < limit) {
        skills.push({
          skillId: record.skill_id,
          skillType: record.skill_type,
          stage: record.stage,
          readinessScore:
            record.stage === 'shu'
              ? (record.shu_mastery_count ?? 0) / 5
              : record.stage === 'ha'
                ? record.ha_understanding_score ?? 0
                : record.ri_fluency_score ?? 0,
          lastStageChangeAt: record.updated_at || null,
        });
      }
    }

    const dominantStage = (Object.entries(stageCounts) as Array<[ShuHaRiStageSummary['dominantStage'], number]>)
      .sort((a, b) => b[1] - a[1])[0][0];

    const pendingTestRecommended = dominantStage !== 'ri' && stageCounts[dominantStage] >= 3;

    const recommendations = this.getShuHaRiRecommendations(dominantStage);

    return {
      dominantStage,
      skills,
      recommendations,
      pendingTestRecommended,
    };
  }

  private buildActiveRecallSchedule(records: ActiveRecallRecord[], referenceDate: string): ActiveRecallScheduleSummary {
    const dueToday: ActiveRecallSummary[] = [];
    const upcoming: ActiveRecallSummary[] = [];

    for (const record of records) {
      const isDue = record.next_review_date <= referenceDate;
      const summary: ActiveRecallSummary = {
        id: record.id,
        recallType: record.recall_type,
        contextPrompt: record.context_prompt,
        correctResponse: record.correct_response,
        nextReviewDate: record.next_review_date,
        intervalDays: record.interval_days,
        easeFactor: record.ease_factor ?? null,
        due: isDue,
      };

      if (isDue) {
        dueToday.push(summary);
      } else {
        upcoming.push(summary);
      }
    }

    return {
      dueTodayCount: dueToday.length,
      upcomingCount: upcoming.length,
      dueToday,
      upcoming,
    };
  }

  private buildMethodologyHighlights(
    problemAreas: ProblemAreaSummary[],
    shuHaRi: ShuHaRiStageSummary | null,
    sm2Schedule: ActiveRecallScheduleSummary
  ): string[] {
    const highlights: string[] = [];

    if (problemAreas.length > 0) {
      const top = problemAreas[0];
      highlights.push(
        `Кайдзен: повторяющаяся проблема "${top.content}" (${top.severity}). Нужна работа в заданиях ${top.lessonTypes.join(', ')}.`
      );
    }

    if (shuHaRi) {
      if (shuHaRi.dominantStage === 'shu') {
        highlights.push('Шу-Ха-Ри: фокус на соблюдении правил (Shu).');
      } else if (shuHaRi.dominantStage === 'ha') {
        highlights.push('Шу-Ха-Ри: пора тренировать перенос знаний (Ha).');
      } else {
        highlights.push('Шу-Ха-Ри: практикуем свободное использование (Ri).');
      }
      if (shuHaRi.pendingTestRecommended) {
        highlights.push('Рекомендуется еженедельный Shu-Ha-Ri тест для закрепления.');
      }
    }

    if (sm2Schedule.dueTodayCount > 0) {
      highlights.push(`SM-2: ${sm2Schedule.dueTodayCount} повторений просрочено или на сегодня.`);
    }

    return highlights;
  }

  private severityRank(severity: ProblemArea['severity']): number {
    switch (severity) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      default:
        return 1;
    }
  }

  private getShuHaRiRecommendations(stage: 'shu' | 'ha' | 'ri'): string[] {
    if (stage === 'shu') {
      return [
        'Повтори ключевые правила и сделай 2-3 задания на точное копирование образца.',
        'Запиши проблемные предложения и переделай их без ошибок.',
      ];
    }
    if (stage === 'ha') {
      return [
        'Выбери одну ошибку и придумай собственный пример с правильным правилом.',
        'Сравни два похожих правила и объясни разницу устно или письменно.',
      ];
    }
    return [
      'Попробуй творческое задание: мини-эссе или разговор без опоры на шпаргалку.',
      'Сконцентрируйся на естественности речи и автоматическом применении правил.',
    ];
  }

  private normalizeRecords<T>(data: T | T[] | null | undefined): T[] {
    if (!data) {
      return [];
    }
    return Array.isArray(data) ? data : [data];
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDays(dateString: string, days: number): string {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }
}


