import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { ScheduleService, ShuHaRiService } from '#/lib/lesson-snapshots'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

export const Route = createFileRoute('/api/shu-ha-ri/generate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Проверяем аутентификацию
          const who = await requireUserId(request)
          if (who instanceof Response) return who

          const userId = who.userId
          const body = await request.json()
          const { testType = 'comprehensive', force = false } = body

          // Валидация типа теста
          const validTypes = ['shu', 'ha', 'ri', 'comprehensive']
          if (!validTypes.includes(testType)) {
            return jsonError('Invalid test type. Must be: shu, ha, ri, or comprehensive', 400)
          }

          console.log(`🧠 Generating Shu-Ha-Ri test for user ${userId}, type: ${testType}`)

          const hasyx = getAdminClient()

          const scheduleService = new ScheduleService(hasyx)
          const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)

          // Проверяем, можно ли создать тест
          const { created, testId, scheduleId } =
            await shuHaRiService.checkAndCreateWeeklyTest(userId)

          if (!created && !force) {
            return Response.json(
              {
                error: 'Test not ready yet. Minimum sessions requirement not met.',
                // В оригинале метод вызывался у shuHaRiService, но он определён в ScheduleService
                nextTestDate: scheduleService['calculateNextSunday'](
                  Math.floor(Date.now() / 1000),
                ),
                scheduleId,
              },
              { status: 400 },
            )
          }

          // Если тест уже создан или force = true, генерируем новый
          const weekStart = shuHaRiService['getWeekStart']()
          const generatedTestId = await shuHaRiService.generateWeeklyTest(
            userId,
            weekStart,
            testType as any,
          )

          console.log(`✅ Generated Shu-Ha-Ri test: ${generatedTestId}`)

          return Response.json({
            success: true,
            testId: generatedTestId,
            testType,
            weekStart: weekStart.toISOString(),
            message: 'Shu-Ha-Ri test generated successfully',
          })
        } catch (error) {
          console.error('❌ Error generating Shu-Ha-Ri test:', error)
          return Response.json(
            {
              error: 'Failed to generate test',
              details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
