/**
 * Lesson Snapshots System
 * 
 * Система слепков уроков с интеграцией японских методик:
 * - Кайдзен (Kaizen): непрерывное улучшение
 * - Кумон (Kumon): постепенное усложнение до мастерства
 * - Active Recall: активное вспоминание с SM-2 алгоритмом
 * - Сю-Ха-Ри (Shu-Ha-Ri): три стадии обучения
 */

export { LessonSnapshotService } from './lesson-snapshot-service';
export { ShuHaRiService } from './shu-ha-ri-service';
export { ArchivingService } from './archiving-service';
export {
  SnapshotInsightsService,
  type SnapshotInsights,
  type ProblemAreaSummary,
  type KaizenMomentumSummary,
  type ActiveRecallScheduleSummary,
  type ActiveRecallSummary,
  type ShuHaRiStageSummary,
  type ShuHaRiSkillSummary,
  type SnapshotInsightsOptions,
} from './snapshot-insights-service';
export { MethodologyAdvisor, type SnapshotTaskBlueprint } from './methodology-advisor';
export { calculateSM2, getQualityScore, initializeSM2, type SM2Params, type SM2Result } from './sm2-algorithm';
export type { ProblemArea, LessonSnapshotData, KaizenMetrics } from './lesson-snapshot-service';
export type { ShuHaRiTestQuestion, ShuHaRiTestResult } from '@/types/shu-ha-ri';

