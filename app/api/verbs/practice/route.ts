import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import authOptions from '@/app/options';
import { VerbsService, PracticeResult } from '@/lib/verbs/verbs-service';

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { verbId, wasCorrect, responseTime, practiceMode } = body;

    if (!verbId || typeof wasCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: verbId, wasCorrect' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const verbsService = new VerbsService(hasyx);

    const result: PracticeResult = {
      verbId,
      wasCorrect,
      responseTime,
      practiceMode: practiceMode || 'form-to-meaning',
    };

    await verbsService.recordPracticeResult(session.user.id, verbId, result);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[POST /api/verbs/practice] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record practice result' },
      { status: 500 }
    );
  }
}

