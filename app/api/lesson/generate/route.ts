import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';

import schema from '@/public/hasura-schema.json';
import { LessonContentService } from '@/lib/lesson/lesson-content-service';

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

async function getTask(hasyx: Hasyx, taskId: string) {
  const task = await hasyx.select({
    table: 'daily_tasks',
    pk_columns: { id: taskId },
    returning: ['id', 'user_id', 'type', 'title', 'description', 'type_specific_payload'],
  });
  return task as {
    id: string;
    user_id: string;
    type: string;
    title: string;
    description?: string | null;
    type_specific_payload?: Record<string, any> | null;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId: string | undefined = body.userId;
    const taskId: string | undefined = body.taskId;

    if (!userId || !taskId) {
      return NextResponse.json(
        { error: 'userId and taskId are required' },
        { status: 400 }
      );
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const task = await getTask(hasyx, taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    if (task.user_id !== userId) {
      return NextResponse.json({ error: 'Task does not belong to user' }, { status: 403 });
    }

    const lessonService = new LessonContentService(hasyx);
    const lesson = await lessonService.getOrGenerateLesson({
      userId,
      task,
    });

    return NextResponse.json({ lesson });
  } catch (error: any) {
    console.error('[lesson/generate] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}


