import { createFileRoute } from '@tanstack/react-router'

import packageJson from '../../../package.json'

export const Route = createFileRoute('/api/version')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          version: packageJson.version ?? '0.0.0',
          name: 'LisEng',
        })
      },
    },
  },
})
