import { Hasyx } from 'hasyx';

import { LessonContentService, LessonMaterials } from '@/lib/lesson/lesson-content-service';
import { VocabularyGenerationService } from '@/lib/vocabulary/vocabulary-generation-service';
import {
  completeTask,
  getUserProfile,
  updateProgressMetrics,
  updateStreak,
  updateStageProgressFromTask,
  getAISession,
  updateAISession,
  createAISession,
} from '@/lib/hasura-queries';
import { calculateSM2, getQualityScore, initializeSM2 } from '@/lib/lesson-snapshots/sm2-algorithm';

interface PronunciationResultPayload {
  accuracy: number | null;
  lowAccuracyWords: string[];
  flaggedWords: string[];
  script?: string | null;
}

interface FlashcardResult {
  cardId: string;
  wasCorrect: boolean;
  responseTime?: number;
  userSentence?: string;
}

interface ConversationData {
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  targetWordsUsed?: string[];
  sessionDuration?: number;
}

interface VoiceMessagesData {
  messages: Array<{
    transcription: string;
    audioUrl?: string;
    feedback?: any; // Фидбек от /api/ai/analyze-voice
  }>;
  targetWordsUsed?: string[];
  targetWordsMissing?: string[];
  overallFeedback?: any;
}

interface CompleteLessonOptions {
  userId: string;
  taskId: string;
  pronunciation?: PronunciationResultPayload | null;
  flashcardResults?: FlashcardResult[];
  conversationData?: ConversationData;
  voiceMessagesData?: VoiceMessagesData;
}

export class LessonCompletionService {
  private readonly lessonContentService: LessonContentService;
  private readonly vocabularyService: VocabularyGenerationService;

  constructor(private readonly hasyx: Hasyx) {
    this.lessonContentService = new LessonContentService(hasyx);
    this.vocabularyService = new VocabularyGenerationService(hasyx);
  }

  async completeLesson(options: CompleteLessonOptions) {
    const task = await this.getTask(options.taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.user_id !== options.userId) {
      throw new Error('Task does not belong to user');
    }

    const lesson = await this.lessonContentService.getOrGenerateLesson({
      userId: options.userId,
      task,
    });

    const snapshotId = await this.createSnapshot({
      task,
      lesson,
      pronunciation: options.pronunciation ?? null,
      conversationData: options.conversationData,
      voiceMessagesData: options.voiceMessagesData,
    });

    const flaggedWords = this.normalizeWords(options.pronunciation);
    if (flaggedWords.length > 0) {
      const user = await getUserProfile(this.hasyx, options.userId);
      await this.vocabularyService.generateCardsFromWords({
        userId: options.userId,
        level: user?.current_level || 'A2',
        words: flaggedWords,
        sourceSnapshotId: snapshotId,
        context: options.pronunciation?.script ?? null,
      });
    }

    // Обработка результатов флэш-карточек и обновление Active Recall
    if (options.flashcardResults && options.flashcardResults.length > 0) {
      await this.updateActiveRecall({
        userId: options.userId,
        snapshotId,
        flashcardResults: options.flashcardResults,
      });
    }

    // Обработка conversationData - обновление ai_sessions
    if (options.conversationData) {
      await this.updateAISessionFromConversation({
        userId: options.userId,
        taskId: options.taskId,
        conversationData: options.conversationData,
      });
    }

    // Обработка voiceMessagesData - создание vocabulary_cards из проблемных слов
    if (options.voiceMessagesData) {
      await this.processVoiceMessagesData({
        userId: options.userId,
        snapshotId,
        voiceMessagesData: options.voiceMessagesData,
      });
    }

    await completeTask(this.hasyx, options.taskId);

    // Обновляем метрики прогресса, стрик и прогресс этапа
    const today = new Date().toISOString().split('T')[0];
    
    // Обновляем метрики прогресса
    await updateProgressMetrics(this.hasyx, options.userId, today, {
      tasksCompleted: 1,
      studyMinutes: task.duration_minutes || 0,
    });

    // Обновляем стрик (только если все задания дня выполнены)
    await updateStreak(this.hasyx, options.userId, today);

    // Обновляем прогресс этапа
    if (task.stage_id) {
      await updateStageProgressFromTask(this.hasyx, options.userId, options.taskId);
    }

    return {
      snapshotId,
      flaggedWords,
    };
  }

  private async getTask(taskId: string) {
    const task = await this.hasyx.select({
      table: 'daily_tasks',
      pk_columns: { id: taskId },
      returning: [
        'id',
        'user_id',
        'type',
        'title',
        'description',
        'type_specific_payload',
        'duration_minutes',
      ],
    });

    if (!task) {
      return null;
    }

    if (Array.isArray(task)) {
      return task[0] ?? null;
    }

    return task;
  }

  private normalizeWords(pronunciation?: PronunciationResultPayload | null): string[] {
    if (!pronunciation) {
      return [];
    }
    const words = [...(pronunciation.flaggedWords ?? []), ...(pronunciation.lowAccuracyWords ?? [])]
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(words)).slice(0, 12);
  }

  private async createSnapshot(params: {
    task: any;
    lesson: LessonMaterials;
    pronunciation: PronunciationResultPayload | null;
    conversationData?: ConversationData;
    voiceMessagesData?: VoiceMessagesData;
  }): Promise<string | null> {
    const { task, lesson, pronunciation, conversationData, voiceMessagesData } = params;

    // Формируем content_snapshot с учетом типа урока
    const contentSnapshot: any = {
      lesson,
    };

    if (pronunciation) {
      contentSnapshot.pronunciation = pronunciation;
    }

    if (conversationData) {
      contentSnapshot.conversation = conversationData;
      if (conversationData.targetWordsUsed) {
        contentSnapshot.targetWordsUsed = conversationData.targetWordsUsed;
      }
    }

    if (voiceMessagesData) {
      contentSnapshot.voiceMessages = voiceMessagesData;
      if (voiceMessagesData.targetWordsUsed) {
        contentSnapshot.targetWordsUsed = voiceMessagesData.targetWordsUsed;
      }
    }

    // Определяем methodology_tags
    const methodologyTags: string[] = [];
    if (pronunciation) {
      methodologyTags.push('pronunciation_practice');
    }
    if (conversationData) {
      methodologyTags.push('speaking_practice');
    }
    if (voiceMessagesData) {
      methodologyTags.push('voice_messages');
    }

    // Определяем performance_score
    let performanceScore: number | null = null;
    if (pronunciation?.accuracy !== undefined) {
      performanceScore = pronunciation.accuracy;
    } else if (voiceMessagesData?.overallFeedback?.score !== undefined) {
      performanceScore = voiceMessagesData.overallFeedback.score;
    }

    const result = await this.hasyx.insert({
      table: 'lesson_snapshots',
      object: {
        user_id: task.user_id,
        task_id: task.id,
        lesson_type: task.type,
        duration_seconds: (task.duration_minutes ?? 0) * 60,
        content_snapshot: contentSnapshot,
        problem_areas: this.buildProblemAreas(pronunciation, voiceMessagesData),
        performance_score: performanceScore,
        methodology_tags: methodologyTags.length > 0 ? methodologyTags : [],
      },
      returning: ['id'],
    });

    if (Array.isArray(result)) {
      return result[0]?.id ?? null;
    }
    return result?.id ?? null;
  }

  private buildProblemAreas(
    pronunciation: PronunciationResultPayload | null,
    voiceMessagesData?: VoiceMessagesData
  ) {
    const problemAreas: Array<{
      type: string;
      content: string;
      context: string;
      severity: string;
      timestamp: string;
    }> = [];

    const timestamp = new Date().toISOString();

    // Проблемы из pronunciation
    if (pronunciation) {
      const words = this.normalizeWords(pronunciation);
      words.forEach((word) => {
        problemAreas.push({
          type: 'unknown_word',
          content: word,
          context: 'Pronunciation practice',
          severity: 'medium',
          timestamp,
        });
      });
    }

    // Проблемы из voiceMessagesData
    if (voiceMessagesData) {
      // Пропущенные слова
      if (voiceMessagesData.targetWordsMissing) {
        voiceMessagesData.targetWordsMissing.forEach((word) => {
          problemAreas.push({
            type: 'missing_target_word',
            content: word,
            context: 'Voice messages practice',
            severity: 'low',
            timestamp,
          });
        });
      }

      // Грамматические ошибки из фидбека
      voiceMessagesData.messages.forEach((msg) => {
        if (msg.feedback?.grammar?.errors) {
          msg.feedback.grammar.errors.forEach((error: any) => {
            problemAreas.push({
              type: 'grammar_error',
              content: error.text || error.correction || '',
              context: `Voice message: ${msg.transcription.substring(0, 50)}...`,
              severity: 'medium',
              timestamp,
            });
          });
        }
      });
    }

    return problemAreas;
  }

  private async updateActiveRecall(params: {
    userId: string;
    snapshotId: string | null;
    flashcardResults: FlashcardResult[];
  }) {
    const { userId, snapshotId, flashcardResults } = params;

    for (const result of flashcardResults) {
      // Получаем текущую карточку
      const card = await this.hasyx.select({
        table: 'vocabulary_cards',
        pk_columns: { id: result.cardId },
        returning: ['id', 'word', 'translation'],
      });

      if (!card || (Array.isArray(card) && card.length === 0)) {
        continue;
      }

      const cardData = Array.isArray(card) ? card[0] : card;

      // Ищем существующую запись Active Recall для этой карточки
      const existingRecall = await this.hasyx.select({
        table: 'active_recall_sessions',
        where: {
          user_id: { _eq: userId },
          recall_item_id: { _eq: result.cardId },
          recall_item_type: { _eq: 'vocabulary_card' },
        },
        order_by: [{ created_at: 'desc' }],
        limit: 1,
        returning: [
          'id',
          'quality',
          'ease_factor',
          'interval_days',
          'repetitions',
          'next_review_date',
        ],
      });

      const existingRecallData = Array.isArray(existingRecall) ? existingRecall[0] : existingRecall;

      // Рассчитываем качество ответа
      const quality = getQualityScore(result.wasCorrect, result.responseTime);

      // Получаем текущие параметры SM-2
      const currentParams = existingRecallData
        ? {
            quality,
            easeFactor: existingRecallData.ease_factor ?? 2.5,
            interval: existingRecallData.interval_days ?? 1,
            repetitions: existingRecallData.repetitions ?? 0,
          }
        : {
            ...initializeSM2(),
            quality,
          };

      // Рассчитываем новые параметры SM-2
      const sm2Result = calculateSM2(currentParams);

      // Создаем или обновляем запись Active Recall
      if (existingRecallData) {
        await this.hasyx.update({
          table: 'active_recall_sessions',
          pk_columns: { id: existingRecallData.id },
          _set: {
            quality,
            ease_factor: sm2Result.easeFactor,
            interval_days: sm2Result.interval,
            repetitions: sm2Result.repetitions,
            next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
            recall_success: result.wasCorrect,
            recall_time_seconds: result.responseTime,
            user_response: result.userSentence,
            correct_response: cardData.translation,
            context_prompt: `Вспомни перевод слова "${cardData.word}"`,
            updated_at: new Date().toISOString(),
          },
        });
      } else {
        await this.hasyx.insert({
          table: 'active_recall_sessions',
          object: {
            user_id: userId,
            lesson_snapshot_id: snapshotId,
            recall_type: 'vocabulary',
            recall_item_id: result.cardId,
            recall_item_type: 'vocabulary_card',
            quality,
            ease_factor: sm2Result.easeFactor,
            interval_days: sm2Result.interval,
            repetitions: sm2Result.repetitions,
            next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
            recall_attempts: 1,
            recall_success: result.wasCorrect,
            recall_time_seconds: result.responseTime,
            user_response: result.userSentence,
            correct_response: cardData.translation,
            context_prompt: `Вспомни перевод слова "${cardData.word}"`,
          },
        });
      }

      // Обновляем next_review_date в vocabulary_cards
      await this.hasyx.update({
        table: 'vocabulary_cards',
        pk_columns: { id: result.cardId },
        _set: {
          next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
          last_reviewed_at: new Date().toISOString(),
        },
      });
    }
  }

  private async updateAISessionFromConversation(params: {
    userId: string;
    taskId: string;
    conversationData: ConversationData;
  }) {
    const { userId, taskId, conversationData } = params;

    try {
      // Ищем активную сессию по taskId
      const task = await this.getTask(taskId);
      if (!task) {
        return;
      }

      // Ищем сессию по типу и теме
      const existingSession = await getAISession(
        this.hasyx,
        userId,
        task.type === 'speaking' ? 'speaking' : 'ai_practice',
        task.title
      );

      if (existingSession?.id) {
        // Обновляем существующую сессию
        await updateAISession(this.hasyx, existingSession.id, {
          conversation: conversationData.messages,
          duration_minutes: conversationData.sessionDuration,
          ended_at: new Date().toISOString(),
        });
      } else {
        // Создаем новую сессию
        await createAISession(
          this.hasyx,
          userId,
          task.type === 'speaking' ? 'speaking' : 'ai_practice',
          task.title
        );
        // После создания нужно обновить ее
        const newSession = await getAISession(
          this.hasyx,
          userId,
          task.type === 'speaking' ? 'speaking' : 'ai_practice',
          task.title
        );
        if (newSession?.id) {
          await updateAISession(this.hasyx, newSession.id, {
            conversation: conversationData.messages,
            duration_minutes: conversationData.sessionDuration,
            ended_at: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Failed to update AI session:', error);
      // Не прерываем выполнение, если не удалось обновить сессию
    }
  }

  private async processVoiceMessagesData(params: {
    userId: string;
    snapshotId: string | null;
    voiceMessagesData: VoiceMessagesData;
  }) {
    const { userId, snapshotId, voiceMessagesData } = params;

    try {
      // Извлекаем проблемные слова из фидбека
      const problemWords: string[] = [];

      voiceMessagesData.messages.forEach((msg) => {
        if (msg.feedback) {
          // Проблемы с произношением
          if (msg.feedback.pronunciation?.issues) {
            msg.feedback.pronunciation.issues.forEach((issue: string) => {
              // Извлекаем слова из описания проблем
              const words = issue.toLowerCase().match(/\b[a-z]+\b/g);
              if (words) {
                problemWords.push(...words);
              }
            });
          }

          // Пропущенные целевые слова
          if (msg.feedback.vocabulary?.missingWords) {
            problemWords.push(...msg.feedback.vocabulary.missingWords);
          }

          // Грамматические ошибки
          if (msg.feedback.grammar?.errors) {
            msg.feedback.grammar.errors.forEach((error: any) => {
              if (error.text) {
                const words = error.text.toLowerCase().match(/\b[a-z]+\b/g);
                if (words) {
                  problemWords.push(...words);
                }
              }
            });
          }
        }
      });

      // Уникальные слова
      const uniqueWords = Array.from(new Set(problemWords))
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 2)
        .slice(0, 12);

      if (uniqueWords.length > 0) {
        const user = await getUserProfile(this.hasyx, userId);
        await this.vocabularyService.generateCardsFromWords({
          userId,
          level: user?.current_level || 'A2',
          words: uniqueWords,
          sourceSnapshotId: snapshotId,
          context: 'Voice messages practice',
        });
      }
    } catch (error) {
      console.error('Failed to process voice messages data:', error);
      // Не прерываем выполнение, если не удалось создать карточки
    }
  }
}


