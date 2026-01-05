import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { ShuHaRiService, ScheduleService } from '@/lib/lesson-snapshots';

export async function POST(request: NextRequest) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { testType = 'comprehensive', force = false } = body;

    // Валидация типа теста
    const validTypes = ['shu', 'ha', 'ri', 'comprehensive'];
    if (!validTypes.includes(testType)) {
      return NextResponse.json(
        { error: 'Invalid test type. Must be: shu, ha, ri, or comprehensive' },
        { status: 400 }
      );
    }

    console.log(`🧠 Generating Shu-Ha-Ri test for user ${userId}, type: ${testType}`);

    // Импортируем сервисы
    const { Hasyx, createApolloClient, Generator } = await import('hasyx');
    const { default: hasuraSchema } = await import('@/public/hasura-schema.json');

    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });

    const generate = Generator(hasuraSchema as any);
    const hasyx = new Hasyx(apolloClient, generate);

    const scheduleService = new ScheduleService(hasyx);
    const shuHaRiService = new ShuHaRiService(hasyx, scheduleService);

    // Проверяем, можно ли создать тест
    const { created, testId, scheduleId } = await shuHaRiService.checkAndCreateWeeklyTest(userId);

    if (!created && !force) {
      return NextResponse.json({
        error: 'Test not ready yet. Minimum sessions requirement not met.',
        nextTestDate: shuHaRiService['calculateNextSunday'](Math.floor(Date.now() / 1000)),
        scheduleId
      }, { status: 400 });
    }

    // Если тест уже создан или force = true, генерируем новый
    const weekStart = shuHaRiService['getWeekStart']();
    const generatedTestId = await shuHaRiService.generateWeeklyTest(userId, weekStart, testType as any);

    console.log(`✅ Generated Shu-Ha-Ri test: ${generatedTestId}`);

    return NextResponse.json({
      success: true,
      testId: generatedTestId,
      testType,
      weekStart: weekStart.toISOString(),
      message: 'Shu-Ha-Ri test generated successfully'
    });

  } catch (error) {
    console.error('❌ Error generating Shu-Ha-Ri test:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
