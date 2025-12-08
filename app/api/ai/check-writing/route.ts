import { NextRequest, NextResponse } from "next/server";
import { parseJSONResponse } from "@/lib/ai/llm";
import getAI from "@/lib/ai/llm";
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import { getUserInstructionLanguage } from "@/lib/hasura-queries";

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
    const { text, topic, level, userId } = await req.json();

    // Получаем язык инструкций пользователя
    let instructionLanguage = 'ru'; // По умолчанию русский
    if (userId) {
      try {
        const apolloClient = createAdminClient();
        const hasyx = new Hasyx(apolloClient, generate);
        instructionLanguage = await getUserInstructionLanguage(hasyx, userId);
      } catch (error) {
        console.warn('Failed to get user instruction language, using default:', error);
      }
    }

    const languageInstruction = instructionLanguage === 'ru'
      ? 'ВАЖНО: Все ответы должны быть на русском языке. Общий отзыв, области для улучшения, предложения и ошибки должны быть написаны на русском языке.'
      : `ВАЖНО: Все ответы должны быть на языке: ${instructionLanguage}.`;

    const prompt = `
      You are a writing assistant.
      Your task is to check the writing quality of the following text:
      Text: ${text}
      Topic: ${topic}
      Level: ${level}

      ${languageInstruction}

      Please provide a detailed feedback on the writing, including:
      - Overall quality (e.g., clarity, coherence, conciseness)
      - Specific areas for improvement (e.g., grammar, vocabulary, sentence structure)
      - Suggestions for better phrasing or word choice
      - Any potential errors or typos
      - Overall rating (1-5)

      Format your response as a JSON object with the following keys:
      {
        "overall_quality": "string",
        "specific_areas_for_improvement": "string[]",
        "suggestions": "string[]",
        "errors_or_typos": "string[]",
        "rating": "number"
      }
    `;

    const ai = getAI();
    const response = await ai.query({ role: 'user', content: prompt });

    if (!response) {
      throw new Error("AI returned an empty response.");
    }

    const feedback = parseJSONResponse<any>(response);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('AI Writing Check Error:', error);
    return NextResponse.json(
      { error: 'Failed to check writing' },
      { status: 500 }
    );
  }
}