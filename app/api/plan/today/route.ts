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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? undefined;
    const targetDate = searchParams.get('date') ?? undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const service = new DailyPlanService(hasyx);
    const plan = await service.getDailyPlan(userId, targetDate ?? undefined);

    return NextResponse.json({ plan });
  } catch (error: any) {
    console.error('[plan/today] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to load plan' },
      { status: 500 }
    );
  }
}


