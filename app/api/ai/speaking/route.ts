import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/ai/claude-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { topic, level, conversationHistory } = body;

    if (!topic || !level) {
      return NextResponse.json(
        { error: 'topic and level are required' },
        { status: 400 }
      );
    }

    // Валидация conversationHistory
    const validHistory = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (msg: any) =>
            msg &&
            typeof msg === 'object' &&
            (msg.role === 'user' || msg.role === 'assistant') &&
            typeof msg.content === 'string'
        )
      : [];

    const response = await ClaudeService.conductSpeakingPractice(
      String(topic),
      String(level),
      validHistory
    );

    return NextResponse.json({ message: response });
  } catch (error: any) {
    console.error('AI Speaking Error:', error);
    return NextResponse.json(
      {
        error: error?.message ?? 'Failed to generate response',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}