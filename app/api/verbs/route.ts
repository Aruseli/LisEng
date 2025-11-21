import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import authOptions from '@/app/options';
import { VerbsService } from '@/lib/verbs/verbs-service';

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

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const verbsService = new VerbsService(hasyx);

    const searchParams = request.nextUrl.searchParams;
    const group = searchParams.get('group');
    const frequency = searchParams.get('frequency') as 'must_know' | 'high' | 'medium' | 'low' | null;
    const includeProgress = searchParams.get('includeProgress') === 'true';
    const includeExamples = searchParams.get('includeExamples') === 'true';

    const verbs = await verbsService.getVerbs({
      group: group ? parseInt(group) : undefined,
      frequency: frequency || undefined,
      userId: includeProgress ? session.user.id : undefined,
      includeProgress,
      includeExamples,
    });

    return NextResponse.json({ verbs });
  } catch (error: any) {
    console.error('[GET /api/verbs] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch verbs' },
      { status: 500 }
    );
  }
}

