/**
 * Проверка carry-over: вчерашняя pending-задача переносится в сегодня
 * при мягкой генерации (regenerate: false). Тестовые данные удаляются.
 *
 * Запуск: node_modules/.bin/tsx --env-file=.env scripts/verify-carry-over.ts
 */
import { getAdminClient } from '../src/lib/hasura'
import { DailyPlanService } from '../src/lib/plan/daily-plan-service'
import {
  LessonSnapshotService,
  ShuHaRiService,
  ProgressInsightsService,
  ScheduleService,
} from '../src/lib/lesson-snapshots'

const USER_ID = 'a219174a-2c4b-4916-9a88-11f7e48a8362'
const TODAY = '2026-09-12'
const YESTERDAY = '2026-09-11'
const TEST_TITLE = '__carryover_test__'

async function main() {
  const hasyx = getAdminClient()

  // 1. Вчерашняя pending-задача с типом, которого нет сегодня (listening)
  const inserted = await hasyx.insert({
    table: 'daily_tasks',
    object: {
      user_id: USER_ID,
      task_date: YESTERDAY,
      type: 'listening',
      title: TEST_TITLE,
      duration_minutes: 10,
      status: 'pending',
    },
    returning: ['id'],
  })
  const taskId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id
  console.log('1. Тестовая задача создана:', taskId)

  try {
    // 2. Мягкая генерация на сегодня
    const scheduleService = new ScheduleService(hasyx)
    const shuHaRiService = new ShuHaRiService(hasyx, scheduleService)
    const progressInsightsService = new ProgressInsightsService(
      hasyx,
      new LessonSnapshotService(hasyx),
      shuHaRiService,
      scheduleService,
    )
    const service = new DailyPlanService(hasyx, progressInsightsService)
    const plan = await service.generateDailyPlan({
      userId: USER_ID,
      targetDate: TODAY,
      regenerate: false,
    })

    // 3. Проверка: задача перенесена на сегодня с пометкой carriedOverFrom
    const moved = plan.tasks.find((t: any) => t.id === taskId) as any
    if (!moved) throw new Error('Задача НЕ перенесена в сегодняшний план')
    if (moved.task_date !== TODAY) throw new Error(`task_date = ${moved.task_date}, ожидали ${TODAY}`)
    if (moved.ai_context?.carriedOverFrom !== YESTERDAY) {
      throw new Error(`carriedOverFrom = ${JSON.stringify(moved.ai_context)}`)
    }
    console.log('2. Задача перенесена:', moved.task_date, 'carriedOverFrom =', moved.ai_context.carriedOverFrom)

    // 4. Вчера задач не осталось
    const yesterdayTasks = await hasyx.select({
      table: 'daily_tasks',
      where: { user_id: { _eq: USER_ID }, task_date: { _eq: YESTERDAY } },
      returning: ['id'],
    })
    const remaining = Array.isArray(yesterdayTasks) ? yesterdayTasks.length : 0
    if (remaining > 0) throw new Error(`На вчера осталось задач: ${remaining}`)
    console.log('3. На вчера задач не осталось')

    console.log('CARRYOVER_OK')
  } finally {
    // Чистим тестовую задачу
    await hasyx.delete({ table: 'daily_tasks', pk_columns: { id: taskId } })
    console.log('Тестовая задача удалена')
  }
}

main().catch((error) => {
  console.error('CARRYOVER_FAIL:', error)
  process.exit(1)
})
