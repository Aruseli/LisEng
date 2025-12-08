import { LessonScreen } from '@/components/app/lesson/LessonScreen';

interface LessonPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { taskId } = await params;
  return <LessonScreen taskId={taskId} />;
}


