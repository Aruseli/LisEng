import { createFileRoute } from '@tanstack/react-router'

import { authEnvStatus } from '#/lib/server/env'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          auth: authEnvStatus(),
        })
      },
    },
  },
})

