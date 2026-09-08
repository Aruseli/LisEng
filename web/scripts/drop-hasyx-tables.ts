/**
 * Этап 5: удаление hasyx-остатков из БД (подтверждено пользователем).
 * Дроп через Hasura run_sql с cascade=true — Hasura сама убирает таблицы из metadata.
 * public.accounts сохраняется по решению пользователя.
 */

const endpoint = process.env.HASURA_GRAPHQL_URL!.replace(/\/v1\/graphql$/, '')
const secret = process.env.HASURA_ADMIN_SECRET!

const SQL = `
DROP SCHEMA IF EXISTS logs CASCADE;
DROP SCHEMA IF EXISTS payments CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;
DROP TABLE IF EXISTS public.debug CASCADE;
DROP TABLE IF EXISTS public.error_log CASCADE;
DROP TABLE IF EXISTS public.github_issues CASCADE;
DROP TABLE IF EXISTS public.invites CASCADE;
DROP TABLE IF EXISTS public.notification_messages CASCADE;
DROP TABLE IF EXISTS public.notification_permissions CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.verification_codes CASCADE;
DROP TABLE IF EXISTS public.auth_jwt CASCADE;
`

async function main() {
  const res = await fetch(`${endpoint}/v2/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': secret },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql: SQL, cascade: true } }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log('дроп выполнен:', JSON.stringify(data))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
