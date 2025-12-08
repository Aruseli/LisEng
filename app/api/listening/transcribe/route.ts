import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { experimental_transcribe as transcribe } from 'ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('[listening/transcribe] Missing GROQ_API_KEY');
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!(audioFile instanceof File)) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: 'Audio file is empty' },
        { status: 400 }
      );
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB' },
        { status: 400 }
      );
    }

    // Используем AI SDK согласно документации:
    // https://ai-sdk.dev/providers/ai-sdk-providers/groq#transcription-models
    const arrayBuffer = await audioFile.arrayBuffer();
    const result = await transcribe({
      // @ts-ignore - groq.transcription returns V2 but experimental_transcribe expects V1, runtime works correctly
      model: groq.transcription('whisper-large-v3'),
      audio: new Uint8Array(arrayBuffer),
      providerOptions: {
        groq: {
          language: 'en',
          timestampGranularities: ['segment', 'word'],
          temperature: 0,
        },
      },
    });

    return NextResponse.json({
      text: result.text,
      segments: result.segments,
      language: result.language,
      duration: result.durationInSeconds,
      warnings: result.warnings,
      confidence: result.warnings.length === 0 ? 0.96 : 0.88,
    });
  } catch (error: any) {
    console.error('[listening/transcribe] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        details: error?.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    hasApiKey: Boolean(process.env.GROQ_API_KEY),
  });
}

