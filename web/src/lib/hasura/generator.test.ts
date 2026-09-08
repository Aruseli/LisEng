/**
 * Эквивалентность vendored-генератора оригинальному hasyx-генератору.
 * Все кейсы — реальные паттерны запросов из кодовой базы LisEng
 * (lib/hasura-queries.ts, lib/verbs/verbs-service.ts и др.).
 */
import { describe, expect, it } from 'vitest'

import { Generator } from './generator'
// Оригинальный генератор из установленного hasyx (компилированный JS корневого проекта)
import { Generator as HasyxGenerator } from '../../../../node_modules/hasyx/lib/generator.js'
import schema from './schema.json'

const ours = Generator(schema)
const theirs = HasyxGenerator(schema)

function compare(options: any) {
  const a = ours({ ...options })
  const b = theirs({ ...options })
  expect(a.queryString).toBe(b.queryString)
  expect(a.variables).toEqual(b.variables)
  expect(a.queryName).toBe(b.queryName)
  return a
}

describe('vendored generator == hasyx generator', () => {
  it('select с where/order_by/limit (getAISession)', () => {
    compare({
      operation: 'query',
      table: 'ai_sessions',
      where: {
        user_id: { _eq: 'user-1' },
        type: { _eq: 'speaking' },
        ended_at: { _is_null: true },
      },
      order_by: [{ started_at: 'desc' }],
      limit: 1,
      returning: ['id', 'conversation', 'started_at'],
    })
  })

  it('select с _in и составным where (verb_learning_progress)', () => {
    compare({
      operation: 'query',
      table: 'verb_learning_progress',
      where: {
        user_id: { _eq: 'user-1' },
        verb_id: { _in: ['v1', 'v2', 'v3'] },
      },
      returning: [
        'id',
        'user_id',
        'verb_id',
        'next_review_date',
        'correct_count',
        'incorrect_count',
        'mastered',
        'ease_factor',
        'interval_days',
        'repetitions',
      ],
    })
  })

  it('select с множественным order_by (irregular_verbs)', () => {
    compare({
      operation: 'query',
      table: 'irregular_verbs',
      where: { group_number: { _eq: 1 } },
      order_by: [{ frequency: 'asc' }, { group_number: 'asc' }, { infinitive: 'asc' }],
      returning: ['id', 'infinitive', 'past_simple', 'past_participle', 'difficulty'],
    })
  })

  it('select с вложенным returning (relation)', () => {
    compare({
      operation: 'query',
      table: 'daily_tasks',
      where: { user_id: { _eq: 'user-1' } },
      returning: [
        'id',
        'title',
        { lesson_snapshots: ['id', 'created_at'] },
      ],
    })
  })

  it('select by pk_columns', () => {
    compare({
      operation: 'query',
      table: 'users',
      pk_columns: { id: 'user-1' },
      returning: ['id', 'name', 'email'],
    })
  })

  it('insert одного объекта (createAISession)', () => {
    compare({
      operation: 'insert',
      table: 'ai_sessions',
      object: {
        type: 'speaking',
        topic: 'travel',
        conversation: [],
        started_at: '2026-01-01T00:00:00.000Z',
      },
      returning: ['id'],
    })
  })

  it('insert bulk (objects)', () => {
    compare({
      operation: 'insert',
      table: 'vocabulary_cards',
      objects: [
        { word: 'cat', user_id: 'user-1' },
        { word: 'dog', user_id: 'user-1' },
      ],
      returning: ['id', 'word'],
    })
  })

  it('update по where + _set', () => {
    compare({
      operation: 'update',
      table: 'ai_sessions',
      where: { id: { _eq: 'session-1' } },
      _set: { conversation: [{ role: 'user', content: 'hi' }], ended_at: null },
      returning: ['id'],
    })
  })

  it('update по pk_columns (archiving-service)', () => {
    compare({
      operation: 'update',
      table: 'lesson_snapshots',
      pk_columns: { id: 'snap-1' },
      _set: { problem_areas: null, archived: true },
      returning: ['id'],
    })
  })

  it('delete по where', () => {
    compare({
      operation: 'delete',
      table: 'daily_tasks',
      where: { user_id: { _eq: 'user-1' }, task_date: { _lt: '2026-01-01' } },
      returning: ['id'],
    })
  })

  it('insert с on_conflict (upsertDailyTask)', () => {
    compare({
      operation: 'insert',
      table: 'daily_tasks',
      object: {
        user_id: 'user-1',
        task_date: '2026-01-01',
        type: 'grammar',
        title: 'Задание',
      },
      on_conflict: {
        constraint: 'daily_tasks_user_id_task_date_type_key',
        update_columns: ['title', 'description', 'duration_minutes'],
      },
      returning: ['id'],
    })
  })

  it('aggregate (count)', () => {
    compare({
      operation: 'query',
      table: 'daily_tasks',
      where: { user_id: { _eq: 'user-1' } },
      aggregate: { count: true },
    })
  })

  it('subscription (streaks — AppPage)', () => {
    compare({
      operation: 'subscription',
      table: 'streaks',
      where: { user_id: { _eq: 'user-1' } },
      returning: ['id', 'current_streak', 'longest_streak', 'last_activity_date'],
    })
  })
})
