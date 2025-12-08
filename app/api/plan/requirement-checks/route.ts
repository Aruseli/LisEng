import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import {
  getActiveStageProgress,
  getStageRequirements,
  getWeeklyStructureForStage,
  getLatestProgressMetric,
} from '@/lib/hasura-queries';
import { StageProgressionService } from '@/lib/stage-progression';
import { updateStageProgressStats } from '@/lib/hasura-queries';

const generate = Generator(schema as any);

function createAdminClient(): HasyxApolloClient {
  const url = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  if (!url || !secret) {
    throw new Error('Hasura admin credentials are not configured');
  }

  return createApolloClient({
    url,
    secret,
    ws: false,
  }) as HasyxApolloClient;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;
    const stageId = searchParams.get('stageId') ?? undefined;

    if (!userId || !stageId) {
      return NextResponse.json(
        { error: 'userId and stageId are required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    // Получаем данные для вычисления requirementChecks
    const [stageProgress, requirements, weeklyStructure, latestMetrics] = await Promise.all([
      getActiveStageProgress(hasyx, userId),
      getStageRequirements(hasyx, stageId),
      getWeeklyStructureForStage(hasyx, stageId),
      getLatestProgressMetric(hasyx, userId),
    ]);

    if (!stageProgress || !Array.isArray(requirements) || requirements.length === 0) {
      return NextResponse.json({ requirementChecks: [] });
    }

    const averageAccuracyFromMetrics = StageProgressionService.calculateAverageAccuracy(
      latestMetrics ?? {}
    );

    const stageProgressData = {
      tasks_completed: stageProgress.tasks_completed ?? 0,
      tasks_total: stageProgress.tasks_total ?? (Array.isArray(weeklyStructure) ? weeklyStructure.length : 0),
      words_learned: stageProgress.words_learned ?? 0,
      errors_pending: stageProgress.errors_pending ?? 0,
      average_accuracy:
        stageProgress.average_accuracy ??
        averageAccuracyFromMetrics ??
        0,
      status: (stageProgress.status ??
        'in_progress') as Parameters<typeof StageProgressionService.checkStageRequirements>[0]['status'],
    };

    // Обновляем average_accuracy если нужно
    if (
      stageProgress?.id &&
      typeof averageAccuracyFromMetrics === 'number' &&
      !stageProgress.average_accuracy
    ) {
      await updateStageProgressStats(hasyx, stageProgress.id, {
        averageAccuracy: averageAccuracyFromMetrics,
      });
    }

    const requirementChecks = StageProgressionService.checkStageRequirements(
      stageProgressData,
      requirements
    );

    return NextResponse.json({ requirementChecks });
  } catch (error: any) {
    console.error('[plan/requirement-checks] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to load requirement checks' },
      { status: 500 }
    );
  }
}

