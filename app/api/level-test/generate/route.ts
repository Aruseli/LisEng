import { NextRequest, NextResponse } from 'next/server';
import { LevelTestGenerator } from '@/lib/ai/level-test-generator';

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
    const { estimatedLevel, includeSpeaking, includeWriting } = body;

    console.log('[level-test/generate] Generating test with params:', {
      estimatedLevel: estimatedLevel || 'A2',
      includeSpeaking: includeSpeaking !== false,
      includeWriting: includeWriting !== false,
    });

    const testData = await LevelTestGenerator.generateTest({
      estimatedLevel: estimatedLevel || 'A2',
      includeSpeaking: includeSpeaking !== false,
      includeWriting: includeWriting !== false,
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



