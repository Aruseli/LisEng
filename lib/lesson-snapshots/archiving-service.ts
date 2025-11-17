import { Hasyx } from 'hasyx';

/**
 * Сервис для архивации старых данных
 * Оптимизация для бесплатных версий Vercel/Neon
 */
export class ArchivingService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Архивация старых слепков (старше 6 месяцев)
   * Удаляет детальные данные, оставляя только агрегированные метрики
   */
  async archiveOldSnapshots(userId: string, monthsOld: number = 6): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);

    try {
      // Найти старые слепки
      const oldSnapshots = await this.hasyx.select({
        table: 'lesson_snapshots',
        where: {
          user_id: { _eq: userId },
          lesson_date: { _lt: cutoffDate.toISOString() },
        },
        returning: ['id', 'content_snapshot', 'problem_areas', 'performance_score'],
      });

      const snapshots = Array.isArray(oldSnapshots) ? oldSnapshots : oldSnapshots ? [oldSnapshots] : [];
      
      if (snapshots.length === 0) {
        return 0;
      }

      // Агрегировать данные перед удалением деталей
      const aggregated = this.aggregateSnapshotData(snapshots);

      // Обновить слепки: удалить детальные данные, оставить только метрики
      for (const snapshot of snapshots) {
        await this.hasyx.update({
          table: 'lesson_snapshots',
          pk_columns: { id: snapshot.id },
          _set: {
            content_snapshot: null, // Удалить детальный контент
            problem_areas: aggregated.problemAreasSummary, // Оставить только агрегированные проблемные области
          },
        });
      }

      return snapshots.length;
    } catch (error) {
      console.error('Error archiving snapshots:', error);
      throw error;
    }
  }

  /**
   * Агрегация данных из слепков
   */
  private aggregateSnapshotData(snapshots: any[]): {
    problemAreasSummary: any[];
  } {
    const problemAreasMap = new Map<string, { count: number; severity: string }>();

    for (const snapshot of snapshots) {
      const areas = (snapshot.problem_areas as any[]) || [];
      for (const area of areas) {
        const key = `${area.type}_${area.content?.substring(0, 30)}`;
        const existing = problemAreasMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          problemAreasMap.set(key, {
            count: 1,
            severity: area.severity || 'medium',
          });
        }
      }
    }

    const problemAreasSummary = Array.from(problemAreasMap.entries())
      .map(([key, data]) => ({
        type: key.split('_')[0],
        frequency: data.count,
        severity: data.severity,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Топ-10 проблемных областей

    return {
      problemAreasSummary,
    };
  }

  /**
   * Архивация старых Active Recall сессий (старше 1 года, если слово освоено)
   */
  async archiveOldActiveRecall(userId: string, yearsOld: number = 1): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsOld);

    try {
      // Найти старые сессии, где слово уже освоено (repetitions >= 5 и последний review был успешным)
      const oldRecalls = await this.hasyx.select({
        table: 'active_recall_sessions',
        where: {
          user_id: { _eq: userId },
          created_at: { _lt: cutoffDate.toISOString() },
          repetitions: { _gte: 5 },
        },
        returning: ['id'],
      });

      const recalls = Array.isArray(oldRecalls) ? oldRecalls : oldRecalls ? [oldRecalls] : [];

      if (recalls.length === 0) {
        return 0;
      }

      // Удалить старые освоенные сессии
      for (const recall of recalls) {
        await this.hasyx.delete({
          table: 'active_recall_sessions',
          pk_columns: { id: recall.id },
        });
      }

      return recalls.length;
    } catch (error) {
      console.error('Error archiving Active Recall:', error);
      throw error;
    }
  }

  /**
   * Полная архивация для пользователя (вызывается периодически)
   */
  async archiveUserData(userId: string): Promise<{
    snapshotsArchived: number;
    activeRecallArchived: number;
  }> {
    const snapshotsArchived = await this.archiveOldSnapshots(userId, 6);
    const activeRecallArchived = await this.archiveOldActiveRecall(userId, 1);

    return {
      snapshotsArchived,
      activeRecallArchived,
    };
  }
}

