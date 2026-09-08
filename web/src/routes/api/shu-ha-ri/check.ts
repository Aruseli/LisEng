import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { ScheduleService, ShuHaRiService } from '#/lib/lesson-snapshots'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/shu-ha-ri/check')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Проверяем аутентификацию
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const userId = who.userId
          const body = await request.json()
          const { testId, answers } = body

          // Валидация входных данных
          if (!testId || !Array.isArray(answers)) {
            return jsonError('testId and answers array are required', 400)
          }

          // Валидация формата answers
          for (const answer of answers) {
            if (!answer.questionId || typeof answer.answer !== 'string') {
              return jsonError('Each answer must have questionId and answer string', 400)
            }
          }

          console.log(`📝 Checking Shu-Ha-Ri test ${testId} for user ${userId}`)

          const hasyx = getAdminClient()

          const scheduleService = new ScheduleService(hasyx)
          const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)

          // Проверяем, что тест принадлежит пользователю
          const testRecord = await hasyx.select({
            table: 'shu_ha_ri_tests',
            where: {
              id: { _eq: testId },
              user_id: { _eq: userId },
            },
            returning: ['id', 'completed_at'],
          })

          if (!testRecord || testRecord.length === 0) {
            return jsonError('Test not found or does not belong to user', 404)
          }

          const test = Array.isArray(testRecord) ? testRecord[0] : testRecord

          // Проверяем, что тест еще не завершен
          if (test.completed_at) {
            return jsonError('Test already completed', 400)
          }

          // Проверяем тест через ShuHaRiService
          const result = await shuHaRiService.checkTest(testId, answers)

          // Обновляем расписание после завершения теста
          await shuHaRiService.updateScheduleAfterTest(userId, result)

          console.log(
            `✅ Checked Shu-Ha-Ri test ${testId}: score ${result.score}%, passed: ${result.passed}`,
          )

          return Response.json({
            success: true,
            result: {
              score: result.score,
              passed: result.passed,
              strengths: result.strengths,
              improvements: result.improvements,
              detailedFeedback: result.detailed_feedback,
              skillsProgress: result.skills_progress,
            },
            message: result.passed
              ? 'Test passed! Great progress!'
              : 'Test completed. Keep practicing!',
          })
        } catch (error) {
          console.error('❌ Error checking Shu-Ha-Ri test:', error)
          return Response.json(
            {
              error: 'Failed to check test',
              details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
