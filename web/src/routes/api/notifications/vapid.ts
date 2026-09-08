import { createFileRoute } from '@tanstack/react-router'

import { getVapidPublicKey } from '#/lib/push'

export const Route = createFileRoute('/api/notifications/vapid')({
  server: {
    handlers: {
      GET: async () => Response.json({ publicKey: getVapidPublicKey() }),
    },
  },
})
