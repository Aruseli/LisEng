/**
 * Единый конфиг FSRS (заменяет размазанные «магические числа» SM-2).
 *
 * Шкала quality 0–5 (вычисляется в ./quality.ts, единственная шкала во всех
 * флоу: swipe словаря, тренажёр глаголов, lesson snapshots):
 * - 0 — полный блэкаут (не используется UI, оставлено для совместимости шкалы)
 * - 1 — неправильно, даже с подсказкой
 * - 2 — неправильно, но правильный ответ показался знакомым («почти вспомнил»)
 * - 3 — правильно, но с трудом: подсказка ИЛИ ответ дольше RESPONSE_TIME_SLOW_SEC
 * - 4 — правильно, уверенно (быстрее RESPONSE_TIME_FAST_SEC..SLOW_SEC или без замера)
 * - 5 — идеально: правильно и быстрее RESPONSE_TIME_FAST_SEC
 *
 * Маппинг quality → FSRS Rating (4 градации, по docs/fsrs.md):
 * 0–2 → Again, 3 → Hard, 4 → Good, 5 → Easy.
 */

import { generatorParameters } from 'ts-fsrs'
import type { SrsItemType } from './types'

/** Глобальные параметры FSRS-6. Свои веса (w) НЕ обучаем на старте —
 * дефолтные обучены на сотнях миллионов отзывов Anki. */
export const FSRS_PARAMS = generatorParameters({
  /** Целевое удержание: карточка повторяется, когда R падает до ~90% */
  request_retention: 0.9,
  /** Максимальный интервал — 1 год */
  maximum_interval: 365,
  /** Размытие интервалов, чтобы карточки не схлопывались в один день.
   * Безопасно: due фильтруем по дате `<= today`, а не по минутам. */
  enable_fuzz: true,
  /** Без внутридневных learning steps (1m/10m): у нас сессии раз в день,
   * а due хранится с точностью до даты — шаги в минутах схлопывались бы
   * в «сегодня». FSRS сразу планирует на дни вперёд. */
  enable_short_term: false,
})

/** Карточка считается выученной, когда stability >= 30 дней
 * (замена эвристики «5 reps + 30 дней» для глаголов) */
export const MASTERY_STABILITY_DAYS = 30

export interface WeakThresholds {
  /** D выше этого → карточка сложная (шкала D 1–10) */
  difficulty: number
  /** R (на сейчас) ниже этого → карточка почти забыта */
  retrievability: number
}

/** Пороги «слабых» карточек по типам контента.
 * Стартовые значения одинаковые; после миграции проверить на реальных
 * данных, что доля «слабых» разумна, и при необходимости развести. */
export const WEAK_THRESHOLDS: Record<SrsItemType, WeakThresholds> = {
  vocabulary_card: { difficulty: 7, retrievability: 0.8 },
  verb: { difficulty: 7, retrievability: 0.8 },
}

/** Пороги времени ответа для getQualityScore (секунды) */
export const RESPONSE_TIME_FAST_SEC = 2
export const RESPONSE_TIME_SLOW_SEC = 5
