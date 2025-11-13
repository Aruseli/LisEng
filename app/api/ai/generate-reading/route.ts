import { ClaudeService } from "@/lib/ai/claude-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { level, topic, wordCount } = await req.json();

    const task = await ClaudeService.generateReadingTask(
      level,
      topic,
      wordCount
    );

    return NextResponse.json(task);
  } catch (error) {
    console.error('AI Reading Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reading task' },
      { status: 500 }
    );
  }
}