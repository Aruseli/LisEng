import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);

    const task = await hasyx.select({
      table: 'daily_tasks',
      pk_columns: { id: taskId },
      returning: ['id', 'type', 'type_specific_payload'],
    });

    const taskData = Array.isArray(task) ? task[0] : task;
    if (!taskData) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      type_specific_payload: taskData.type_specific_payload ?? {},
    });
  } catch (error: any) {
    console.error('[lesson/task] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to get task' },
      { status: 500 }
    );
  }
}

