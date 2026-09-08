/**
 * Инвентаризация БД: список таблиц public-схемы + число строк.
 * Только чтение. Запуск: npx tsx --env-file=.env scripts/list-tables.ts
 */

export {}

const endpoint = process.env.HASURA_GRAPHQL_URL!.replace(/\/v1\/graphql$/, '')
const secret = process.env.HASURA_ADMIN_SECRET!

async function runSql(sql: string): Promise<string[][]> {
  const res = await fetch(`${endpoint}/v2/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': secret },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql, read_only: true } }),
  })
  const data = (await res.json()) as { result?: string[][]; error?: string }
  if (!data.result) throw new Error(JSON.stringify(data))
  return data.result.slice(1)
}

async function main() {
  const tables = await runSql(
    `select table_schema, table_name from information_schema.tables where table_type='BASE TABLE' and table_schema not in ('information_schema','pg_catalog','hdb_catalog') order by 1,2;`,
  )
  for (const [schema, name] of tables) {
    const [[count]] = await runSql(`select count(*) from "${schema}"."${name}";`)
    console.log(`${schema}.${name}\t${count}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
