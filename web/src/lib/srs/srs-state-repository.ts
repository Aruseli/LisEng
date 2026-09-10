/**
 * Репозиторий состояния SRS: единственное место чтения/записи таблицы srs_state.
 * Insights и будущие tools агента читают D/S/R только отсюда.
 */

import type { Hasyx } from '@/lib/hasura/compat'
import type { Card } from 'ts-fsrs'
import {
  cardToStateFields,
  createNewCard,
  currentRetrievability,
  isWeak,
  recordToCard,
  scheduleCard,
} from './srs-scheduler'
import type { SrsItemType, SrsStateRecord } from './types'
import { WEAK_THRESHOLDS } from './fsrs-config'

const RETURNING = [
  'id',
  'user_id',
  'item_type',
  'item_id',
  'difficulty',
  'stability',
  'retrievability',
  'state',
  'due',
  'last_review_at',
  'elapsed_days',
  'scheduled_days',
  'learning_steps',
  'reps',
  'lapses',
  'created_at',
  'updated_at',
] as const

function first<T>(result: T | T[] | null | undefined): T | null {
  if (Array.isArray(result)) return result[0] ?? null
  return result ?? null
}

export async function getState(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
  itemId: string,
): Promise<SrsStateRecord | null> {
  const rows = await hasyx.select({
    table: 'srs_state',
    where: {
      user_id: { _eq: userId },
      item_type: { _eq: itemType },
      item_id: { _eq: itemId },
    },
    limit: 1,
    returning: [...RETURNING],
  })
  return first(rows) as SrsStateRecord | null
}

export async function saveState(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
  itemId: string,
  card: Card,
  existingId?: string,
): Promise<void> {
  const fields = cardToStateFields(card)
  if (existingId) {
    await hasyx.update({
      table: 'srs_state',
      pk_columns: { id: existingId },
      _set: { ...fields, updated_at: new Date().toISOString() },
    })
  } else {
    await hasyx.insert({
      table: 'srs_state',
      object: {
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        ...fields,
      },
    })
  }
}

/**
 * Единая операция «пользователь ответил»: загрузить состояние (или создать
 * новое без фиктивных повторений), применить FSRS, сохранить.
 * Возвращает обновлённую Card.
 */
export async function applyReview(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
  itemId: string,
  quality: number,
  now: Date = new Date(),
): Promise<Card> {
  const existing = await getState(hasyx, userId, itemType, itemId)
  const card = existing ? recordToCard(existing) : createNewCard(now)
  const updated = scheduleCard(card, quality, now)
  await saveState(hasyx, userId, itemType, itemId, updated, existing?.id)
  return updated
}

/** Карточки к повторению на дату (включая просроченные) */
export async function getDueStates(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
  date: string,
): Promise<SrsStateRecord[]> {
  const rows = await hasyx.select({
    table: 'srs_state',
    where: {
      user_id: { _eq: userId },
      item_type: { _eq: itemType },
      due: { _lte: date },
    },
    order_by: [{ due: 'asc' }],
    returning: [...RETURNING],
  })
  return (Array.isArray(rows) ? rows : rows ? [rows] : []) as SrsStateRecord[]
}

/**
 * «Слабые» карточки: пре-фильтр по сохранённым D/R в SQL,
 * точная проверка (включая R на текущий момент) — в JS.
 */
export async function getWeakStates(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
  now: Date = new Date(),
): Promise<SrsStateRecord[]> {
  const thresholds = WEAK_THRESHOLDS[itemType]
  const rows = await hasyx.select({
    table: 'srs_state',
    where: {
      user_id: { _eq: userId },
      item_type: { _eq: itemType },
      reps: { _gt: 0 },
      _or: [
        { difficulty: { _gt: thresholds.difficulty } },
        { retrievability: { _lt: thresholds.retrievability } },
      ],
    },
    order_by: [{ difficulty: 'desc' }],
    returning: [...RETURNING],
  })
  const records = (Array.isArray(rows) ? rows : rows ? [rows] : []) as SrsStateRecord[]
  return records.filter((record) => isWeak(recordToCard(record), itemType, now))
}

/** Все состояния пользователя по типу (для insights/метрик) */
export async function getAllStates(
  hasyx: Hasyx,
  userId: string,
  itemType: SrsItemType,
): Promise<SrsStateRecord[]> {
  const rows = await hasyx.select({
    table: 'srs_state',
    where: {
      user_id: { _eq: userId },
      item_type: { _eq: itemType },
    },
    returning: [...RETURNING],
  })
  return (Array.isArray(rows) ? rows : rows ? [rows] : []) as SrsStateRecord[]
}

export { currentRetrievability }
