import { ClaudeService } from "@/lib/ai/claude-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { grammarTopic, level, count } = await req.json();

    const exercises = await ClaudeService.generateGrammarDrill(
      grammarTopic,
      level,
      count
    );

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('AI Grammar Drill Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate grammar drill' },
      { status: 500 }
    );
  }
}