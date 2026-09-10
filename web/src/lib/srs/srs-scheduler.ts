/**
 * SrsScheduler — единая точка входа в FSRS для всего приложения.
 *
 * Все места (review API, lesson completion, verbs-service) работают ТОЛЬКО
 * через этот модуль и не знают деталей алгоритма. AI не участвует в
 * scheduling: FSRS — чистый детерминированный алгоритм.
 */

import { fsrs, createEmptyCard, Rating, State, type Card, type Grade } from 'ts-fsrs'
import { FSRS_PARAMS, MASTERY_STABILITY_DAYS, WEAK_THRESHOLDS } from './fsrs-config'
import type { SrsItemType, SrsStateName, SrsStateRecord } from './types'

const scheduler = fsrs(FSRS_PARAMS)

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Маппинг quality 0–5 → FSRS Rating (0–2 → Again, 3 → Hard, 4 → Good, 5 → Easy) */
export function qualityToRating(quality: number): Grade {
  const q = Math.max(0, Math.min(5, Math.round(quality)))
  if (q <= 2) return Rating.Again
  if (q === 3) return Rating.Hard
  if (q === 4) return Rating.Good
  return Rating.Easy
}

/** Новая карточка: дефолтные D/S, БЕЗ фиктивного повторения с quality 0
 * (в SM-2 инициализация через quality 0 занижала EF до первой реальной попытки) */
export function createNewCard(now: Date = new Date()): Card {
  return createEmptyCard(now)
}

/** Основная операция: применить ответ пользователя к состоянию карточки.
 * Возвращает новое состояние Card (с due, stability, difficulty и т.д.). */
export function scheduleCard(card: Card, quality: number, now: Date = new Date()): Card {
  const rating = qualityToRating(quality)
  return scheduler.next(card, now, rating).card
}

/** Текущая retrievability (0–1): вероятность вспомнить карточку прямо сейчас */
export function currentRetrievability(card: Card, now: Date = new Date()): number {
  const lastReview = card.last_review ?? card.due
  const elapsedDays = Math.max(0, (now.getTime() - lastReview.getTime()) / MS_PER_DAY)
  if (elapsedDays === 0 || card.stability <= 0) return 1
  return scheduler.forgetting_curve(elapsedDays, card.stability)
}

/** Карточка выучена: stability >= 30 дней */
export function isMastered(card: Card): boolean {
  return card.stability >= MASTERY_STABILITY_DAYS
}

/** Карточка «слабая»: высокая сложность или низкая вероятность вспомнить */
export function isWeak(card: Card, itemType: SrsItemType, now: Date = new Date()): boolean {
  const thresholds = WEAK_THRESHOLDS[itemType]
  return card.difficulty > thresholds.difficulty || currentRetrievability(card, now) < thresholds.retrievability
}

// --- Конвертация между строкой srs_state и ts-fsrs Card ---

export function recordToCard(record: SrsStateRecord): Card {
  return {
    due: new Date(record.due),
    stability: record.stability,
    difficulty: record.difficulty,
    elapsed_days: record.elapsed_days,
    scheduled_days: record.scheduled_days,
    learning_steps: record.learning_steps,
    reps: record.reps,
    lapses: record.lapses,
    state: State[record.state],
    last_review: record.last_review_at ? new Date(record.last_review_at) : undefined,
  }
}

/** Поля srs_state из Card (без id/user_id/item_* — их знает вызывающий код) */
export function cardToStateFields(
  card: Card,
  now: Date = new Date(),
): Omit<SrsStateRecord, 'id' | 'user_id' | 'item_type' | 'item_id' | 'created_at' | 'updated_at'> {
  return {
    difficulty: card.difficulty,
    stability: card.stability,
    retrievability: currentRetrievability(card, now),
    state: State[card.state] as SrsStateName,
    due: toDateString(card.due),
    last_review_at: card.last_review ? card.last_review.toISOString() : null,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
  }
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}
