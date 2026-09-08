import { createFileRoute } from '@tanstack/react-router'

import { type LlmTask } from '#/lib/ai/models'
import { runLlm } from '#/lib/ai/router'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

const TASKS: LlmTask[] = ['lesson', 'tutor', 'vocab', 'score']

export const Route = createFileRoute('/api/llm/run')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        const body = await request.json().catch(() => ({}))
        const task = body.task as LlmTask
        const payload = body.payload && typeof body.payload === 'object' ? body.payload : {}
        const prompt =
          typeof body.prompt === 'string'
            ? body.prompt
            : typeof payload.prompt === 'string'
              ? payload.prompt
              : ''
        const level =
          typeof body.level === 'string'
            ? body.level
            : typeof body.user_context?.level === 'string'
              ? body.user_context.level
              : undefined
        if (!TASKS.includes(task)) return jsonError('invalid task', 400)
        if (!prompt.trim()) return jsonError('prompt is required', 400)

        try {
          const content = await runLlm({
            task,
            prompt,
            systemPrompt: typeof body.systemPrompt === 'string' ? body.systemPrompt : undefined,
            level,
            maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : undefined,
          })
          return Response.json({ content, task })
        } catch (error: any) {
          return jsonError(error?.message ?? 'llm failed', 502)
        }
      },
    },
  },
})
