import { createFileRoute } from '@tanstack/react-router'

import { LessonScreen } from '@/components/app/lesson/LessonScreen'

export const Route = createFileRoute('/_app/lesson/$taskId')({
  component: LessonPage,
})

function LessonPage() {
  const { taskId } = Route.useParams()
  return <LessonScreen taskId={taskId} />
}
