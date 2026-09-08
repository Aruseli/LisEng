import { createFileRoute } from '@tanstack/react-router'

import { getProvider } from '#/lib/ai/llm'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/ai/speaking')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        try {
          const { messages } = await request.json()

          if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return jsonError('Invalid request body', 400)
          }

          const provider = getProvider()
          const response = await provider.query(messages)

          return new Response(response.content, {
            headers: {
              'Content-Type': 'text/plain',
            },
          })
        } catch (error: any) {
          console.error('[API /ai/speaking] Error:', error)
          return Response.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 },
          )
        }
      },
    },
  },
})
