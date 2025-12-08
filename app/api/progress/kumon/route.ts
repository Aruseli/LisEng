import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';

import schema from '@/public/hasura-schema.json';
import { getKumonProgress } from '@/lib/hasura-queries';

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const kumonProgress = await getKumonProgress(hasyx, userId);
    const progressArray = Array.isArray(kumonProgress) ? kumonProgress : [kumonProgress].filter(Boolean);

    return NextResponse.json({ skills: progressArray });
  } catch (error: any) {
    console.error('[progress/kumon] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to load Kumon progress' },
      { status: 500 }
    );
  }
}

