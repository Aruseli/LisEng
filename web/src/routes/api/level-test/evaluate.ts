import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { auth } from '#/lib/auth'
import type { Hasyx } from '@/lib/hasura/compat'
import { LevelTestEvaluator } from '@/lib/level-test/evaluator'
import type { TestQuestion, UserAnswer } from '@/types/level-test'

export const Route = createFileRoute('/api/level-test/evaluate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { questions, answers, userId } = body as {
            questions: TestQuestion[]
            answers: UserAnswer[]
            userId?: string
          }

          if (!questions || !answers) {
            return Response.json(
              { error: 'questions and answers are required' },
              { status: 400 },
            )
          }

          // Получаем userId из сессии, если не передан
          const session = await auth.api.getSession({ headers: request.headers })
          const effectiveUserId = userId || session?.user?.id

          // Создаем hasyx клиент, если есть userId
          let hasyx: Hasyx | undefined
          if (effectiveUserId) {
            try {
              hasyx = getAdminClient()
            } catch (error) {
              console.warn('[level-test/evaluate] Failed to create hasyx client:', error)
            }
          }

          const result = await LevelTestEvaluator.evaluateTest(
            questions,
            answers,
            effectiveUserId,
            hasyx,
          )

          return Response.json(result)
        } catch (error: any) {
          console.error('[level-test/evaluate] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to evaluate test' },
            { status: 500 },
          )
        }
      },
    },
  },
})
