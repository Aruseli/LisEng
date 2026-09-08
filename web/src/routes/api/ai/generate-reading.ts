import { createFileRoute } from '@tanstack/react-router'

import { generateJSON } from '#/lib/ai/llm'

export const Route = createFileRoute('/api/ai/generate-reading')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { topic, level } = await request.json()
          const task = await generateJSON<any>(`
            Generate a reading task for the following request:
            Topic: ${topic}
            Level: ${level}
            Return a JSON object with the reading task details.
        `, { task: 'lesson' })
          return Response.json({ task })
        } catch (error) {
          console.error('Error generating reading task:', error)
          return Response.json({ error: 'Failed to generate reading task' }, { status: 500 })
        }
      },
    },
  },
})
