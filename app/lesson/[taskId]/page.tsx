import { LessonScreen } from '@/components/app/lesson/LessonScreen';

interface LessonPageProps {
  params: {
    taskId: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return <LessonScreen taskId={params.taskId} />;
}


