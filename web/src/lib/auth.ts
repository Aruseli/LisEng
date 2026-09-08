/**
 * Серверная конфигурация better-auth.
 * - Вход: Google OAuth (client id/secret из прежнего проекта)
 * - Таблицы better-auth: auth_users / auth_sessions / auth_accounts / auth_verifications (UUID id)
 * - При создании auth-пользователя создаётся профиль в public.users с тем же id,
 *   чтобы все FK доменных таблиц (user_id) продолжали работать.
 */
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { Pool } from 'pg'

import { getAdminClient } from './hasura'

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: { modelName: 'auth_users' },
  session: { modelName: 'auth_sessions' },
  account: { modelName: 'auth_accounts' },
  verification: { modelName: 'auth_verifications' },
  advanced: {
    database: {
      // UUID, чтобы id были совместимы с uuid-колонками user_id доменных таблиц
      generateId: () => crypto.randomUUID(),
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const db = getAdminClient()
            // Устаревший профиль с тем же email, но другим id (например, от прежней
            // NextAuth-регистрации) удаляем — иначе упрёмся в users_email_key.
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
