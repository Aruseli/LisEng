import type { SnapshotInsights } from './snapshot-insights-service';

export type SnapshotInsightType =
  | 'sm2_due'
  | 'problem_area'
  | 'shu_focus'
  | 'ha_focus'
  | 'ri_focus';

export interface SnapshotTaskBlueprint {
  type: string;
  title: string;
  description: string;
  duration: number;
  aiEnabled: boolean;
  insightType: SnapshotInsightType;
  reference: string;
  snapshotSummary: string;
  methodologyFocus: string[];
  recommendedPrompt?: string;
}

interface FocusOptions {
  userLevel?: string | null;
  targetLevel?: string | null;
}

interface BlueprintOptions {
  targetDate: string;
  existingInsightRefs?: Set<string>;
  limit?: number;
}

export class MethodologyAdvisor {
  constructor(private readonly insights: SnapshotInsights) {}

  buildFocusTags(options: FocusOptions = {}): string[] {
    const tags = new Set<string>();

    if (options.userLevel) {
      const kumonTag = options.targetLevel
        ? `Кумон: уровень ${options.userLevel} → цель ${options.targetLevel}`
        : `Кумон: уровень ${options.userLevel}`;
      tags.add(kumonTag);
    }

    if (this.insights.problemAreas.length > 0) {
      const topProblem = this.insights.problemAreas[0];
      tags.add(`Кайдзен: ${topProblem.content} (${topProblem.severity})`);
    }

    const dueTodayCount = this.insights.sm2Schedule.dueTodayCount;
    if (dueTodayCount > 0) {
      tags.add(`Active Recall: ${dueTodayCount} повтор.`);
    }

    if (this.insights.shuHaRi) {
      const stage = this.insights.shuHaRi.dominantStage;
      if (stage === 'shu') {
        tags.add('Shu-Ha-Ri: дисциплина Shu');
      } else if (stage === 'ha') {
        tags.add('Shu-Ha-Ri: эксперименты Ha');
      } else {
        tags.add('Shu-Ha-Ri: творчество Ri');
      }
    }

    this.insights.methodologyHighlights.forEach((highlight) => tags.add(highlight));

    return Array.from(tags).slice(0, 6);
  }

  buildTaskBlueprints(options: BlueprintOptions): SnapshotTaskBlueprint[] {
    const existingRefs = options.existingInsightRefs ?? new Set<string>();
    const limit = options.limit ?? 5;
    const blueprints: SnapshotTaskBlueprint[] = [];

    const pushBlueprint = (blueprint: SnapshotTaskBlueprint) => {
      if (existingRefs.has(blueprint.reference)) {
        return;
      }
      existingRefs.add(blueprint.reference);
      blueprints.push(blueprint);
    };

    for (const recall of this.insights.sm2Schedule.dueToday.slice(0, limit)) {
      if (blueprints.length >= limit) break;
      pushBlueprint({
        type: recall.recallType === 'vocabulary' ? 'vocabulary' : 'grammar',
        title: recall.recallType === 'vocabulary' ? 'Active Recall — слова' : 'Active Recall — правило',
        description: recall.contextPrompt,
        duration: 10,
        aiEnabled: recall.recallType !== 'vocabulary',
        insightType: 'sm2_due',
        reference: recall.id,
        snapshotSummary: `Повторение (${recall.recallType}). Контекст: ${recall.contextPrompt}`,
        methodologyFocus: [
          `Active Recall: интервал ${recall.intervalDays} дн.`,
          `Следующий повтор: ${recall.nextReviewDate}`,
        ],
        recommendedPrompt:
          recall.recallType === 'vocabulary'
            ? 'Назови перевод и придумай предложение с этим словом.'
            : 'Объясни правило и приведи 2 примера.',
      });
      if (blueprints.length >= limit) {
        return blueprints;
      }
    }

    for (const area of this.insights.problemAreas.slice(0, limit)) {
      if (blueprints.length >= limit) break;
      const reference = `${area.type}:${area.content}`;
      pushBlueprint({
        type:
          area.type === 'unknown_word'
            ? 'vocabulary'
            : area.type === 'hesitation'
              ? 'speaking'
              : area.type === 'struggle'
                ? 'writing'
                : 'grammar',
        title: `Разбор ошибки: ${area.content.slice(0, 48)}`,
        description: `Контекст: ${area.context}`,
        duration: 12,
        aiEnabled: area.type !== 'unknown_word',
        insightType: 'problem_area',
        reference,
        snapshotSummary: `Кайдзен: ${area.content} (${area.severity})`,
        methodologyFocus: [
          `Кайдзен: повтор ${area.lessonTypes.join(', ')}`,
          `Сложность: ${area.severity}`,
        ],
        recommendedPrompt: 'Разберём ошибку шаг за шагом: объясни, что смутило, и попробуй переписать.',
      });
    }

    if (blueprints.length < limit && this.insights.shuHaRi) {
      const stageReference = `shu_ha_ri:${this.insights.shuHaRi.dominantStage}:${options.targetDate}`;
      const stage = this.insights.shuHaRi.dominantStage;
      const sharedFocus = this.buildFocusTags();
      if (!existingRefs.has(stageReference)) {
        if (stage === 'shu') {
          pushBlueprint({
            type: 'grammar',
            title: 'Shu-практика: повторяй по образцу',
            description: 'Сделай 5 предложений по главной теме недели, строго по правилу.',
            duration: 15,
            aiEnabled: false,
            insightType: 'shu_focus',
            reference: stageReference,
            snapshotSummary: 'Стадия Shu — закрепляем базу.',
            methodologyFocus: sharedFocus,
            recommendedPrompt: undefined,
          });
        } else if (stage === 'ha') {
          pushBlueprint({
            type: 'writing',
            title: 'Ha-переосмысление: своя формулировка',
            description: 'Возьми ошибку из журнала и придумай 3 варианта, как сказать правильно.',
            duration: 15,
            aiEnabled: true,
            insightType: 'ha_focus',
            reference: stageReference,
            snapshotSummary: 'Стадия Ha — переносим правило в новые ситуации.',
            methodologyFocus: sharedFocus,
            recommendedPrompt: 'Представь, что объясняешь другу правило и сразу применяешь его в новой фразе.',
          });
        } else {
          pushBlueprint({
            type: 'speaking',
            title: 'Ri-творчество: свободный рассказ',
            description: 'Запиши голосовое/текст о событии дня, не заглядывая в шпаргалку.',
            duration: 12,
            aiEnabled: true,
            insightType: 'ri_focus',
            reference: stageReference,
            snapshotSummary: 'Стадия Ri — доверяем интуиции.',
            methodologyFocus: sharedFocus,
            recommendedPrompt: 'Расскажи историю, а я мягко поправлю и добавлю устойчивые выражения.',
          });
        }
      }
    }

    return blueprints.slice(0, limit);
  }
}


