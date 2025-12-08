import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai/llm';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import { getUserInstructionLanguage } from '@/lib/hasura-queries';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';

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

interface AnalyzeVoiceRequest {
  transcription: string;
  targetWords?: string[];
  level?: string;
  userId?: string;
}

interface VoiceFeedback {
  pronunciation: {
    score: number;
    feedback: string;
    issues: string[];
  };
  vocabulary: {
    targetWordsUsed: string[];
    missingWords: string[];
    feedback: string;
    suggestions: Array<{ word: string; example: string }>;
  };
  grammar: {
    errors: Array<{ text: string; correction: string; explanation: string }>;
    feedback: string;
  };
  overall: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transcription, targetWords = [], level = 'A2', userId } = await req.json() as AnalyzeVoiceRequest;

    if (!transcription || typeof transcription !== 'string') {
      return NextResponse.json({ error: 'transcription is required' }, { status: 400 });
    }

    // Получаем язык инструкций пользователя
    let instructionLanguage = 'ru'; // По умолчанию русский
    const effectiveUserId = userId || session.user.id;
    try {
      const apolloClient = createAdminClient();
      const hasyx = new Hasyx(apolloClient, generate);
      instructionLanguage = await getUserInstructionLanguage(hasyx, effectiveUserId);
    } catch (error) {
      console.warn('Failed to get user instruction language, using default:', error);
    }

    const languageInstruction = instructionLanguage === 'ru'
      ? 'ВАЖНО: Все ответы должны быть на русском языке. Фидбек, предложения и объяснения должны быть написаны на русском языке.'
      : `ВАЖНО: Все ответы должны быть на языке: ${instructionLanguage}.`;

    // Формируем промпт для AI
    const targetWordsSection = targetWords.length > 0
      ? `\n\nЦелевые слова, которые должны быть использованы в тексте: ${targetWords.join(', ')}.
Проверь использование каждого целевого слова:
- Если слово использовано правильно, добавь его в targetWordsUsed
- Если слово пропущено, добавь его в missingWords и предложи конкретный пример использования в suggestions
- Для каждого пропущенного слова дай пример предложения, где это слово используется естественно`
      : '';

    const prompt = `
Ты — эксперт по анализу произношения и речи на английском языке.
Твоя задача — проанализировать транскрипцию голосового сообщения и дать детальный фидбек.

Транскрипция: "${transcription}"
Уровень ученика: ${level}${targetWordsSection}

${languageInstruction}

Проанализируй следующее:

1. ПРОИЗНОШЕНИЕ:
   - Оцени произношение по шкале от 0 до 10
   - Укажи конкретные проблемы с произношением (звуки, ударение, интонация)
   - Учти, что транскрипция может содержать ошибки распознавания речи

2. СЛОВАРЬ (если указаны целевые слова):
   - Определи, какие целевые слова были использованы правильно (targetWordsUsed)
   - Определи, какие целевые слова пропущены (missingWords)
   - Для каждого пропущенного слова предложи конкретный пример использования в формате: {word: "слово", example: "пример предложения"}
   - Дай общий фидбек по использованию словаря

3. ГРАММАТИКА:
   - Найди все грамматические ошибки
   - Для каждой ошибки укажи: оригинальный текст, исправление и объяснение
   - Дай общий фидбек по грамматике

4. ОБЩАЯ ОЦЕНКА:
   - Оцени общее качество речи по шкале от 0 до 10
   - Дай общий фидбек
   - Предложи 2-3 конкретных рекомендации для улучшения

Верни ответ в формате JSON:
{
  "pronunciation": {
    "score": число от 0 до 10,
    "feedback": "текст фидбека",
    "issues": ["проблема 1", "проблема 2"]
  },
  "vocabulary": {
    "targetWordsUsed": ["слово1", "слово2"],
    "missingWords": ["слово3", "слово4"],
    "feedback": "текст фидбека",
    "suggestions": [
      {"word": "слово3", "example": "пример предложения"},
      {"word": "слово4", "example": "пример предложения"}
    ]
  },
  "grammar": {
    "errors": [
      {
        "text": "неправильный текст",
        "correction": "правильный текст",
        "explanation": "объяснение ошибки"
      }
    ],
    "feedback": "текст фидбека"
  },
  "overall": {
    "score": число от 0 до 10,
    "feedback": "текст фидбека",
    "suggestions": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
  }
}
`;

    const feedback = await generateJSON<VoiceFeedback>(prompt, {
      maxTokens: 2000,
      systemPrompt: 'Ты — эксперт по анализу произношения и речи на английском языке. Ты даешь конструктивный и полезный фидбек для улучшения навыков речи.',
    });

    // Валидация и нормализация ответа
    const normalizedFeedback: VoiceFeedback = {
      pronunciation: {
        score: Math.max(0, Math.min(10, feedback.pronunciation?.score ?? 5)),
        feedback: feedback.pronunciation?.feedback || 'Произношение требует улучшения.',
        issues: Array.isArray(feedback.pronunciation?.issues) ? feedback.pronunciation.issues : [],
      },
      vocabulary: {
        targetWordsUsed: Array.isArray(feedback.vocabulary?.targetWordsUsed) ? feedback.vocabulary.targetWordsUsed : [],
        missingWords: Array.isArray(feedback.vocabulary?.missingWords) ? feedback.vocabulary.missingWords : [],
        feedback: feedback.vocabulary?.feedback || 'Использование словаря соответствует уровню.',
        suggestions: Array.isArray(feedback.vocabulary?.suggestions) ? feedback.vocabulary.suggestions : [],
      },
      grammar: {
        errors: Array.isArray(feedback.grammar?.errors) ? feedback.grammar.errors : [],
        feedback: feedback.grammar?.feedback || 'Грамматика в целом корректна.',
      },
      overall: {
        score: Math.max(0, Math.min(10, feedback.overall?.score ?? 5)),
        feedback: feedback.overall?.feedback || 'Хорошая работа! Продолжай практиковаться.',
        suggestions: Array.isArray(feedback.overall?.suggestions) ? feedback.overall.suggestions : [],
      },
    };

    return NextResponse.json(normalizedFeedback);
  } catch (error: any) {
    console.error('[API /ai/analyze-voice] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze voice message' },
      { status: 500 }
    );
  }
}

