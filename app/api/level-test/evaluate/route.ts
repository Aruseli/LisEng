import { NextRequest, NextResponse } from 'next/server';
import { LevelTestEvaluator } from '@/lib/level-test/evaluator';
import type { TestQuestion, UserAnswer } from '@/types/level-test';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questions, answers } = body as {
      questions: TestQuestion[];
      answers: UserAnswer[];
    };

    if (!questions || !answers) {
      return NextResponse.json(
        { error: 'questions and answers are required' },
        { status: 400 }
      );
    }

    const result = await LevelTestEvaluator.evaluateTest(questions, answers);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[level-test/evaluate] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to evaluate test' },
      { status: 500 }
    );
  }
}



