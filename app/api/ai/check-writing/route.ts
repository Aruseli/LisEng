import { ClaudeService } from "@/lib/ai/claude-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, topic, level } = await req.json();

    const feedback = await ClaudeService.checkWriting(text, topic, level);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('AI Writing Check Error:', error);
    return NextResponse.json(
      { error: 'Failed to check writing' },
      { status: 500 }
    );
  }
}