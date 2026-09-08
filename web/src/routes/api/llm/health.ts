import { createFileRoute } from '@tanstack/react-router'

import { BUDGET_MODEL, CATALOG_PREMIUM_MODEL, getModelForTask } from '#/lib/ai/models'

export const Route = createFileRoute('/api/llm/health')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          ok: Boolean(process.env.OPENROUTER_API_KEY),
          premium: getModelForTask('lesson'),
          budget: getModelForTask('vocab'),
          defaults: { premium: CATALOG_PREMIUM_MODEL, budget: BUDGET_MODEL },
        })
      },
    },
  },
})
