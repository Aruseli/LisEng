import { createFileRoute } from '@tanstack/react-router'

import { generateJSON } from '#/lib/ai/llm'

export const Route = createFileRoute('/api/ai/grammar-drill')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { topic, level } = await request.json()
          const exercises = await generateJSON<any>(`
            Generate grammar drill exercises for the following request:
            Topic: ${topic}
            Level: ${level}
            Return a JSON object with an "exercises" array.
        `)
          return Response.json({ exercises })
        } catch (error) {
          console.error('Error in grammar-drill API:', error)
          return Response.json({ error: 'Failed to generate grammar drill' }, { status: 500 })
        }
      },
    },
  },
})
