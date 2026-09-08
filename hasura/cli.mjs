#!/usr/bin/env node
/**
 * Обёртка над hasura CLI: подставляет endpoint/секрет из web/.env.
 * Использование: node cli.mjs metadata export
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(join(root, '../web/.env'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
)

const endpoint = env.HASURA_GRAPHQL_URL.replace(/\/v1\/graphql$/, '')

const res = spawnSync('hasura', process.argv.slice(2), {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    HASURA_GRAPHQL_ENDPOINT: endpoint,
    HASURA_GRAPHQL_ADMIN_SECRET: env.HASURA_ADMIN_SECRET,
  },
})
process.exit(res.status ?? 1)
