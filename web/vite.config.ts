import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  ssr: {
    external: ['pg', 'node:process'],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      runtimeConfig: {
        nitro: { envPrefix: '' },
        databaseUrl: '',
        betterAuthSecret: '',
        betterAuthUrl: '',
        googleClientId: '',
        googleClientSecret: '',
      },
    }),
    viteReact(),
  ],
})

export default config
