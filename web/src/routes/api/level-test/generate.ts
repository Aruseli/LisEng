import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { auth } from '#/lib/auth'
import type { Hasyx } from '@/lib/hasura/compat'
import { LevelTestGenerator } from '@/lib/ai/level-test-generator'

export const Route = createFileRoute('/api/level-test/generate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Проверяем наличие API ключа
          if (!process.env.OPENROUTER_API_KEY) {
            console.error('[level-test/generate] OPENROUTER_API_KEY is not set')
            return Response.json(
              {
                error:
                  'AI service is not configured. Please set OPENROUTER_API_KEY environment variable.',
              },
              { status: 500 },
            )
          }

          const body = await request.json().catch(() => ({}))
          const { estimatedLevel, includeSpeaking, includeWriting, userId } = body

          // Получаем userId из сессии, если не передан
          const session = await auth.api.getSession({ headers: request.headers })
          const effectiveUserId = userId || session?.user?.id

          // Создаем hasyx клиент, если есть userId
          let hasyx: Hasyx | undefined
          if (effectiveUserId) {
            try {
              hasyx = getAdminClient()
            } catch (error) {
              console.warn('[level-test/generate] Failed to create hasyx client:', error)
            }
          }

          console.log('[level-test/generate] Generating test with params:', {
            estimatedLevel: estimatedLevel || 'A2',
            includeSpeaking: includeSpeaking !== false,
            includeWriting: includeWriting !== false,
            userId: effectiveUserId,
          })

          const testData = await LevelTestGenerator.generateTest({
            estimatedLevel: estimatedLevel || 'A2',
            includeSpeaking: includeSpeaking !== false,
            includeWriting: includeWriting !== false,
            userId: effectiveUserId,
            hasyx,
          })

          console.log('[level-test/generate] Test generated successfully:', {
            questionCount: testData.questions.length,
            estimatedDuration: testData.estimatedDuration,
          })

          return Response.json({ test: testData })
        } catch (error: any) {
          console.error('[level-test/generate] Error:', error)
          console.error('[level-test/generate] Error details:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
          })

          // Определяем статус код в зависимости от типа ошибки
          let statusCode = 500
          let errorMessage = error?.message ?? 'Failed to generate test'

          // Если ошибка связана с кредитами, возвращаем 402 (Payment Required)
          if (
            errorMessage.includes('credit') ||
            errorMessage.includes('balance') ||
            errorMessage.includes('Insufficient credits')
          ) {
            statusCode = 402
            errorMessage =
              'Insufficient credits in your AI provider account. Please add credits to continue using AI features.'
          }

          return Response.json(
            {
              error: errorMessage,
              details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
            },
            { status: statusCode },
          )
        }
      },
    },
  },
})
