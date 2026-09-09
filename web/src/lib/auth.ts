/**
 * Серверная конфигурация better-auth.
 * - Вход: Google OAuth
 * - Таблицы: auth_users / auth_sessions / auth_accounts / auth_verifications
 * - Профиль в public.users с тем же id
 */
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { Pool } from 'pg'

import { getAdminClient } from './hasura'
import { getAuthBaseURL, getAuthConfigError, readEnv } from './server/env'

function createPool() {
  const connectionString = readEnv('DATABASE_URL')
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString)
  return new Pool({
    connectionString,
    max: 1,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  })
}

function createAuth() {
  const configError = getAuthConfigError()
  if (configError) throw new Error(configError)

  const baseURL = getAuthBaseURL()

  return betterAuth({
    database: createPool(),
    baseURL,
    secret: readEnv('BETTER_AUTH_SECRET'),
    trustedOrigins: [
      'http://localhost:3000',
      'https://lis-eng.vercel.app',
      baseURL,
    ],
    socialProviders: {
      google: {
        clientId: readEnv('GOOGLE_CLIENT_ID') as string,
        clientSecret: readEnv('GOOGLE_CLIENT_SECRET') as string,
      },
    },
    user: { modelName: 'auth_users' },
    session: { modelName: 'auth_sessions' },
    account: { modelName: 'auth_accounts' },
    verification: { modelName: 'auth_verifications' },
    advanced: {
      database: {
        generateId: () => crypto.randomUUID(),
      },
      trustedProxyHeaders: true,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            try {
              const db = getAdminClient()
              await db.delete({
                table: 'users',
                where: { email: { _eq: user.email }, id: { _neq: user.id } },
                returning: ['id'],
              })
              await db.insert({
                table: 'users',
                object: {
                  id: user.id,
                  name: user.name || user.email,
                  email: user.email,
                },
                on_conflict: { constraint: 'users_pkey', update_columns: ['name'] },
                returning: ['id'],
              })
            } catch (e) {
              console.error('Не удалось создать профиль в public.users:', e)
              throw e
            }
          },
        },
      },
    },
    plugins: [tanstackStartCookies()],
  })
}

let authInstance: ReturnType<typeof createAuth> | undefined

export function getAuth() {
  if (!authInstance) authInstance = createAuth()
  return authInstance
}

/** Ленивая обёртка: модуль не падает на импорте, если на Vercel нет env. */
export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop, receiver) {
    return Reflect.get(getAuth(), prop, receiver)
  },
})
