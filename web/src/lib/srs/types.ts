/**
 * Типы SRS-слоя (FSRS).
 *
 * `srs_state` — единая таблица состояния повторений для всех типов контента.
 * Сейчас поддерживаются словарь и глаголы; 'lesson_flashcard' добавим,
 * когда будет понятно, что является единицей повторения в уроке.
 */

export type SrsItemType = 'vocabulary_card' | 'verb'

/** Имена состояний ts-fsrs Card (State enum: New=0, Learning=1, Review=2, Relearning=3) */
export type SrsStateName = 'New' | 'Learning' | 'Review' | 'Relearning'

/** Строка таблицы srs_state (нормализованное FSRS-состояние, без jsonb) */
export interface SrsStateRecord {
  id: string
  user_id: string
  item_type: SrsItemType
  item_id: string
  /** FSRS Difficulty (1–10) */
  difficulty: number
  /** FSRS Stability в днях */
  stability: number
  /** R на момент последнего пересчёта (0–1); для точного значения считать на чтении */
  retrievability: number
  state: SrsStateName
  /** Дата следующего повторения (YYYY-MM-DD) */
  due: string
  last_review_at: string | null
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  created_at: string
  updated_at: string
}
