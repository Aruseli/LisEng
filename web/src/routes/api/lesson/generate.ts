import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import type { Hasyx } from '@/lib/hasura/compat'
import { LessonContentService } from '@/lib/lesson/lesson-content-service'

async function getTask(hasyx: Hasyx, taskId: string) {
  const task = await hasyx.select({
    table: 'daily_tasks',
    pk_columns: { id: taskId },
    returning: ['id', 'user_id', 'type', 'title', 'description', 'type_specific_payload'],
  })
  return task as {
    id: string
    user_id: string
    type: string
    title: string
    description?: string | null
    type_specific_payload?: Record<string, any> | null
  } | null
}

export const Route = createFileRoute('/api/lesson/generate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const userId: string | undefined = body.userId
          const taskId: string | undefined = body.taskId

          if (!userId || !taskId) {
            return Response.json(
              { error: 'userId and taskId are required' },
              { status: 400 },
            )
          }

          const hasyx = getAdminClient()

          const task = await getTask(hasyx, taskId)
          if (!task) {
            return Response.json({ error: 'Task not found' }, { status: 404 })
          }
          if (task.user_id !== userId) {
            return Response.json(
              { error: 'Task does not belong to user' },
              { status: 403 },
            )
          }

          const lessonService = new LessonContentService(hasyx)
          const lesson = await lessonService.getOrGenerateLesson({
            userId,
            task,
          })

          return Response.json({ lesson })
        } catch (error: any) {
          console.error('[lesson/generate] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to generate lesson' },
            { status: 500 },
          )
        }
      },
    },
  },
})
