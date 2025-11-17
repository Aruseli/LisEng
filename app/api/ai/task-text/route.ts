import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import getAI, { generateJSON } from '@/lib/ai/llm';

const schema = z.object({
  type: z.string().optional(),
  level: z.string().optional(),
  topic: z.string().optional(),
  context: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { task_type, level, topic, context } = await request.json();
    const result = await generateJSON<any>(`
      Generate a task prompt for the following request:
      Task Type: ${task_type}
      Level: ${level}
      Topic: ${topic}
      Context: ${JSON.stringify(context)}
      Return a JSON object with the task details.
    `);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[ai/task-text] Error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate task prompt' },
      { status: 500 }
    );
  }
}


