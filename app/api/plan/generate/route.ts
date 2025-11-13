import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import { DailyPlanService } from '@/lib/plan/daily-plan-service';

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

export async function POST(request: NextRequest) {
  try {
    const hasuraEventSecret =
      request.headers.get('x-hasura-event-secret') ||
      request.headers.get('X-Hasura-Event-Secret');
    const expectedSecret = process.env.HASURA_EVENT_SECRET;

    if (hasuraEventSecret && expectedSecret && hasuraEventSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: invalid event secret' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const userId: string | undefined = body.userId;
    const targetDate: string | undefined = body.date;
    const regenerate: boolean = Boolean(body.regenerate);
    const forceAi: boolean = Boolean(body.forceAi);

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const dailyPlanService = new DailyPlanService(hasyx);
    const plan = await dailyPlanService.generateDailyPlan({
      userId,
      targetDate,
      regenerate,
      forceAi,
    });

    return NextResponse.json({ plan });
  } catch (error: any) {
    console.error('[plan/generate] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate plan' },
      { status: 500 }
    );
  }
}


