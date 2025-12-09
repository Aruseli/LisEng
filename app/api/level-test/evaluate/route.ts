import { NextRequest, NextResponse } from 'next/server';
import { LevelTestEvaluator } from '@/lib/level-test/evaluator';
import type { TestQuestion, UserAnswer } from '@/types/level-test';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questions, answers, userId } = body as {
      questions: TestQuestion[];
      answers: UserAnswer[];
      userId?: string;
    };

    if (!questions || !answers) {
      return NextResponse.json(
        { error: 'questions and answers are required' },
        { status: 400 }
      );
    }

    // Получаем userId из сессии, если не передан
    const session = await getServerSession(authOptions);
    const effectiveUserId = userId || session?.user?.id;

    // Создаем hasyx клиент, если есть userId
    let hasyx: Hasyx | undefined;
    if (effectiveUserId) {
      try {
        const apolloClient = createAdminClient();
        hasyx = new Hasyx(apolloClient, generate);
      } catch (error) {
        console.warn('[level-test/evaluate] Failed to create hasyx client:', error);
      }
    }

    const result = await LevelTestEvaluator.evaluateTest(questions, answers, effectiveUserId, hasyx);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[level-test/evaluate] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to evaluate test' },
      { status: 500 }
    );
  }
}



