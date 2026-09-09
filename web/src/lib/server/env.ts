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

function live(name: string) {
  return clean(nodeEnv[name] || globalThis.process?.env?.[name])
}

export function readServerEnv() {
  return {
    DATABASE_URL: live('DATABASE_URL') || live('POSTGRES_URL') || live('POSTGRES_PRISMA_URL'),
    BETTER_AUTH_SECRET: live('BETTER_AUTH_SECRET'),
    BETTER_AUTH_URL: live('BETTER_AUTH_URL'),
    GOOGLE_CLIENT_ID: live('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: live('GOOGLE_CLIENT_SECRET'),
    HASURA_GRAPHQL_URL: live('HASURA_GRAPHQL_URL'),
    HASURA_ADMIN_SECRET: live('HASURA_ADMIN_SECRET'),
    HASURA_JWT_SECRET: live('HASURA_JWT_SECRET'),
    VERCEL: live('VERCEL'),
    VERCEL_URL: live('VERCEL_URL'),
    VERCEL_ENV: live('VERCEL_ENV'),
  }
}

export function readEnv(name: keyof ReturnType<typeof readServerEnv> | (string & {})) {
  const all = readServerEnv()
  if (name in all) return all[name as keyof typeof all]
  return live(String(name))
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
