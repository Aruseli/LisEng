import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/ai/claude-service';

/**
 * Генерирует тест для перехода между этапами
 */
export async function POST(req: NextRequest) {
  try {
    const { stageId, stageName, level, testType } = await req.json();

    // Генерируем тест через AI в зависимости от типа
    let testContent;

    switch (testType) {
      case 'grammar':
        testContent = await generateGrammarTest(level, stageName);
        break;
      case 'writing':
        testContent = await generateWritingTest(level, stageName);
        break;
      case 'speaking':
        testContent = await generateSpeakingTest(level, stageName);
        break;
      case 'comprehensive':
        testContent = await generateComprehensiveTest(level, stageName);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ test: testContent });
  } catch (error) {
    console.error('Test Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    );
  }
}

async function generateGrammarTest(level: string, stageName: string) {
  const { ClaudeService } = await import('@/lib/ai/claude-service');
  
  const prompt = `Создай финальный грамматический тест для этапа "${stageName}" уровня ${level}.

Требования:
- 10 вопросов разной сложности
- Покрыть все грамматические темы этапа
- Формат: множественный выбор или исправление ошибок
- Уровень сложности: ${level}

Формат JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "текст вопроса",
      "options": ["вариант1", "вариант2", "вариант3", "вариант4"],
      "correct_answer": 0,
      "explanation": "объяснение правильного ответа"
    }
  ]
}`;

  return await ClaudeService.generateJSON<{ questions: Array<{
    id: string;
    type: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }> }>(prompt, { maxTokens: 2000 });
}

async function generateWritingTest(level: string, stageName: string) {
  // Используем ClaudeService для генерации письменного задания
  // Это будет задание на написание текста, которое потом проверит AI
  return {
    type: 'writing',
    prompt: `Напиши текст на тему, которая соответствует этапу "${stageName}" уровня ${level}`,
    word_count_min: level === 'A2' ? 50 : level === 'B1' ? 100 : 150,
    word_count_max: level === 'A2' ? 100 : level === 'B1' ? 200 : 250,
  };
}

async function generateSpeakingTest(level: string, stageName: string) {
  return {
    type: 'speaking',
    topics: [
      `Обсуди тему, изученную на этапе "${stageName}"`,
      'Расскажи о своих планах',
      'Опиши свой опыт изучения английского',
    ],
    duration_minutes: 5,
  };
}

async function generateComprehensiveTest(level: string, stageName: string) {
  // Комплексный тест включает все типы заданий
  const grammarTest = await generateGrammarTest(level, stageName);
  const writingTest = await generateWritingTest(level, stageName);
  const speakingTest = await generateSpeakingTest(level, stageName);

  return {
    grammar: grammarTest,
    writing: writingTest,
    speaking: speakingTest,
  };
}

