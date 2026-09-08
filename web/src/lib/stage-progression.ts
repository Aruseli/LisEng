/**
 * Сервис для проверки готовности пользователя к переходу между этапами обучения
 */

export interface StageRequirement {
  id: string;
  requirement_type: 'tasks_completed' | 'words_learned' | 'errors_reviewed' | 'accuracy_threshold' | 'test_passed';
  requirement_value?: number;
  requirement_threshold?: number;
  description: string;
  order_index: number;
}

export interface StageProgress {
  tasks_completed: number;
  tasks_total: number;
  words_learned: number;
  errors_pending: number;
  average_accuracy: number;
  status: 'in_progress' | 'ready_for_test' | 'test_passed' | 'completed';
}

export interface RequirementCheck {
  requirement: StageRequirement;
  met: boolean;
  current_value?: number;
  required_value?: number;
  message: string;
}

export class StageProgressionService {
  /**
   * Проверяет, выполнены ли все требования для перехода на следующий этап
   */
  static checkStageRequirements(
    progress: StageProgress,
    requirements: StageRequirement[]
  ): RequirementCheck[] {
    return requirements.map(req => {
      let met = false;
      let current_value: number | undefined;
      let required_value: number | undefined;
      let message = '';

      switch (req.requirement_type) {
        case 'tasks_completed':
          const tasks_percentage = progress.tasks_total > 0 
            ? (progress.tasks_completed / progress.tasks_total) * 100 
            : 0;
          current_value = tasks_percentage;
          required_value = req.requirement_value || 0;
          met = tasks_percentage >= required_value;
          message = met
            ? `Выполнено ${tasks_percentage.toFixed(0)}% заданий (требуется ${required_value}%)`
            : `Выполнено ${tasks_percentage.toFixed(0)}% заданий, требуется ${required_value}%`;
          break;

        case 'words_learned':
          current_value = progress.words_learned;
          required_value = req.requirement_value || 0;
          met = progress.words_learned >= required_value;
          message = met
            ? `Выучено ${progress.words_learned} слов (требуется ${required_value})`
            : `Выучено ${progress.words_learned} слов, требуется ${required_value}`;
          break;

        case 'errors_reviewed':
          current_value = progress.errors_pending;
          required_value = 0;
          met = progress.errors_pending === 0;
          message = met
            ? 'Все ошибки повторены'
            : `Осталось ${progress.errors_pending} неповторенных ошибок`;
          break;

        case 'accuracy_threshold':
          current_value = progress.average_accuracy * 100;
          required_value = (req.requirement_threshold || 0) * 100;
          met = progress.average_accuracy >= (req.requirement_threshold || 0);
          message = met
            ? `Точность ${(progress.average_accuracy * 100).toFixed(0)}% (требуется ${required_value}%)`
            : `Точность ${(progress.average_accuracy * 100).toFixed(0)}%, требуется ${required_value}%`;
          break;

        case 'test_passed':
          met = progress.status === 'test_passed' || progress.status === 'completed';
          message = met
            ? 'Финальный тест пройден'
            : 'Необходимо пройти финальный тест этапа';
          break;
      }

      return {
        requirement: req,
        met,
        current_value,
        required_value,
        message,
      };
    });
  }

  /**
   * Определяет, готов ли пользователь к финальному тесту этапа
   */
  static isReadyForTest(checks: RequirementCheck[]): boolean {
    // Все требования кроме test_passed должны быть выполнены
    const nonTestRequirements = checks.filter(
      c => c.requirement.requirement_type !== 'test_passed'
    );
    return nonTestRequirements.every(c => c.met);
  }

  /**
   * Вычисляет процент выполнения требований
   */
  static getCompletionPercentage(checks: RequirementCheck[]): number {
    if (checks.length === 0) return 0;
    const metCount = checks.filter(c => c.met).length;
    return (metCount / checks.length) * 100;
  }

  /**
   * Получает список невыполненных требований
   */
  static getUnmetRequirements(checks: RequirementCheck[]): RequirementCheck[] {
    return checks.filter(c => !c.met);
  }

  /**
   * Вычисляет среднюю точность по всем навыкам из progress_metrics
   */
  static calculateAverageAccuracy(metrics: {
    accuracy_grammar?: number | null;
    accuracy_vocabulary?: number | null;
    accuracy_listening?: number | null;
    accuracy_reading?: number | null;
    accuracy_writing?: number | null;
  }): number {
    const accuracies = [
      metrics.accuracy_grammar,
      metrics.accuracy_vocabulary,
      metrics.accuracy_listening,
      metrics.accuracy_reading,
      metrics.accuracy_writing,
    ].filter((acc): acc is number => acc !== null && acc !== undefined);

    if (accuracies.length === 0) return 0;
    return accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
  }
}

