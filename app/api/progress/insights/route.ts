import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { ProgressInsightsService } from '@/lib/lesson-snapshots';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { Hasyx, createApolloClient, Generator } = await import('hasyx');
    const { default: hasuraSchema } = await import('@/public/hasura-schema.json');

    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });

    const generate = Generator(hasuraSchema as any);
    const hasyx = new Hasyx(apolloClient, generate);

    // Создаем экземпляры зависимых сервисов
    const { ShuHaRiService, ScheduleService, LessonSnapshotService } = await import('@/lib/lesson-snapshots');

    const scheduleService = new ScheduleService(hasyx);
    const shuHaRiService = new ShuHaRiService(hasyx, scheduleService);
    const lessonSnapshotService = new LessonSnapshotService(hasyx);

    // Создаем сервис инсайтов
    const insightsService = new ProgressInsightsService(
      hasyx,
      lessonSnapshotService,
      shuHaRiService,
      scheduleService
    );

    // Получаем полную картину прогресса
    const progressInsights = await insightsService.getProgressInsights(session.user.id);

    return NextResponse.json({
      success: true,
      insights: progressInsights
    });

  } catch (error: any) {
    console.error('[progress/insights] Error:', error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Получить инсайты для генерации плана (используется DailyPlanService)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { days = 30 } = await request.json();

    const { Hasyx, createApolloClient, Generator } = await import('hasyx');
    const { default: hasuraSchema } = await import('@/public/hasura-schema.json');

    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });

    const generate = Generator(hasuraSchema as any);
    const hasyx = new Hasyx(apolloClient, generate);

    // Создаем экземпляры зависимых сервисов
    const { ShuHaRiService, ScheduleService, LessonSnapshotService } = await import('@/lib/lesson-snapshots');

    const scheduleService = new ScheduleService(hasyx);
    const shuHaRiService = new ShuHaRiService(hasyx, scheduleService);
    const lessonSnapshotService = new LessonSnapshotService(hasyx);

    // Создаем сервис инсайтов
    const insightsService = new ProgressInsightsService(
      hasyx,
      lessonSnapshotService,
      shuHaRiService,
      scheduleService
    );

    // Получаем инсайты для генерации плана
    const snapshotInsights = await insightsService.getSnapshotInsights(session.user.id, days);

    return NextResponse.json({
      success: true,
      snapshotInsights
    });

  } catch (error: any) {
    console.error('[progress/insights POST] Error:', error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
