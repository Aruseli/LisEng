import { createFileRoute } from '@tanstack/react-router'

import { getAdminClient } from '#/lib/hasura'
import { LessonCompletionService } from '@/lib/lesson/lesson-completion-service'

export const Route = createFileRoute('/api/lesson/complete')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}))
          const userId: string | undefined = body.userId
          const taskId: string | undefined = body.taskId
          const pronunciation = body.pronunciation
          const flashcardResults = body.flashcardResults
          const exerciseResults = body.exerciseResults
          const conversationData = body.conversationData
          const voiceMessagesData = body.voiceMessagesData

          if (!userId || !taskId) {
            return Response.json(
              { error: 'userId and taskId are required' },
              { status: 400 },
            )
          }

          const hasyx = getAdminClient()

          const completionService = new LessonCompletionService(hasyx)
          const result = await completionService.completeLesson({
            userId,
            taskId,
            pronunciation,
            flashcardResults,
            exerciseResults,
            conversationData,
            voiceMessagesData,
          })

          return Response.json({
            snapshotId: result.snapshotId,
            flaggedWords: result.flaggedWords,
          })
        } catch (error: any) {
          console.error('[lesson/complete] Error:', error)
          return Response.json(
            { error: error?.message ?? 'Failed to complete lesson' },
            { status: 500 },
          )
        }
      },
    },
  },
})
