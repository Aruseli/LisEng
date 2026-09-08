/**
 * Очистка словаря текущего пользователя (подтверждено в плане: пустой старт).
 * npx tsx --env-file=.env scripts/reset-my-vocabulary.ts
 */
export {}

const USER_ID = 'a219174a-2c4b-4916-9a88-11f7e48a8362'
const endpoint = process.env.HASURA_GRAPHQL_URL!.replace(/\/v1\/graphql$/, '')
const secret = process.env.HASURA_ADMIN_SECRET!

async function runSql(sql: string) {
  const res = await fetch(`${endpoint}/v2/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': secret },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql } }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data
}

async function main() {
  await runSql(`
    DELETE FROM public.active_recall_sessions
      WHERE user_id = '${USER_ID}' AND recall_type = 'vocabulary';
    DELETE FROM public.lesson_vocabulary_extractions
      WHERE vocabulary_card_id IN (SELECT id FROM public.vocabulary_cards WHERE user_id = '${USER_ID}');
    DELETE FROM public.vocabulary_cards WHERE user_id = '${USER_ID}';
  `)
  console.log('словарь пользователя очищен:', USER_ID)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
