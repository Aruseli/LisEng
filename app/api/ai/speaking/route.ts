import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/ai/claude-service';

export async function POST(req: NextRequest) {
  try {
    const { topic, level, conversationHistory } = await req.json();

    const response = await ClaudeService.conductSpeakingPractice(
      topic,
      level,
      conversationHistory
    );

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('AI Speaking Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}