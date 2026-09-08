import { createFileRoute } from '@tanstack/react-router'

import getAI, { parseJSONResponse } from '#/lib/ai/llm'
import { getAdminClient } from '#/lib/hasura'
import { getUserInstructionLanguage } from '#/lib/hasura-queries'

export const Route = createFileRoute('/api/ai/check-writing')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { text, topic, level, userId } = await request.json()

          // Получаем язык инструкций пользователя
          let instructionLanguage = 'ru' // По умолчанию русский
          if (userId) {
            try {
              instructionLanguage = await getUserInstructionLanguage(getAdminClient(), userId)
            } catch (error) {
              console.warn('Failed to get user instruction language, using default:', error)
            }
          }

          const languageInstruction =
            instructionLanguage === 'ru'
              ? 'ВАЖНО: Все ответы должны быть на русском языке. Общий отзыв, области для улучшения, предложения и ошибки должны быть написаны на русском языке.'
              : `ВАЖНО: Все ответы должны быть на языке: ${instructionLanguage}.`

          const prompt = `
      You are a writing assistant.
      Your task is to check the writing quality of the following text:
      Text: ${text}
      Topic: ${topic}
      Level: ${level}

      ${languageInstruction}

      Please provide a detailed feedback on the writing, including:
      - Overall quality (e.g., clarity, coherence, conciseness)
      - Specific areas for improvement (e.g., grammar, vocabulary, sentence structure)
      - Suggestions for better phrasing or word choice
      - Any potential errors or typos
      - Overall rating (1-5)

      Format your response as a JSON object with the following keys:
      {
        "overall_quality": "string",
        "specific_areas_for_improvement": "string[]",
        "suggestions": "string[]",
        "errors_or_typos": "string[]",
        "rating": "number"
      }
    `

          const ai = getAI()
          const response = await ai.query({ role: 'user', content: prompt })

          if (!response) {
            throw new Error('AI returned an empty response.')
          }

          const feedback = parseJSONResponse<any>(response)

          return Response.json(feedback)
        } catch (error) {
          console.error('AI Writing Check Error:', error)
          return Response.json({ error: 'Failed to check writing' }, { status: 500 })
        }
      },
    },
  },
})
