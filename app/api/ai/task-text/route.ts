import { NextRequest, NextResponse } from 'next/server';

import { ClaudeService } from '@/lib/ai/claude-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, level, topic, context } = body as {
      type?: 'speaking' | 'writing' | 'reading' | 'listening';
      level?: string;
      topic?: string;
      context?: string;
    };

    if (!type || !level || !topic) {
      return NextResponse.json(
        { error: 'type, level and topic are required' },
        { status: 400 }
      );
    }

    const result = await ClaudeService.generateTaskPrompt({
      type,
      level,
      topic,
      context,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[ai/task-text] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate task prompt' },
      { status: 500 }
    );
  }
}


