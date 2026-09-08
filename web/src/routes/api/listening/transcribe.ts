import { createFileRoute } from '@tanstack/react-router'

import { transcribeAudio } from '#/lib/ai/speech'

export const Route = createFileRoute('/api/listening/transcribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!process.env.GROQ_API_KEY) {
            console.error('[listening/transcribe] Missing GROQ_API_KEY')
            return Response.json({ error: 'Groq API key is not configured' }, { status: 500 })
          }

          const formData = await request.formData()
          const audioFile = formData.get('audio')

          if (!(audioFile instanceof File)) {
            return Response.json({ error: 'Audio file is required' }, { status: 400 })
          }

          if (audioFile.size === 0) {
            return Response.json({ error: 'Audio file is empty' }, { status: 400 })
          }

          if (audioFile.size > 25 * 1024 * 1024) {
            return Response.json(
              { error: 'File too large. Maximum size is 25MB' },
              { status: 400 },
            )
          }

          const arrayBuffer = await audioFile.arrayBuffer()
          const result = await transcribeAudio(new Uint8Array(arrayBuffer))
          return Response.json(result)
        } catch (error: any) {
          console.error('[listening/transcribe] Error:', error)
          return Response.json(
            {
              error: 'Failed to transcribe audio',
              details: error?.message ?? 'Unknown error',
            },
            { status: 500 },
          )
        }
      },

      GET: async () => {
        return Response.json({
          status: 'OK',
          hasApiKey: Boolean(process.env.GROQ_API_KEY),
        })
      },
    },
  },
})
