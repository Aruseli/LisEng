/**
 * Статические process.env.X — так Nitro/Vercel включают переменную в функцию.
 * process.env[name] на деплое даёт undefined, даже если ключ есть в UI.
 * Читать только из хендлера запроса, не на верхнем уровне модуля.
 */
import { useRuntimeConfig } from 'nitro/runtime-config'

function env(value: string | undefined) {
  const v = value?.trim()
  return v ? v : undefined
}

function nitroRuntime() {
  try {
    return (useRuntimeConfig() as Record<string, string | undefined>) ?? {}
  } catch {
    return {}
  }
}

export function readServerEnv() {
  const nitro = nitroRuntime()
  return {
    DATABASE_URL: env(
      process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRES_PRISMA_URL ||
        nitro.databaseUrl,
    ),
    BETTER_AUTH_SECRET: env(process.env.BETTER_AUTH_SECRET || nitro.betterAuthSecret),
    BETTER_AUTH_URL: env(process.env.BETTER_AUTH_URL || nitro.betterAuthUrl),
    GOOGLE_CLIENT_ID: env(process.env.GOOGLE_CLIENT_ID || nitro.googleClientId),
    GOOGLE_CLIENT_SECRET: env(process.env.GOOGLE_CLIENT_SECRET || nitro.googleClientSecret),
    HASURA_GRAPHQL_URL: env(process.env.HASURA_GRAPHQL_URL || nitro.hasuraGraphqlUrl),
    HASURA_ADMIN_SECRET: env(process.env.HASURA_ADMIN_SECRET || nitro.hasuraAdminSecret),
    HASURA_JWT_SECRET: env(process.env.HASURA_JWT_SECRET || nitro.hasuraJwtSecret),
    VERCEL: env(process.env.VERCEL),
    VERCEL_URL: env(process.env.VERCEL_URL),
    VERCEL_ENV: env(process.env.VERCEL_ENV),
  }
}

export function readEnv(name: keyof ReturnType<typeof readServerEnv> | (string & {})) {
  const all = readServerEnv()
  if (name in all) return all[name as keyof typeof all]
  return undefined
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
