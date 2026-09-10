import { describe, expect, it } from 'vitest'
import { Rating, State } from 'ts-fsrs'
import {
  cardToStateFields,
  createNewCard,
  currentRetrievability,
  isMastered,
  isWeak,
  qualityToRating,
  recordToCard,
  scheduleCard,
} from './srs-scheduler'
import { getQualityScore } from './quality'
import type { SrsStateRecord } from './types'

describe('qualityToRating', () => {
  it('maps quality 0-2 to Again', () => {
    expect(qualityToRating(0)).toBe(Rating.Again)
    expect(qualityToRating(1)).toBe(Rating.Again)
    expect(qualityToRating(2)).toBe(Rating.Again)
  })

  it('maps quality 3/4/5 to Hard/Good/Easy', () => {
    expect(qualityToRating(3)).toBe(Rating.Hard)
    expect(qualityToRating(4)).toBe(Rating.Good)
    expect(qualityToRating(5)).toBe(Rating.Easy)
  })

  it('clamps out-of-range quality', () => {
    expect(qualityToRating(-1)).toBe(Rating.Again)
    expect(qualityToRating(7)).toBe(Rating.Easy)
  })
})

describe('getQualityScore', () => {
  it('incorrect answers', () => {
    expect(getQualityScore(false)).toBe(2)
    expect(getQualityScore(false, undefined, true)).toBe(1)
  })

  it('correct answers by response time', () => {
    expect(getQualityScore(true, 1)).toBe(5)
    expect(getQualityScore(true, 3)).toBe(4)
    expect(getQualityScore(true, 10)).toBe(3)
    expect(getQualityScore(true)).toBe(4)
    expect(getQualityScore(true, undefined, true)).toBe(3)
  })
})

describe('createNewCard', () => {
  it('creates a New card without fake repetitions', () => {
    const card = createNewCard(new Date('2026-09-09T12:00:00Z'))
    expect(card.state).toBe(State.New)
    expect(card.reps).toBe(0)
    expect(card.lapses).toBe(0)
  })
})

describe('scheduleCard', () => {
  const now = new Date('2026-09-09T12:00:00Z')

  it('good answer on a new card schedules a future review', () => {
    const card = createNewCard(now)
    const updated = scheduleCard(card, 4, now)
    expect(updated.reps).toBe(1)
    expect(updated.due.getTime()).toBeGreaterThan(now.getTime())
    expect(updated.stability).toBeGreaterThan(0)
    expect(updated.difficulty).toBeGreaterThan(0)
  })

  it('easy answer gives a longer interval than hard', () => {
    const base = createNewCard(now)
    const easy = scheduleCard(base, 5, now)
    const hard = scheduleCard(base, 3, now)
    expect(easy.due.getTime()).toBeGreaterThan(hard.due.getTime())
  })

  it('failed review of a mature card increases lapses', () => {
    let card = createNewCard(now)
    // Доводим карточку до Review: несколько успешных повторений с разрывом в дни
    let t = now.getTime()
    for (let i = 0; i < 4; i++) {
      card = scheduleCard(card, 4, new Date(t))
      t = card.due.getTime()
    }
    expect(card.state).toBe(State.Review)
    const lapsesBefore = card.lapses
    const failed = scheduleCard(card, 1, new Date(t))
    expect(failed.lapses).toBe(lapsesBefore + 1)
  })
})

describe('isMastered / isWeak', () => {
  const now = new Date('2026-09-09T12:00:00Z')

  it('isMastered by stability threshold', () => {
    const card = createNewCard(now)
    card.stability = 29
    expect(isMastered(card)).toBe(false)
    card.stability = 30
    expect(isMastered(card)).toBe(true)
  })

  it('isWeak by difficulty', () => {
    const card = createNewCard(now)
    card.difficulty = 8
    card.last_review = now
    expect(isWeak(card, 'vocabulary_card', now)).toBe(true)
    card.difficulty = 5
    expect(isWeak(card, 'vocabulary_card', now)).toBe(false)
  })
})

describe('recordToCard / cardToStateFields round-trip', () => {
  it('preserves card fields through record conversion', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    const card = scheduleCard(createNewCard(now), 4, now)
    const fields = cardToStateFields(card, now)

    const record: SrsStateRecord = {
      id: 'r1',
      user_id: 'u1',
      item_type: 'vocabulary_card',
      item_id: 'c1',
      ...fields,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }

    const restored = recordToCard(record)
    expect(restored.stability).toBeCloseTo(card.stability)
    expect(restored.difficulty).toBeCloseTo(card.difficulty)
    expect(restored.reps).toBe(card.reps)
    expect(restored.lapses).toBe(card.lapses)
    expect(restored.state).toBe(card.state)
    expect(restored.due.toISOString().split('T')[0]).toBe(card.due.toISOString().split('T')[0])
    expect(restored.last_review?.toISOString()).toBe(card.last_review?.toISOString())
  })

  it('retrievability is 1 right after review', () => {
    const now = new Date('2026-09-09T12:00:00Z')
    const card = scheduleCard(createNewCard(now), 4, now)
    expect(currentRetrievability(card, now)).toBe(1)
  })
})
