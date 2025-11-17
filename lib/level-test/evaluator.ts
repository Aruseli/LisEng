import type { TestQuestion, UserAnswer, TestResult, WritingQuestion } from '@/types/level-test';
import getAI, { parseJSONResponse } from '@/lib/ai/llm';
import { WritingFeedback } from '@/types/writing-feedback';

/**
 * Оценщик результатов теста для определения уровня
 */
export class LevelTestEvaluator {
  /**
   * Оценивает результаты теста и определяет уровень
   */
  static async evaluateTest(
    questions: TestQuestion[],
    answers: UserAnswer[]
  ): Promise<TestResult> {
    const breakdown = {
      grammar: { points: 0, maxPoints: 0 },
      vocabulary: { points: 0, maxPoints: 0 },
      reading: { points: 0, maxPoints: 0 },
      listening: { points: 0, maxPoints: 0 },
      writing: { points: 0, maxPoints: 0 },
      speaking: { points: 0, maxPoints: 0 },
    };

    let totalPoints = 0;
    let maxPoints = 0;
    const pronunciationSummary: NonNullable<TestResult['pronunciation']> = {};

    // Оцениваем объективные вопросы (grammar, vocabulary, reading, listening)
    for (const question of questions) {
      const answer = answers.find((a) => a.questionId === question.id);
      maxPoints += question.points;

      switch (question.type) {
        case 'grammar':
        case 'vocabulary': {
          breakdown[question.type].maxPoints += question.points;
          if (answer && typeof answer.answer === 'number') {
            const isCorrect = answer.answer === question.correctAnswer;
            if (isCorrect) {
              breakdown[question.type].points += question.points;
              totalPoints += question.points;
            }
          }
          break;
        }

        case 'reading':
        case 'listening': {
          breakdown[question.type].maxPoints += question.points;
          if (answer && Array.isArray(answer.answer)) {
            let correctCount = 0;
            question.questions.forEach((q, index) => {
              if (answer.answer[index] === q.correctAnswer) {
                correctCount++;
              }
            });
            const points = (correctCount / question.questions.length) * question.points;
            breakdown[question.type].points += points;
            totalPoints += points;
          }
          if (typeof answer?.metrics?.pronunciationAccuracy === 'number') {
            pronunciationSummary.listening = Math.round(
              Math.max(0, Math.min(100, answer.metrics.pronunciationAccuracy))
            );
          }
          break;
        }

        case 'writing': {
          breakdown.writing.maxPoints += question.points;
          if (answer && typeof answer.answer === 'string') {
            const writingScore = await this.evaluateWriting(
              answer.answer,
              question,
              question.points
            );
            breakdown.writing.points += writingScore;
            totalPoints += writingScore;
          }
          break;
        }

        case 'speaking': {
          breakdown.speaking.maxPoints += question.points;
          if (answer && typeof answer.answer === 'string') {
            const speakingScore = await this.evaluateSpeaking(
              answer.answer,
              question,
              question.points
            );
            breakdown.speaking.points += speakingScore;
            totalPoints += speakingScore;
          }
          break;
        }
      }
    }

    const percentage = (totalPoints / maxPoints) * 100;
    const level = this.determineLevel(percentage, breakdown);
    const feedback = await this.generateFeedback(percentage, level, breakdown);

    const pronunciation =
      Object.keys(pronunciationSummary).length > 0 ? pronunciationSummary : undefined;

    return {
      totalPoints,
      maxPoints,
      percentage,
      level,
      breakdown,
      feedback,
      pronunciation,
    };
  }

  /**
   * Определяет уровень на основе результатов
   */
  private static determineLevel(
    percentage: number,
    breakdown: TestResult['breakdown']
  ): string {
    // Учитываем общий процент и баланс по навыкам
    const avgSkillPercentage =
      (breakdown.grammar.points / Math.max(breakdown.grammar.maxPoints, 1)) * 100 +
      (breakdown.vocabulary.points / Math.max(breakdown.vocabulary.maxPoints, 1)) * 100 +
      (breakdown.reading.points / Math.max(breakdown.reading.maxPoints, 1)) * 100 +
      (breakdown.listening.points / Math.max(breakdown.listening.maxPoints, 1)) * 100;
    const avgSkill = avgSkillPercentage / 4;

    // Определяем уровень на основе процента
    if (percentage >= 90) return 'C2';
    if (percentage >= 80) return 'C1';
    if (percentage >= 70) return 'B2';
    if (percentage >= 60) return 'B1';
    if (percentage >= 50) return 'A2';
    if (percentage >= 40) return 'A1';
    return 'A1';
  }

  /**
   * Оценивает письменное задание через AI
   */
  private static async evaluateWriting(
    text: string,
    question: WritingQuestion,
    maxPoints: number
  ): Promise<number> {
    try {
      console.log(`Checking writing for level A2...`); // Уровень пока захардкожен, т.к. question не содержит level
      
      const ai = getAI();
      const prompt = `
        You are an experienced English teacher. Check the student's writing.
        Level: A2
        Topic: ${question.prompt}
        Text:
        ---
        ${text}
        ---
        Please provide feedback in JSON format with the following structure:
        {
          "score": number (0-100),
          "feedback": "string",
          "corrections": [
            {
              "original": "string",
              "corrected": "string",
              "explanation": "string"
            }
          ]
        }
      `;
      const response = await ai.query({ role: 'user', content: prompt });

      if (!response) {
        console.error('[LevelTestEvaluator] Empty AI response for writing check prompt:', prompt.substring(0, 300));
        throw new Error('AI returned an empty response');
      }

      const feedback = parseJSONResponse<WritingFeedback>(response);

      if (!feedback) {
        throw new Error('Failed to get feedback from AI');
      }

      const normalizedScore = Math.max(
        0,
        Math.min(100, typeof feedback.score === 'number' ? feedback.score : 0)
      );
      return (normalizedScore / 100) * maxPoints;
    } catch (error) {
      console.error('Failed to evaluate writing:', error);
      // Fallback: простая оценка по длине и базовым критериям
      return Math.min(maxPoints, (text.split(' ').length / (question.wordLimit || 100)) * maxPoints * 0.7);
    }
  }

  /**
   * Оценивает говорение через AI (можно интегрировать с Whisper)
   */
  private static async evaluateSpeaking(
    transcript: string, // транскрипт из Whisper или текст ответа
    question: any,
    maxPoints: number
  ): Promise<number> {
    try {
      // Здесь можно добавить анализ через Whisper + Claude
      // Пока используем простую оценку по длине и содержанию
      const wordCount = transcript.split(' ').length;
      const expectedLength = question.expectedLength || 50;
      
      // Базовая оценка: учитываем длину ответа и релевантность
      let score = Math.min(1, wordCount / expectedLength) * 0.6;
      
      // Можно добавить анализ через Claude для оценки качества
      // const analysis = await ClaudeService.analyzeSpeaking(transcript, question.prompt);
      // score += analysis.quality * 0.4;
      
      return score * maxPoints;
    } catch (error) {
      console.error('Failed to evaluate speaking:', error);
      return maxPoints * 0.5; // средняя оценка при ошибке
    }
  }

  /**
   * Генерирует фидбек на основе результатов
   */
  private static async generateFeedback(
    percentage: number,
    level: string,
    breakdown: TestResult['breakdown']
  ): Promise<string> {
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Анализируем сильные и слабые стороны
    const skills = [
      { name: 'Грамматика', value: breakdown.grammar },
      { name: 'Словарь', value: breakdown.vocabulary },
      { name: 'Чтение', value: breakdown.reading },
      { name: 'Аудирование', value: breakdown.listening },
    ];

    skills.forEach((skill) => {
      const skillPercentage =
        (skill.value.points / Math.max(skill.value.maxPoints, 1)) * 100;
      if (skillPercentage >= 70) {
        strengths.push(skill.name.toLowerCase());
      } else if (skillPercentage < 50) {
        improvements.push(skill.name.toLowerCase());
      }
    });

    return `Ваш уровень английского: ${level}. 
${strengths.length > 0 ? `Сильные стороны: ${strengths.join(', ')}. ` : ''}
${improvements.length > 0 ? `Рекомендуем обратить внимание на: ${improvements.join(', ')}.` : ''}`;
  }
}



