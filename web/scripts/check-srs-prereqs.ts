/**
 * Разовая проверка перед миграцией srs_state:
 * 1. Триггеры на vocabulary_cards / active_recall_sessions / verb_learning_progress
 * 2. Колонки vocabulary_cards (есть ли ease_factor)
 * Запуск: npx tsx --env-file=.env scripts/check-srs-prereqs.ts
 */

import { runSql, sqlRows } from '../src/lib/hasura/run-sql'

async function main() {
  const triggers = sqlRows(
    await runSql(`
      SELECT event_object_table AS table_name, trigger_name, action_statement
      FROM information_schema.triggers
      WHERE event_object_schema = 'public'
        AND event_object_table IN ('vocabulary_cards', 'active_recall_sessions', 'verb_learning_progress')
      ORDER BY event_object_table, trigger_name
    `, true),
  )
  console.log('Triggers:', JSON.stringify(triggers, null, 2))

  const columns = sqlRows(
    await runSql(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'vocabulary_cards'
      ORDER BY ordinal_position
    `, true),
  )
  console.log('vocabulary_cards columns:', columns.map((c) => `${c.column_name}:${c.data_type}`).join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
