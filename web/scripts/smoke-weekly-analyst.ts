/**
 * Smoke-тест weekly-аналитика в dry-run режиме: читает review_history,
 * прогоняет LLM-рекомендации, но НЕ пишет в weekly_structure.
 *
 * Запуск: node_modules/.bin/tsx --env-file=.env scripts/smoke-weekly-analyst.ts
 */
import { getAdminClient } from '../src/lib/hasura'
import { runWeeklyAnalyst } from '../src/lib/ai/weekly-analyst-service'

async function main() {
  const report = await runWeeklyAnalyst(getAdminClient(), { dryRun: true })

  console.log(JSON.stringify(report, null, 2))
  if (report.usersProcessed === 0) {
    console.log('ANALYST_SMOKE_SKIP: нет активных stage_progress')
  } else {
    console.log('ANALYST_SMOKE_OK')
  }
}

main().catch((error) => {
  console.error('ANALYST_SMOKE_FAIL:', error)
  process.exit(1)
})
