/**
 * Vite подменяет process.env.DATABASE_URL на undefined в серверном бандле
 * (видит только VITE_*). Берём живой Node process — так Vercel отдаёт секреты.
 * Читать только из хендлера, не на верхнем уровне модуля.
 */
import { env as nodeEnv } from 'node:process'

function clean(value: string | undefined) {
  const v = value?.trim()
  return v ? v : undefined
}

export function readLiveEnv(name: string) {
  return clean(nodeEnv[name] || globalThis.process?.env?.[name])
}

export function readServerEnv() {
  return {
    DATABASE_URL: readLiveEnv('DATABASE_URL') || readLiveEnv('POSTGRES_URL') || readLiveEnv('POSTGRES_PRISMA_URL'),
    BETTER_AUTH_SECRET: readLiveEnv('BETTER_AUTH_SECRET'),
    BETTER_AUTH_URL: readLiveEnv('BETTER_AUTH_URL'),
    GOOGLE_CLIENT_ID: readLiveEnv('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: readLiveEnv('GOOGLE_CLIENT_SECRET'),
    HASURA_GRAPHQL_URL: readLiveEnv('HASURA_GRAPHQL_URL'),
    HASURA_ADMIN_SECRET: readLiveEnv('HASURA_ADMIN_SECRET'),
    HASURA_JWT_SECRET: readLiveEnv('HASURA_JWT_SECRET'),
    HASURA_EVENT_SECRET: readLiveEnv('HASURA_EVENT_SECRET'),
    GROQ_API_KEY: readLiveEnv('GROQ_API_KEY'),
    OPENROUTER_API_KEY: readLiveEnv('OPENROUTER_API_KEY'),
    VERCEL: readLiveEnv('VERCEL'),
    VERCEL_URL: readLiveEnv('VERCEL_URL'),
    VERCEL_ENV: readLiveEnv('VERCEL_ENV'),
  }
}

export function readEnv(name: keyof ReturnType<typeof readServerEnv> | (string & {})) {
  const all = readServerEnv()
  if (name in all) return all[name as keyof typeof all]
  return readLiveEnv(String(name))
}

export function authEnvStatus() {
  const e = readServerEnv()
  const url = e.BETTER_AUTH_URL ?? ''
  return {
    DATABASE_URL: Boolean(e.DATABASE_URL),
    BETTER_AUTH_SECRET: Boolean(e.BETTER_AUTH_SECRET),
    BETTER_AUTH_URL: Boolean(url),
    BETTER_AUTH_URL_LOCALHOST: /localhost|127\.0\.0\.1/.test(url),
    GOOGLE_CLIENT_ID: Boolean(e.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: Boolean(e.GOOGLE_CLIENT_SECRET),
    HASURA_GRAPHQL_URL: Boolean(e.HASURA_GRAPHQL_URL),
    HASURA_ADMIN_SECRET: Boolean(e.HASURA_ADMIN_SECRET),
    vercel: Boolean(e.VERCEL || e.VERCEL_URL),
    vercelEnv: e.VERCEL_ENV ?? null,
  }
}

export function getAuthConfigError() {
  const status = authEnvStatus()
  if (!status.DATABASE_URL) return 'DATABASE_URL is not set'
  if (!status.BETTER_AUTH_SECRET) return 'BETTER_AUTH_SECRET is not set'
  if (!status.GOOGLE_CLIENT_ID || !status.GOOGLE_CLIENT_SECRET) {
    return 'GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set'
  }
  return null
}

export function getAuthBaseURL() {
  const e = readServerEnv()
  const raw = (e.BETTER_AUTH_URL ?? '').replace(/\/$/, '')
  if (raw && !/localhost|127\.0\.0\.1/.test(raw)) return raw
  if (e.VERCEL_URL) return `https://${e.VERCEL_URL.replace(/^https?:\/\//, '')}`
  return raw || 'http://localhost:3000'
}
