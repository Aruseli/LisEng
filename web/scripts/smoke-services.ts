/**
 * Read-only смоук перенесённых доменных сервисов против живой Hasura.
 * Запуск: node --env-file=.env node_modules/.bin/tsx scripts/smoke-services.ts <userId>
 */
import { getAdminClient } from '../src/lib/hasura/index'
import { VerbsService } from '../src/lib/verbs/verbs-service'
import { getUserProfile, getDailyTasks } from '../src/lib/hasura-queries'

const userId = process.argv[2]
if (!userId) {
  console.error('Использование: tsx scripts/smoke-services.ts <userId>')
  process.exit(1)
}

const db = getAdminClient()

async function main() {
  const verbsService = new VerbsService(db)

  const verbs = await verbsService.getVerbs({ group: 1 })
  console.log(`VerbsService.getVerbs(group 1): ${verbs.length} глаголов, первый: ${verbs[0]?.infinitive}`)

  const review = await verbsService.getVerbsForReview(userId, new Date().toISOString().split('T')[0], 5)
  console.log(`VerbsService.getVerbsForReview: ${review.length} на повторение`)

  const profile = await getUserProfile(db, userId)
  console.log('getUserProfile:', JSON.stringify(profile)?.slice(0, 200))

  const tasks = await getDailyTasks(db, userId, new Date().toISOString().split('T')[0])
  console.log(`getDailyTasks: ${Array.isArray(tasks) ? tasks.length : JSON.stringify(tasks)?.slice(0, 100)} на сегодня`)

  console.log('Смоук сервисов: OK')
}

main().catch((e) => {
  console.error('Ошибка смоука:', e.message)
  process.exit(1)
})
