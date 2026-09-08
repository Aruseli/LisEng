import { createFileRoute } from '@tanstack/react-router'

import { generateJSON } from '#/lib/ai/llm'
import { jsonError } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/stage/generate-test')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { questions } = await request.json()

          if (!questions) {
            return jsonError('Questions are required', 400)
          }

          const prompt = `
      Based on the following questions, generate a new, similar set of test questions.
      Original Questions: ${JSON.stringify(questions)}
      Return a JSON object with a "questions" array.
    `

          const result = await generateJSON<{ questions: Array<any> }>(prompt, { task: 'lesson' })

          return Response.json({ questions: result.questions })
        } catch (error: any) {
          console.error(`Error in /api/stage/generate-test: ${error.message}`)
          return Response.json(
            { error: 'Failed to generate test', details: error.message },
            { status: 500 },
          )
        }
      },
    },
  },
})
