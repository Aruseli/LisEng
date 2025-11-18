import { describe, expect, it } from '@jest/globals';

import { MethodologyAdvisor } from './methodology-advisor';
import type { SnapshotInsights } from './snapshot-insights-service';

function buildSnapshotInsights(overrides: Partial<SnapshotInsights> = {}): SnapshotInsights {
  return {
    referenceDate: '2024-01-10',
    problemAreas: [
      {
        type: 'error',
        content: 'Present Perfect confusion',
        context: 'He have went',
        severity: 'high',
        timestamp: new Date().toISOString(),
        lessonTypes: ['grammar'],
        frequency: 3,
        lastSeen: '2024-01-09',
      },
      {
        type: 'hesitation',
        content: 'Long pauses while speaking',
        context: 'Storytelling task',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        lessonTypes: ['speaking'],
        frequency: 2,
        lastSeen: '2024-01-08',
      },
    ],
    kaizenMomentum: {
      accuracyDeltaAvg: 0.12,
      speedDeltaAvg: 4,
      mistakesReducedTotal: 5,
      trend: 'improving',
    },
    masteryDistribution: {
      mastered: 2,
      developing: 3,
      beginner: 1,
    },
    shuHaRi: {
      dominantStage: 'ha',
      skills: [
        {
          skillId: 'skill-1',
          skillType: 'grammar',
          stage: 'ha',
          readinessScore: 0.6,
          lastStageChangeAt: '2024-01-05',
        },
      ],
      recommendations: ['Explain the rule in your own words'],
      pendingTestRecommended: false,
    },
    sm2Schedule: {
      dueTodayCount: 2,
      upcomingCount: 1,
      dueToday: [
        {
          id: 'recall-1',
          recallType: 'vocabulary',
          contextPrompt: 'Explain the word "resilient"',
          correctResponse: 'resilient',
          nextReviewDate: '2024-01-10',
          intervalDays: 3,
          easeFactor: 2.4,
          due: true,
        },
        {
          id: 'recall-2',
          recallType: 'grammar_rule',
          contextPrompt: 'Form Present Perfect for "to go"',
          correctResponse: 'have gone',
          nextReviewDate: '2024-01-10',
          intervalDays: 5,
          easeFactor: 2.6,
          due: true,
        },
      ],
      upcoming: [
        {
          id: 'recall-3',
          recallType: 'vocabulary',
          contextPrompt: '"to wander"',
          correctResponse: 'wander',
          nextReviewDate: '2024-01-12',
          intervalDays: 4,
          easeFactor: 2.3,
          due: false,
        },
      ],
    },
    methodologyHighlights: ['Кайдзен: сконцентрируйся на Present Perfect'],
    ...overrides,
  };
}

describe('MethodologyAdvisor', () => {
  it('builds focus tags combining Kaizen, Active Recall и Shu-Ha-Ri', () => {
    const advisor = new MethodologyAdvisor(buildSnapshotInsights());

    const focus = advisor.buildFocusTags({
      userLevel: 'A2',
      targetLevel: 'B1',
    });

    expect(focus).toEqual(
      expect.arrayContaining([
        'Кумон: уровень A2 → цель B1',
        'Кайдзен: Present Perfect confusion (high)',
        'Active Recall: 2 повтор.',
        'Shu-Ha-Ri: эксперименты Ha',
        'Кайдзен: сконцентрируйся на Present Perfect',
      ])
    );
  });

  it('generates task blueprints from SM-2 и проблемных областей', () => {
    const advisor = new MethodologyAdvisor(buildSnapshotInsights());

    const blueprints = advisor.buildTaskBlueprints({
      targetDate: '2024-01-10',
    });

    expect(blueprints).toHaveLength(5);

    const recallTask = blueprints.find((bp) => bp.reference === 'recall-1');
    expect(recallTask).toMatchObject({
      type: 'vocabulary',
      title: 'Active Recall — слова',
      insightType: 'sm2_due',
      recommendedPrompt: expect.stringContaining('Назови перевод'),
    });

    const problemTask = blueprints.find((bp) => bp.insightType === 'problem_area');
    expect(problemTask).toMatchObject({
      title: expect.stringContaining('Разбор ошибки'),
      methodologyFocus: expect.arrayContaining(['Кайдзен: повтор grammar']),
    });

    const stageTask = blueprints.find((bp) => bp.insightType === 'ha_focus');
    expect(stageTask).toMatchObject({
      type: 'writing',
      title: expect.stringContaining('Ha-переосмысление'),
      methodologyFocus: expect.arrayContaining(['Shu-Ha-Ri: эксперименты Ha']),
    });
  });

  it('respects existing insight references', () => {
    const advisor = new MethodologyAdvisor(buildSnapshotInsights());

    const blueprints = advisor.buildTaskBlueprints({
      targetDate: '2024-01-10',
      existingInsightRefs: new Set(['recall-1', 'error:Present Perfect confusion']),
    });

    expect(blueprints.some((bp) => bp.reference === 'recall-1')).toBe(false);
    expect(
      blueprints.some((bp) => bp.reference === 'error:Present Perfect confusion')
    ).toBe(false);
  });
});


