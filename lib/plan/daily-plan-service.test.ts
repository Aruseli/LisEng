import { describe, expect, it, beforeEach, jest } from '@jest/globals';

import { DailyPlanService } from './daily-plan-service';
import type { SnapshotInsights } from '@/lib/lesson-snapshots';

const upsertDailyTaskFromStructure = jest.fn(async () => undefined);

jest.mock('@/lib/hasura-queries', () => ({
  getAchievements: jest.fn(),
  getActiveStageProgress: jest.fn(),
  getDailyTasks: jest.fn(),
  getLatestProgressMetric: jest.fn(),
  getStageRequirements: jest.fn(),
  getStreak: jest.fn(),
  getUserProfile: jest.fn(),
  getVocabularyCardsForReview: jest.fn(),
  getWeeklyStructureForStage: jest.fn(),
  updateDailyTaskMetadata: jest.fn(),
  updateStageProgressStats: jest.fn(),
  upsertDailyTaskFromStructure: (...args: Parameters<typeof upsertDailyTaskFromStructure>) =>
    upsertDailyTaskFromStructure(...args),
}));

function buildInsights(overrides: Partial<SnapshotInsights> = {}): SnapshotInsights {
  return {
    referenceDate: '2024-01-10',
    problemAreas: [
      {
        type: 'error',
        content: 'Articles misuse',
        context: 'Missing "the"',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        lessonTypes: ['grammar'],
        frequency: 3,
        lastSeen: '2024-01-08',
      },
    ],
    kaizenMomentum: {
      accuracyDeltaAvg: 0.05,
      speedDeltaAvg: 2,
      mistakesReducedTotal: 3,
      trend: 'stable',
    },
    masteryDistribution: { mastered: 1, developing: 2 },
    shuHaRi: {
      dominantStage: 'shu',
      skills: [],
      recommendations: [],
      pendingTestRecommended: false,
    },
    sm2Schedule: {
      dueTodayCount: 1,
      upcomingCount: 0,
      dueToday: [
        {
          id: 'recall-1',
          recallType: 'grammar_rule',
          contextPrompt: 'Explain when to use definite article',
          correctResponse: 'Use "the" before specific nouns',
          nextReviewDate: '2024-01-10',
          intervalDays: 2,
          easeFactor: 2.5,
          due: true,
        },
      ],
      upcoming: [],
    },
    methodologyHighlights: ['Кайдзен: закрепи артикли'],
    ...overrides,
  };
}

describe('DailyPlanService.ensureSnapshotDrivenTasks', () => {
  beforeEach(() => {
    upsertDailyTaskFromStructure.mockClear();
  });

  it('создает задания по инсайтам snapshot с методологическими полями', async () => {
    const service = new DailyPlanService({} as any);
    const insights = buildInsights();

    const result = await (service as any).ensureSnapshotDrivenTasks({
      userId: 'user-1',
      stageId: 'stage-1',
      targetDate: '2024-01-10',
      insights,
      existingTasks: [],
      regenerate: false,
    });

    expect(result).toBe(true);
    expect(upsertDailyTaskFromStructure).toHaveBeenCalled();

    const calls = upsertDailyTaskFromStructure.mock.calls as any[][];
    const payload = calls[0][1] as Record<string, any>;
    expect(payload.userId).toBe('user-1');
    expect(payload.typeSpecificPayload).toMatchObject({
      source: 'snapshot_insights',
      insight_type: expect.any(String),
    });
    expect(Array.isArray(payload.typeSpecificPayload.methodology_focus)).toBe(true);
    expect(payload.suggestedPrompt).toBeDefined();

    const methodologyFocuses = calls
      .map(([, callPayload]) => callPayload?.typeSpecificPayload?.methodology_focus ?? [])
      .flat();
    expect(methodologyFocuses).toEqual(expect.arrayContaining(['Shu-Ha-Ri: дисциплина Shu']));
  });

  it('возвращает false, если нечего добавить', async () => {
    const service = new DailyPlanService({} as any);
    const insights = buildInsights({
      sm2Schedule: { dueTodayCount: 0, upcomingCount: 0, dueToday: [], upcoming: [] },
      problemAreas: [],
      shuHaRi: null,
    });

    const result = await (service as any).ensureSnapshotDrivenTasks({
      userId: 'user-1',
      stageId: 'stage-1',
      targetDate: '2024-01-10',
      insights,
      existingTasks: [],
      regenerate: false,
    });

    expect(result).toBe(false);
    expect(upsertDailyTaskFromStructure).not.toHaveBeenCalled();
  });
});


