import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import { LessonCompletionService } from '@/lib/lesson/lesson-completion-service';

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
    const taskId: string | undefined = body.taskId;
    const pronunciation = body.pronunciation;
    const flashcardResults = body.flashcardResults;
    const conversationData = body.conversationData;
    const voiceMessagesData = body.voiceMessagesData;

    if (!userId || !taskId) {
      return NextResponse.json(
        { error: 'userId and taskId are required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const completionService = new LessonCompletionService(hasyx);
    const result = await completionService.completeLesson({
      userId,
      taskId,
      pronunciation,
      flashcardResults,
      conversationData,
      voiceMessagesData,
    });

    return NextResponse.json({
      snapshotId: result.snapshotId,
      flaggedWords: result.flaggedWords,
    });
  } catch (error: any) {
    console.error('[lesson/complete] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}


