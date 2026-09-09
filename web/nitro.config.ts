import { defineConfig } from 'nitro/config'

/**
 * envPrefix: '' — runtimeConfig.databaseUrl читает DATABASE_URL, не только NITRO_DATABASE_URL.
 */
export default defineConfig({
  runtimeConfig: {
    nitro: {
      envPrefix: '',
    },
    databaseUrl: '',
    betterAuthSecret: '',
    betterAuthUrl: '',
    googleClientId: '',
    googleClientSecret: '',
    hasuraGraphqlUrl: '',
    hasuraAdminSecret: '',
    hasuraJwtSecret: '',
  },
})
