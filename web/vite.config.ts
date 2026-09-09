import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
        betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
        betterAuthUrl: process.env.BETTER_AUTH_URL || '',
        googleClientId: process.env.GOOGLE_CLIENT_ID || '',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    }),
    viteReact(),
  ],
})

export default config
