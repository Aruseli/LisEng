import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service';
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
    const userId: string | undefined = body.userId;
    const level: string | undefined = body.level;
    const words: string[] | undefined = body.words;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const profile = await getUserProfile(hasyx, userId);
    const derivedLevel = level || profile?.current_level || 'A2';

    const service = new VocabularyGenerationService(hasyx);
    const stored = await service.generateCardsForUser({
      userId,
      level: derivedLevel,
      words,
      snapshotInsights: null,
    });

    return NextResponse.json({
      created: stored.length,
      cards: stored,
    });
  } catch (error: any) {
    console.error('[vocabulary/generate-cards] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate vocabulary cards' },
      { status: 500 }
    );
  }
}


