import { Hasyx } from 'hasyx';
import getAI, { parseJSONResponse } from '@/lib/ai/llm';
import { ShuHaRiTestQuestion, ShuHaRiTestResult } from '@/types/shu-ha-ri';

export class ShuHaRiService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Генерация еженедельного Shu-Ha-Ri теста
   */
  async generateWeeklyTest(
    userId: string,
    weekStartDate: Date,
    testType: 'shu' | 'ha' | 'ri' | 'comprehensive' = 'comprehensive'
  ): Promise<string> {
    // Получить прогресс пользователя по навыкам
    const progress = await this.hasyx.select({
      table: 'shu_ha_ri_progress',
      where: {
        user_id: { _eq: userId },
      },
      returning: ['id', 'skill_id', 'skill_type', 'stage', 'shu_mastery_count', 'ha_understanding_score', 'ri_fluency_score'],
    });

    const skills = Array.isArray(progress) ? progress : progress ? [progress] : [];

    // Получить последние слепки за неделю
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    const snapshots = await this.hasyx.select({
      table: 'lesson_snapshots',
      where: {
        user_id: { _eq: userId },
        lesson_date: {
          _gte: weekStartDate.toISOString(),
          _lte: weekEndDate.toISOString(),
        },
      },
      returning: ['lesson_type', 'performance_score', 'problem_areas', 'mastery_level'],
    });

    const weekSnapshots = Array.isArray(snapshots) ? snapshots : snapshots ? [snapshots] : [];

    // Генерация вопросов через AI
    const questions = await this.generateTestQuestions(
      userId,
      testType,
      skills,
      weekSnapshots
    );

    // Создать тест
    const test = await this.hasyx.insert({
      table: 'shu_ha_ri_tests',
      object: {
        user_id: userId,
        week_start_date: weekStartDate.toISOString().split('T')[0],
        test_type: testType,
        questions: questions,
        started_at: new Date().toISOString(),
      },
      returning: ['id'],
    });

    const testId = Array.isArray(test) ? test[0]?.id : test?.id;
    if (!testId) {
      throw new Error('Failed to create Shu-Ha-Ri test');
    }

    return testId;
  }

  /**
   * Генерация вопросов для теста
   */
  private async generateTestQuestions(
    userId: string,
    testType: string,
    skills: any[],
    weekSnapshots: any[]
  ): Promise<ShuHaRiTestQuestion[]> {
    const prompt = `Создай еженедельный тест типа "${testType}" для проверки прогресса ученика.

Навыки ученика:
${JSON.stringify(skills, null, 2)}

Слепки за неделю:
${JSON.stringify(weekSnapshots.slice(0, 10), null, 2)}

Создай 10 вопросов, которые проверяют:
- Для "shu": строгое следование правилам
- Для "ha": понимание и применение в новых контекстах
- Для "ri": свободное владение без опоры на правила
- Для "comprehensive": все стадии

Верни JSON:
{
  "questions": [
    {
      "question": "текст вопроса",
      "type": "grammar" | "vocabulary" | "comprehension" | "application",
      "correct_answer": "правильный ответ",
      "skill_id": "uuid навыка (если есть)",
      "skill_type": "тип навыка"
    }
  ]
}`;

    try {
      const ai = getAI();
      const response = await ai.query({ role: 'user', content: prompt }) as any;
      const content = typeof response === 'string' ? response : response?.content;
      if (!content) {
        throw new Error('AI returned empty response');
      }
      const parsed = parseJSONResponse<{ questions: ShuHaRiTestQuestion[] }>(content);
      return parsed.questions;
    } catch (error) {
      console.error('Error generating test questions:', error);
      // Fallback: простые вопросы
      return this.generateFallbackQuestions(testType, skills);
    }
  }

  /**
   * Резервные вопросы (если AI не работает)
   */
  private generateFallbackQuestions(
    testType: string,
    skills: any[]
  ): ShuHaRiTestQuestion[] {
    const questions: ShuHaRiTestQuestion[] = [];

    for (const skill of skills.slice(0, 5)) {
      questions.push({
        question: `Примени правило "${skill.skill_type}" в предложении`,
        type: 'grammar',
        correct_answer: 'Пример правильного ответа',
        skill_id: skill.skill_id,
        skill_type: skill.skill_type,
      });
    }

    return questions;
  }

  /**
   * Проверка теста и обновление прогресса
   */
  async checkTest(
    testId: string,
    userAnswers: Array<{ question_id: string; answer: string }>
  ): Promise<ShuHaRiTestResult> {
    // Получить тест
    const test = await this.hasyx.select({
      table: 'shu_ha_ri_tests',
      pk_columns: { id: testId },
      returning: ['questions', 'test_type', 'user_id'],
    });

    if (!test) {
      throw new Error('Test not found');
    }

    const questions = (test.questions as ShuHaRiTestQuestion[]) || [];
    const testType = test.test_type as string;

    // Проверить ответы
    let correctCount = 0;
    const skillsProgress: Array<{ skill_id: string; stage: 'shu' | 'ha' | 'ri'; passed: boolean }> = [];
    const skillResults = new Map<string, { correct: number; total: number }>();

    for (const userAnswer of userAnswers) {
      const question = questions.find((q, idx) => idx.toString() === userAnswer.question_id);
      if (!question) continue;

      const isCorrect = this.checkAnswer(userAnswer.answer, question.correct_answer);
      if (isCorrect) {
        correctCount++;
      }

      if (question.skill_id) {
        const skillKey = question.skill_id;
        const current = skillResults.get(skillKey) || { correct: 0, total: 0 };
        skillResults.set(skillKey, {
          correct: current.correct + (isCorrect ? 1 : 0),
          total: current.total + 1,
        });
      }
    }

    const score = (correctCount / questions.length) * 100;
    const passingScore = 80; // Можно получить из OPTIONS
    const passed = score >= passingScore;

    // Определить прогресс по навыкам
    for (const [skillId, results] of skillResults.entries()) {
      const skillPassed = (results.correct / results.total) >= 0.7;
      skillsProgress.push({
        skill_id: skillId,
        stage: this.determineStage(testType, skillPassed),
        passed: skillPassed,
      });
    }

    // Генерация фидбека через AI
    const feedback = await this.generateFeedback(
      test.user_id as string,
      questions,
      userAnswers,
      score,
      passed
    );

    // Обновить тест
    await this.hasyx.update({
      table: 'shu_ha_ri_tests',
      pk_columns: { id: testId },
      _set: {
        user_answers: userAnswers,
        score: score,
        passed: passed,
        feedback: feedback,
        skills_progress: skillsProgress,
        completed_at: new Date().toISOString(),
      },
    });

    // Обновить прогресс Shu-Ha-Ri для навыков
    await this.updateShuHaRiProgress(test.user_id as string, skillsProgress);

    return {
      score,
      passed,
      strengths: feedback.strengths || [],
      improvements: feedback.improvements || [],
      detailed_feedback: feedback.detailed_feedback || '',
      skills_progress: skillsProgress,
    };
  }

  /**
   * Проверка ответа (простая проверка, можно улучшить)
   */
  private checkAnswer(userAnswer: string, correctAnswer: string): boolean {
    // Простая проверка (можно улучшить через AI)
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  }

  /**
   * Определение стадии на основе типа теста
   */
  private determineStage(testType: string, passed: boolean): 'shu' | 'ha' | 'ri' {
    if (testType === 'shu') return 'shu';
    if (testType === 'ha') return 'ha';
    if (testType === 'ri') return 'ri';
    // Для comprehensive определяем по результату
    return passed ? 'ri' : 'shu';
  }

  /**
   * Генерация фидбека через AI
   */
  private async generateFeedback(
    userId: string,
    questions: ShuHaRiTestQuestion[],
    userAnswers: Array<{ question_id: string; answer: string }>,
    score: number,
    passed: boolean
  ): Promise<{
    strengths: string[];
    improvements: string[];
    detailed_feedback: string;
  }> {
    const prompt = `Проанализируй результаты еженедельного теста.

Вопросы:
${JSON.stringify(questions, null, 2)}

Ответы ученика:
${JSON.stringify(userAnswers, null, 2)}

Балл: ${score.toFixed(1)}%
Результат: ${passed ? 'Пройден' : 'Не пройден'}

Верни JSON:
{
  "strengths": ["2-3 сильные стороны"],
  "improvements": ["2-3 области для улучшения"],
  "detailed_feedback": "детальная обратная связь (3-4 предложения)"
}`;

    try {
      const ai = getAI();
      const response = await ai.query({ role: 'user', content: prompt }) as any;
      const content = typeof response === 'string' ? response : response?.content;
      if (!content) {
        throw new Error('AI returned empty response');
      }
      return parseJSONResponse<{
        strengths: string[];
        improvements: string[];
        detailed_feedback: string;
      }>(content);
    } catch (error) {
      console.error('Error generating feedback:', error);
      return {
        strengths: ['Продолжай работать!'],
        improvements: ['Обрати внимание на ошибки'],
        detailed_feedback: `Твой результат: ${score.toFixed(1)}%. ${passed ? 'Отлично!' : 'Продолжай практиковаться!'}`,
      };
    }
  }

  /**
   * Обновление прогресса Shu-Ha-Ri для навыков
   */
  private async updateShuHaRiProgress(
    userId: string,
    skillsProgress: Array<{ skill_id: string; stage: 'shu' | 'ha' | 'ri'; passed: boolean }>
  ): Promise<void> {
    for (const skillProgress of skillsProgress) {
      const existing = await this.hasyx.select({
        table: 'shu_ha_ri_progress',
        where: {
          user_id: { _eq: userId },
          skill_id: { _eq: skillProgress.skill_id },
        },
        returning: ['id', 'stage', 'shu_mastery_count', 'ha_understanding_score', 'ri_fluency_score'],
        limit: 1,
      });

      const progress = Array.isArray(existing) ? existing[0] : existing;

      if (progress) {
        // Обновить прогресс в зависимости от стадии
        const updates: any = {};

        if (skillProgress.stage === 'shu' && skillProgress.passed) {
          updates.shu_mastery_count = (progress.shu_mastery_count || 0) + 1;
          updates.shu_accuracy = 1.0; // Можно рассчитать точнее
          if (updates.shu_mastery_count >= 5) {
            updates.shu_test_passed = true;
            updates.shu_completed_at = new Date().toISOString();
            updates.stage = 'ha';
            updates.ha_started_at = new Date().toISOString();
          }
        } else if (skillProgress.stage === 'ha' && skillProgress.passed) {
          updates.ha_understanding_score = Math.min(1.0, (progress.ha_understanding_score || 0) + 0.1);
          updates.ha_creative_applications = (progress.ha_creative_applications || 0) + 1;
          if (updates.ha_understanding_score >= 0.8 && updates.ha_creative_applications >= 3) {
            updates.ha_test_passed = true;
            updates.stage = 'ri';
            updates.ri_achieved_at = new Date().toISOString();
          }
        } else if (skillProgress.stage === 'ri' && skillProgress.passed) {
          updates.ri_fluency_score = Math.min(1.0, (progress.ri_fluency_score || 0) + 0.1);
          updates.ri_natural_usage_count = (progress.ri_natural_usage_count || 0) + 1;
        }

        await this.hasyx.update({
          table: 'shu_ha_ri_progress',
          pk_columns: { id: progress.id },
          _set: updates,
        });
      }
    }
  }

  /**
   * Проверка необходимости создания еженедельного теста
   */
  async shouldCreateWeeklyTest(userId: string, weekStartDate: Date): Promise<boolean> {
    // Проверить, есть ли уже тест на эту неделю
    const existing = await this.hasyx.select({
      table: 'shu_ha_ri_tests',
      where: {
        user_id: { _eq: userId },
        week_start_date: { _eq: weekStartDate.toISOString().split('T')[0] },
      },
      returning: ['id'],
      limit: 1,
    });

    return !existing || (Array.isArray(existing) && existing.length === 0);
  }
}

