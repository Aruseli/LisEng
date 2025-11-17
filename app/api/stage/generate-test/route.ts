import { generateJSON } from '@/lib/ai/llm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { questions } = await req.json();

    if (!questions) {
      return NextResponse.json({ error: 'Questions are required' }, { status: 400 });
    }

    const prompt = `
      Based on the following questions, generate a new, similar set of test questions.
      Original Questions: ${JSON.stringify(questions)}
      Return a JSON object with a "questions" array.
    `;

    const result = await generateJSON<{ questions: Array<any> }>(prompt);

    return NextResponse.json({ questions: result.questions });
  } catch (error: any) {
    console.error(`Error in /api/stage/generate-test: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to generate test', details: error.message },
      { status: 500 },
    );
  }
}

