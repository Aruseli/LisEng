import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import { DailyPlanService } from '@/lib/plan/daily-plan-service';
import { ClaudeService } from '@/lib/ai/claude-service';
import { getUserProfile } from '@/lib/hasura-queries';

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
    const body = await request.json().catch(() => ({}));
    const { userId, date, plan: planPayload } = body as {
      userId?: string;
      date?: string;
      plan?: any;
    };

    if (!userId && !planPayload) {
      return NextResponse.json(
        { error: 'Either userId or plan payload is required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const planService = new DailyPlanService(hasyx);

    const plan =
      planPayload ??
      (userId
        ? await planService.getDailyPlan(userId, date)
        : null);

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan data is not available' },
        { status: 404 }
      );
    }

    const user = plan && userId
      ? await getUserProfile(hasyx, userId)
      : null;

    const summary = await ClaudeService.generatePlanSummary({
      userName: user?.name,
      level: user?.current_level ?? 'A2',
      targetLevel: user?.target_level,
      date: plan.date,
      focus: plan.focus,
      tasks: (plan.tasks || []).map((task: any) => ({
        type: task.type,
        title: task.title,
        status: task.status,
      })),
      requirementChecks: (plan.requirementChecks || []).map((check: any) => ({
        message: check.message,
        met: check.met,
      })),
    });

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('[ai/plan-summary] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate plan summary' },
      { status: 500 }
    );
  }
}


