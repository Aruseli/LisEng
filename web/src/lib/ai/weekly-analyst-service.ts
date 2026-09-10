import type { Hasyx } from '@/lib/hasura/compat'
import { generateJSON } from '@/lib/ai/llm'
import { getWeeklyStructureForStage } from '@/lib/hasura-queries'

/**
 * Агент-аналитик (Этап 5 roadmap): еженедельный фон-анализ паттернов
 * review_history → точечная корректировка weekly_structure активного этапа.
 *
 * weekly_structure — общий шаблон этапа (без user_id), поэтому корректировки
 * намеренно консервативные: только длительность (10..60 мин) и описание.
 * Приложение фактически одно-пользовательское; при нескольких учениках на
 * одном этапе применяется анализ последнего обработанного.
 */

const LOOKBACK_DAYS = 7
const MIN_DURATION = 10
const MAX_DURATION = 60
const MAX_USERS_PER_RUN = 10

interface ReviewStats {
  total: number
  correct: number
  avgResponseSec: number | null
}

interface WeeklyAdjustment {
  day_of_week: number
  activity_type: string
  duration_minutes?: number
  description?: string
  reason?: string
}

export interface AnalystUserReport {
  userId: string
  stageId: string
  vocabStats: ReviewStats
  verbStats: ReviewStats
  adjustmentsApplied: number
  adjustmentsSkipped: number
  error?: string
}

export interface AnalystRunReport {
  usersProcessed: number
  reports: AnalystUserReport[]
}

async function getVocabReviewStats(
  hasyx: Hasyx,
  userId: string,
  since: string,
): Promise<ReviewStats> {
  const rows = await hasyx.select({
    table: 'review_history',
    where: { user_id: { _eq: userId }, reviewed_at: { _gte: since } },
    returning: ['was_correct', 'response_time_seconds'],
    limit: 2000,
  })
  return summarize(Array.isArray(rows) ? rows : [])
}

async function getVerbReviewStats(
  hasyx: Hasyx,
  userId: string,
  since: string,
): Promise<ReviewStats> {
  const rows = await hasyx.select({
    table: 'verb_review_history',
    where: { user_id: { _eq: userId }, reviewed_at: { _gte: since } },
    returning: ['was_correct', 'response_time_seconds'],
    limit: 2000,
  })
  return summarize(Array.isArray(rows) ? rows : [])
}

function summarize(rows: Array<{ was_correct: boolean; response_time_seconds: number | null }>): ReviewStats {
  const total = rows.length
  const correct = rows.filter((r) => r.was_correct).length
  const times = rows
    .map((r) => r.response_time_seconds)
    .filter((t): t is number => typeof t === 'number' && t > 0)
  const avgResponseSec =
    times.length > 0
      ? Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10
      : null
  return { total, correct, avgResponseSec }
}

/**
 * Прогон аналитика: активные stage_progress → паттерны review_history →
 * LLM-рекомендации → точечные update-ы weekly_structure.
 * dryRun — только анализ и рекомендации, без записи в БД (для smoke-тестов).
 */
export async function runWeeklyAnalyst(
  hasyx: Hasyx,
  options: { dryRun?: boolean } = {},
): Promise<AnalystRunReport> {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const activeProgress = await hasyx.select({
    table: 'stage_progress',
    where: { status: { _eq: 'in_progress' } },
    returning: ['user_id', 'stage_id'],
    limit: MAX_USERS_PER_RUN,
  })
  const progressList = (Array.isArray(activeProgress) ? activeProgress : []).filter(
    (p: any) => p?.user_id && p?.stage_id,
  )

  const reports: AnalystUserReport[] = []

  for (const progress of progressList) {
    const userId = progress.user_id as string
    const stageId = progress.stage_id as string
    const report: AnalystUserReport = {
      userId,
      stageId,
      vocabStats: { total: 0, correct: 0, avgResponseSec: null },
      verbStats: { total: 0, correct: 0, avgResponseSec: null },
      adjustmentsApplied: 0,
      adjustmentsSkipped: 0,
    }
    reports.push(report)

    try {
      const [vocabStats, verbStats, structure] = await Promise.all([
        getVocabReviewStats(hasyx, userId, since),
        getVerbReviewStats(hasyx, userId, since),
        getWeeklyStructureForStage(hasyx, stageId),
      ])
      report.vocabStats = vocabStats
      report.verbStats = verbStats

      // Мало данных или пустая структура — нечего корректировать
      if (vocabStats.total + verbStats.total < 10 || structure.length === 0) {
        continue
      }

      const vocabAccuracy = vocabStats.total
        ? Math.round((vocabStats.correct / vocabStats.total) * 100)
        : null
      const verbAccuracy = verbStats.total
        ? Math.round((verbStats.correct / verbStats.total) * 100)
        : null

      const adjustments = await generateJSON<{ adjustments: WeeklyAdjustment[] }>(
        `Ты — аналитик обучения. Проанализируй паттерны повторений ученика за ${LOOKBACK_DAYS} дней и предложи точечные корректировки недельной структуры.

Повторения словаря: всего ${vocabStats.total}, точность ${vocabAccuracy ?? '—'}%, среднее время ответа ${vocabStats.avgResponseSec ?? '—'}с.
Повторения глаголов: всего ${verbStats.total}, точность ${verbAccuracy ?? '—'}%, среднее время ответа ${verbStats.avgResponseSec ?? '—'}с.

Текущая структура недели (day_of_week 1=пн..7=вс):
${JSON.stringify(structure, null, 2)}

Правила:
- Корректируй ТОЛЬКО duration_minutes (в диапазоне ${MIN_DURATION}..${MAX_DURATION}) и/или description существующих активностей. Не добавляй и не удаляй активности.
- Низкая точность (<60%) по теме → увеличь время соответствующей активности и уточни описание (больше повторений).
- Высокая точность (>90%) → можно немного сократить время.
- Максимум 3 корректировки. Если всё в норме — верни пустой массив.

JSON: {"adjustments": [{"day_of_week": 1, "activity_type": "...", "duration_minutes": 30, "description": "...", "reason": "..."}]}`,
        { task: 'vocab' },
      )

      const list = Array.isArray(adjustments?.adjustments) ? adjustments.adjustments : []

      for (const adj of list.slice(0, 3)) {
        const row = structure.find(
          (s: any) =>
            s.day_of_week === adj.day_of_week && s.activity_type === adj.activity_type,
        )
        if (!row) {
          report.adjustmentsSkipped++
          continue
        }
        const set: Record<string, unknown> = {}
        if (typeof adj.duration_minutes === 'number') {
          set.duration_minutes = Math.min(
            MAX_DURATION,
            Math.max(MIN_DURATION, Math.round(adj.duration_minutes)),
          )
        }
        if (typeof adj.description === 'string' && adj.description.trim()) {
          set.description = adj.description.trim().slice(0, 500)
        }
        if (Object.keys(set).length === 0) {
          report.adjustmentsSkipped++
          continue
        }
        if (options.dryRun) {
          report.adjustmentsApplied++
          console.log(
            `[weekly-analyst][dry-run] user=${userId} day=${adj.day_of_week} ${adj.activity_type}: ${JSON.stringify(set)} (${adj.reason ?? 'no reason'})`,
          )
          continue
        }
        await hasyx.update({
          table: 'weekly_structure',
          pk_columns: { id: (row as any).id },
          _set: set,
        })
        report.adjustmentsApplied++
        console.log(
          `[weekly-analyst] user=${userId} day=${adj.day_of_week} ${adj.activity_type}: ${JSON.stringify(set)} (${adj.reason ?? 'no reason'})`,
        )
      }
    } catch (error) {
      report.error = error instanceof Error ? error.message : String(error)
      console.warn(`[weekly-analyst] user=${userId} failed:`, error)
    }
  }

  return { usersProcessed: progressList.length, reports }
}
