/** Админский run_sql к Hasura (для таблиц вне vendored schema.json). */

const endpoint = () => process.env.HASURA_GRAPHQL_URL!.replace(/\/v1\/graphql$/, '')
const secret = () => process.env.HASURA_ADMIN_SECRET!

export async function runSql<T = string[][]>(sql: string, readOnly = false): Promise<T> {
  const res = await fetch(`${endpoint()}/v2/query`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': secret(),
    },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql, read_only: readOnly } }),
  })
  const data = (await res.json()) as { result?: string[][]; result_type?: string; error?: string }
  if (!res.ok) throw new Error(data.error || JSON.stringify(data))
  if (data.result_type === 'CommandOk') return [] as T
  if (!data.result) throw new Error(data.error || JSON.stringify(data))
  return data.result as T
}

export function sqlRows(result: string[][]): Record<string, string>[] {
  const [header, ...rows] = result
  if (!header) return []
  return rows.map((row) => Object.fromEntries(header.map((h, i) => [h, row[i]])))
}
