import { defineConfig } from 'nitro/config'

/**
 * Явные ссылки на process.env.*, чтобы Nitro включил эти ключи
 * в Vercel Function. Имена в Vercel остаются без префикса NITRO_.
 */
export default defineConfig({
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
    betterAuthUrl: process.env.BETTER_AUTH_URL || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    hasuraGraphqlUrl: process.env.HASURA_GRAPHQL_URL || '',
    hasuraAdminSecret: process.env.HASURA_ADMIN_SECRET || '',
    hasuraJwtSecret: process.env.HASURA_JWT_SECRET || '',
  },
})
