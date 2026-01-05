import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { ShuHaRiService, ScheduleService } from '@/lib/lesson-snapshots';

interface CheckAnswer {
  questionId: string;
  answer: string;
}

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
    const { testId, answers } = body;

    // Валидация входных данных
    if (!testId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'testId and answers array are required' },
        { status: 400 }
      );
    }

    // Валидация формата answers
    for (const answer of answers) {
      if (!answer.questionId || typeof answer.answer !== 'string') {
        return NextResponse.json(
          { error: 'Each answer must have questionId and answer string' },
          { status: 400 }
        );
      }
    }

    console.log(`📝 Checking Shu-Ha-Ri test ${testId} for user ${userId}`);

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

    // Проверяем, что тест принадлежит пользователю
    const testRecord = await hasyx.select({
      table: 'shu_ha_ri_tests',
      where: {
        id: { _eq: testId },
        user_id: { _eq: userId }
      },
      returning: ['id', 'completed_at']
    });

    if (!testRecord || testRecord.length === 0) {
      return NextResponse.json(
        { error: 'Test not found or does not belong to user' },
        { status: 404 }
      );
    }

    const test = Array.isArray(testRecord) ? testRecord[0] : testRecord;

    // Проверяем, что тест еще не завершен
    if (test.completed_at) {
      return NextResponse.json(
        { error: 'Test already completed' },
        { status: 400 }
      );
    }

    // Проверяем тест через ShuHaRiService
    const result = await shuHaRiService.checkTest(testId, answers);

    // Обновляем расписание после завершения теста
    await shuHaRiService.updateScheduleAfterTest(userId, result);

    console.log(`✅ Checked Shu-Ha-Ri test ${testId}: score ${result.score}%, passed: ${result.passed}`);

    return NextResponse.json({
      success: true,
      result: {
        score: result.score,
        passed: result.passed,
        strengths: result.strengths,
        improvements: result.improvements,
        detailedFeedback: result.detailed_feedback,
        skillsProgress: result.skills_progress
      },
      message: result.passed ? 'Test passed! Great progress!' : 'Test completed. Keep practicing!'
    });

  } catch (error) {
    console.error('❌ Error checking Shu-Ha-Ri test:', error);
    return NextResponse.json(
      {
        error: 'Failed to check test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
