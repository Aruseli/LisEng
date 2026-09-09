import { createFileRoute } from '@tanstack/react-router'

import { OpenRouterProvider } from '#/lib/ai/llm'
import { getModelForTask, getOpenRouterToken } from '#/lib/ai/models'
import { buildTutorPrompt } from '#/lib/ai/tutor-prompt'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/ai/speaking')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        try {
          const { messages, level, instructionLanguage, kickoff } = await request.json()

          const history = Array.isArray(messages) ? messages : []
          if (!kickoff && history.length === 0) {
            return jsonError('Invalid request body', 400)
          }

          const provider = new OpenRouterProvider({
            token: getOpenRouterToken(),
            model: getModelForTask('tutor'),
          })
          const system = {
            role: 'system',
            content: buildTutorPrompt(level || 'A2', instructionLanguage || 'ru'),
          }
          const withSystem =
            history[0]?.role === 'system'
              ? history
              : kickoff && history.length === 0
                ? [system, { role: 'user', content: 'Please greet me and ask the first question about the topic.' }]
                : [system, ...history]
          const response = await provider.query(withSystem)

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
