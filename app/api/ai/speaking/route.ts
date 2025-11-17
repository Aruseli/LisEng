import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/ai/llm';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const provider = getProvider();
    const response = await provider.query(messages);

    return new Response(response.content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error: any) {
    console.error('[API /ai/speaking] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}