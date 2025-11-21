import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import authOptions from '@/app/options';

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
    const { verbsPracticed, accuracy, durationMinutes } = body;

    if (typeof verbsPracticed !== 'number' || typeof accuracy !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: verbsPracticed, accuracy' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    await hasyx.insert({
      table: 'verb_practice_sessions',
      object: {
        user_id: session.user.id,
        session_date: new Date().toISOString().split('T')[0],
        verbs_practiced: verbsPracticed,
        accuracy: Math.round(accuracy * 100) / 100,
        duration_minutes: durationMinutes || 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[POST /api/verbs/practice-session] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save practice session' },
      { status: 500 }
    );
  }
}

