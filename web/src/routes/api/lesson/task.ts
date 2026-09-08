import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'

export const Route = createFileRoute('/api/lesson/task')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const searchParams = new URL(request.url).searchParams
          const taskId = searchParams.get('taskId')

          if (!taskId) {
            return Response.json({ error: 'taskId is required' }, { status: 400 })
          }

          const hasyx = getAdminClient()

          const task = await hasyx.select({
            table: 'daily_tasks',
            pk_columns: { id: taskId },
            returning: ['id', 'type', 'type_specific_payload'],
          })

          const taskData = Array.isArray(task) ? task[0] : task
          if (!taskData) {
            return Response.json({ error: 'Task not found' }, { status: 404 })
          }

          return Response.json({
            type_specific_payload: taskData.type_specific_payload ?? {},
          })
        } catch (error: any) {
          console.error('[lesson/task] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to get task' },
            { status: 500 },
          )
        }
      },
    },
  },
})
