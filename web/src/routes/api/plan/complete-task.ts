import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { completeTask, updateStreak } from '@/lib/hasura-queries'

function taskCalendarDate(value: unknown): string | null {
  if (typeof value === 'string') {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value)
    return match?.[1] ?? null
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return null
}

export const Route = createFileRoute('/api/plan/complete-task')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const userId: string | undefined = body.userId
          const taskId: string | undefined = body.taskId

          if (!userId || !taskId) {
            return Response.json({ error: 'userId and taskId are required' }, { status: 400 })
          }

          const hasyx = getAdminClient()
          const row = await hasyx.select({
            table: 'daily_tasks',
            pk_columns: { id: taskId },
            returning: ['id', 'user_id', 'task_date'],
          })
          const task = Array.isArray(row) ? row[0] : row
          if (!task) {
            return Response.json({ error: 'Task not found' }, { status: 404 })
          }
          if (task.user_id !== userId) {
            return Response.json({ error: 'Forbidden' }, { status: 403 })
          }

          const taskDate = taskCalendarDate(task.task_date)
          if (!taskDate) {
            return Response.json({ error: 'Task date is missing' }, { status: 400 })
          }

          await completeTask(hasyx, taskId)
          const streak = await updateStreak(hasyx, userId, taskDate)

          return Response.json({ streak })
        } catch (error: any) {
          console.error('[plan/complete-task] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to complete task' },
            { status: 500 },
          )
        }
      },
    },
  },
})
