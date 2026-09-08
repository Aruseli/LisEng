/**
 * Read-only смоук нового Hasura-клиента: генератор + fetch + распаковка.
 * Запуск: node --env-file=.env node_modules/.bin/vite-node scripts/smoke-hasura.ts
 */
import { getAdminClient } from '../src/lib/hasura/index'

const db = getAdminClient()

const verbs = await db.select({
  table: 'irregular_verbs',
  limit: 2,
  order_by: [{ infinitive: 'asc' }],
  returning: ['id', 'infinitive'],
})
console.log('select irregular_verbs:', JSON.stringify(verbs))

const agg = await db.select({ table: 'users', aggregate: { count: true } })
console.log('users aggregate:', JSON.stringify(agg))
