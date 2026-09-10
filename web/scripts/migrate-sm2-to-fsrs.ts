/**
 * Миграция SM-2 → FSRS: наполнение srs_state из active_recall_sessions (словарь)
 * и verb_learning_progress (глаголы).
 *
 * Правила:
 * - зрелые карточки (reps >= 3 && interval >= 14): state=Review, S ≈ interval_days,
 *   D = 5 (среднее, без формулы доли ошибок в первой версии), due = next_review_date;
 * - остальные: дефолтные D/S (state=New), due = next_review_date если была;
 * - старые таблицы не трогаем — остаются историей.
 *
 * Запуск:
 *   npx tsx --env-file=.env scripts/migrate-sm2-to-fsrs.ts          # dry-run
 *   npx tsx --env-file=.env scripts/migrate-sm2-to-fsrs.ts --apply  # запись в БД
 */

import { getAdminClient } from '../src/lib/hasura'
import { currentRetrievability, type SrsItemType } from '../src/lib/srs'
import type { Card } from 'ts-fsrs'
import { State } from 'ts-fsrs'

const MATURE_MIN_REPS = 3
const MATURE_MIN_INTERVAL_DAYS = 14
const MIGRATED_DIFFICULTY = 5

const APPLY = process.argv.includes('--apply')

interface MigratedRow {
  user_id: string
  item_type: SrsItemType
  item_id: string
  card: Card
  mature: boolean
}

function buildCard(params: {
  mature: boolean
  intervalDays: number
  repetitions: number
  nextReviewDate: string | null
  lastReviewAt: string | null
  now: Date
}): Card {
  const { mature, intervalDays, repetitions, nextReviewDate, lastReviewAt, now } = params
  const due = nextReviewDate ? new Date(nextReviewDate) : now
  if (mature) {
    return {
      due,
      stability: intervalDays,
      difficulty: MIGRATED_DIFFICULTY,
      elapsed_days: 0,
      scheduled_days: intervalDays,
      learning_steps: 0,
      reps: repetitions,
      lapses: 0,
      state: State.Review,
      last_review: lastReviewAt ? new Date(lastReviewAt) : undefined,
    }
  }
  // Чистый старт: дефолтные D/S, state=New
  return {
    due,
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: undefined,
  }
}

async function main() {
  const hasyx = getAdminClient()
  const now = new Date()
  const rows: MigratedRow[] = []

  // --- Словарь: последняя active_recall_sessions по каждой карточке ---
  const recallSessions = await hasyx.select({
    table: 'active_recall_sessions',
    where: { recall_item_type: { _eq: 'vocabulary_card' } },
    order_by: [{ created_at: 'desc' }],
    returning: [
      'user_id',
      'recall_item_id',
      'interval_days',
      'repetitions',
      'next_review_date',
      'updated_at',
      'created_at',
    ],
  })
  const sessions = Array.isArray(recallSessions) ? recallSessions : recallSessions ? [recallSessions] : []
  const seenCards = new Set<string>()
  for (const s of sessions) {
    const key = `${s.user_id}:${s.recall_item_id}`
    if (seenCards.has(key)) continue // уже взяли последнюю запись
    seenCards.add(key)
    const reps = s.repetitions ?? 0
    const interval = s.interval_days ?? 0
    const mature = reps >= MATURE_MIN_REPS && interval >= MATURE_MIN_INTERVAL_DAYS
    rows.push({
      user_id: s.user_id,
      item_type: 'vocabulary_card',
      item_id: s.recall_item_id,
      mature,
      card: buildCard({
        mature,
        intervalDays: interval,
        repetitions: reps,
        nextReviewDate: s.next_review_date ?? null,
        lastReviewAt: s.updated_at ?? s.created_at ?? null,
        now,
      }),
    })
  }

  // --- Глаголы: verb_learning_progress ---
  const verbProgress = await hasyx.select({
    table: 'verb_learning_progress',
    returning: [
      'user_id',
      'verb_id',
      'interval_days',
      'repetitions',
      'next_review_date',
      'last_reviewed_at',
    ],
  })
  const verbs = Array.isArray(verbProgress) ? verbProgress : verbProgress ? [verbProgress] : []
  for (const v of verbs) {
    const reps = v.repetitions ?? 0
    const interval = v.interval_days ?? 0
    const mature = reps >= MATURE_MIN_REPS && interval >= MATURE_MIN_INTERVAL_DAYS
    rows.push({
      user_id: v.user_id,
      item_type: 'verb',
      item_id: v.verb_id,
      mature,
      card: buildCard({
        mature,
        intervalDays: interval,
        repetitions: reps,
        nextReviewDate: v.next_review_date ?? null,
        lastReviewAt: v.last_reviewed_at ?? null,
        now,
      }),
    })
  }

  // --- Сводка ---
  const matureRows = rows.filter((r) => r.mature)
  const freshRows = rows.filter((r) => !r.mature)
  console.log(`Всего состояний: ${rows.length} (зрелых: ${matureRows.length}, с чистым стартом: ${freshRows.length})`)
  const byType = (type: SrsItemType) => rows.filter((r) => r.item_type === type)
  console.log(`  vocabulary_card: ${byType('vocabulary_card').length}, verb: ${byType('verb').length}`)

  const dueSpread = new Map<string, number>()
  for (const r of matureRows) {
    const day = r.card.due.toISOString().split('T')[0]
    dueSpread.set(day, (dueSpread.get(day) ?? 0) + 1)
  }
  console.log('Распределение due зрелых карточек (топ-10):')
  ;[...dueSpread.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(0, 10)
    .forEach(([day, count]) => console.log(`  ${day}: ${count}`))

  if (!APPLY) {
    console.log('\nDry-run. Для записи запусти с --apply')
    return
  }

  // --- Запись ---
  let inserted = 0
  let skipped = 0
  for (const row of rows) {
    const existing = await hasyx.select({
      table: 'srs_state',
      where: {
        user_id: { _eq: row.user_id },
        item_type: { _eq: row.item_type },
        item_id: { _eq: row.item_id },
      },
      limit: 1,
      returning: ['id'],
    })
    const existingRow = Array.isArray(existing) ? existing[0] : existing
    if (existingRow) {
      skipped++
      continue
    }
    const r = currentRetrievability(row.card, now)
    await hasyx.insert({
      table: 'srs_state',
      object: {
        user_id: row.user_id,
        item_type: row.item_type,
        item_id: row.item_id,
        difficulty: row.card.difficulty,
        stability: row.card.stability,
        retrievability: r,
        state: State[row.card.state],
        due: row.card.due.toISOString().split('T')[0],
        last_review_at: row.card.last_review?.toISOString() ?? null,
        elapsed_days: row.card.elapsed_days,
        scheduled_days: row.card.scheduled_days,
        learning_steps: row.card.learning_steps,
        reps: row.card.reps,
        lapses: row.card.lapses,
      },
    })
    inserted++
    if (inserted % 50 === 0) console.log(`  записано ${inserted}...`)
  }
  console.log(`\nГотово: записано ${inserted}, пропущено (уже есть): ${skipped}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
