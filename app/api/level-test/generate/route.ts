import { NextRequest, NextResponse } from 'next/server';
import { LevelTestGenerator } from '@/lib/ai/level-test-generator';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';

const generate = Generator(schema as any);

function createAdminClient(): HasyxApolloClient {
  const url = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  if (!url || !secret) {
    throw new Error('Hasura admin credentials are not configured');
  }

  return createApolloClient({
    url,
    secret,
    ws: false,
  }) as HasyxApolloClient;
}

export async function POST(req: NextRequest) {
  try {
    // Проверяем наличие API ключа
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('[level-test/generate] OPENROUTER_API_KEY is not set');
      return NextResponse.json(
        { error: 'AI service is not configured. Please set OPENROUTER_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { estimatedLevel, includeSpeaking, includeWriting, userId } = body;

    // Получаем userId из сессии, если не передан
    const session = await getServerSession(authOptions);
    const effectiveUserId = userId || session?.user?.id;

    // Создаем hasyx клиент, если есть userId
    let hasyx: Hasyx | undefined;
    if (effectiveUserId) {
      try {
        const apolloClient = createAdminClient();
        hasyx = new Hasyx(apolloClient, generate);
      } catch (error) {
        console.warn('[level-test/generate] Failed to create hasyx client:', error);
      }
    }

    console.log('[level-test/generate] Generating test with params:', {
      estimatedLevel: estimatedLevel || 'A2',
      includeSpeaking: includeSpeaking !== false,
      includeWriting: includeWriting !== false,
      userId: effectiveUserId,
    });

    const testData = await LevelTestGenerator.generateTest({
      estimatedLevel: estimatedLevel || 'A2',
      includeSpeaking: includeSpeaking !== false,
      includeWriting: includeWriting !== false,
      userId: effectiveUserId,
      hasyx,
    });

    console.log('[level-test/generate] Test generated successfully:', {
      questionCount: testData.questions.length,
      estimatedDuration: testData.estimatedDuration,
    });

    return NextResponse.json({ test: testData });
  } catch (error: any) {
    console.error('[level-test/generate] Error:', error);
    console.error('[level-test/generate] Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    
    // Определяем статус код в зависимости от типа ошибки
    let statusCode = 500;
    let errorMessage = error?.message ?? 'Failed to generate test';
    
    // Если ошибка связана с кредитами, возвращаем 402 (Payment Required)
    if (errorMessage.includes('credit') || errorMessage.includes('balance') || errorMessage.includes('Insufficient credits')) {
      statusCode = 402;
      errorMessage = 'Insufficient credits in your AI provider account. Please add credits to continue using AI features.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: statusCode }
    );
  }
}



