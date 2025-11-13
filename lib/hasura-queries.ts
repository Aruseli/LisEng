/**
 * Hasyx queries and mutations for LisEng application
 * Replaces GraphQL queries with Hasyx client methods
 */

import { Hasyx } from 'hasyx';

/**
 * Create AI session
 */
export async function createAISession(
  hasyx: Hasyx,
  userId: string,
  type: string,
  topic?: string
) {
  return await hasyx.insert({
    table: 'ai_sessions',
    object: {
      user_id: userId,
      type,
      topic,
      conversation: [],
      started_at: new Date().toISOString(),
    },
    returning: ['id'],
  });
}

/**
 * Update AI session
 */
export async function updateAISession(
  hasyx: Hasyx,
  sessionId: string,
  data: {
    conversation?: any[];
    feedback?: any;
    duration_minutes?: number;
  }
) {
  return await hasyx.update({
    table: 'ai_sessions',
    pk_columns: { id: sessionId },
    _set: {
      ...data,
      ended_at: new Date().toISOString(),
    },
    returning: ['id'],
  });
}

/**
 * Get daily tasks for user
 */
export async function getDailyTasks(
  hasyx: Hasyx,
  userId: string,
  date: string
) {
  return await hasyx.select({
    table: 'daily_tasks',
    where: {
      user_id: { _eq: userId },
      task_date: { _eq: date },
    },
    order_by: [{ created_at: 'asc' }],
    returning: [
      'id',
      'stage_id',
      'task_date',
      'type',
      'title',
      'description',
      'ai_context',
      'suggested_prompt',
      'type_specific_payload',
      'duration_minutes',
      'status',
      'ai_enabled',
      'created_at',
      'completed_at',
    ],
  });
}

/**
 * Complete task
 */
export async function completeTask(hasyx: Hasyx, taskId: string) {
  return await hasyx.update({
    table: 'daily_tasks',
    pk_columns: { id: taskId },
    _set: {
      status: 'completed',
      completed_at: new Date().toISOString(),
    },
    returning: ['id', 'status'],
  });
}

/**
 * Get user profile
 */
export async function getUserProfile(hasyx: Hasyx, userId: string) {
  return await hasyx.select({
    table: 'users',
    pk_columns: { id: userId },
    returning: [
      'id',
      'name',
      'email',
      'current_level',
      'target_level',
      'exam_date',
      'start_date',
      'study_time',
      'study_place',
      'daily_goal_minutes',
      'reminder_enabled',
    ],
  });
}

/**
 * Get vocabulary cards for review
 */
export async function getVocabularyCardsForReview(
  hasyx: Hasyx,
  userId: string,
  date: string
) {
  return await hasyx.select({
    table: 'vocabulary_cards',
    where: {
      user_id: { _eq: userId },
      next_review_date: { _lte: date },
    },
    order_by: [{ next_review_date: 'asc' }],
    returning: [
      'id',
      'word',
      'translation',
      'example_sentence',
      'next_review_date',
      'difficulty',
    ],
  });
}

/**
 * Update vocabulary card review
 */
export async function updateVocabularyCardReview(
  hasyx: Hasyx,
  cardId: string,
  userId: string,
  wasCorrect: boolean,
  responseTimeSeconds?: number
) {
  // Get current card state
  const card = await hasyx.select({
    table: 'vocabulary_cards',
    pk_columns: { id: cardId },
    returning: ['correct_count', 'incorrect_count', 'difficulty'],
  });

  const newCorrectCount = wasCorrect
    ? (card?.correct_count || 0) + 1
    : card?.correct_count || 0;
  const newIncorrectCount = !wasCorrect
    ? (card?.incorrect_count || 0) + 1
    : card?.incorrect_count || 0;

  // Calculate next review date based on spaced repetition algorithm
  const daysUntilNextReview = wasCorrect
    ? Math.min(30, Math.pow(2, newCorrectCount))
    : 1;

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);

  // Update difficulty based on performance
  let newDifficulty = card?.difficulty || 'new';
  if (wasCorrect && newCorrectCount >= 3) {
    newDifficulty = 'mastered';
  } else if (wasCorrect && newCorrectCount >= 1) {
    newDifficulty = 'learning';
  } else if (!wasCorrect) {
    newDifficulty = 'review';
  }

  // Update card
  await hasyx.update({
    table: 'vocabulary_cards',
    pk_columns: { id: cardId },
    _set: {
      correct_count: newCorrectCount,
      incorrect_count: newIncorrectCount,
      next_review_date: nextReviewDate.toISOString().split('T')[0],
      difficulty: newDifficulty,
      last_reviewed_at: new Date().toISOString(),
    },
  });

  // Create review history entry
  await hasyx.insert({
    table: 'review_history',
    object: {
      card_id: cardId,
      user_id: userId,
      was_correct: wasCorrect,
      response_time_seconds: responseTimeSeconds,
    },
  });
}

/**
 * Get progress metrics for user
 */
export async function getProgressMetrics(
  hasyx: Hasyx,
  userId: string,
  startDate?: string,
  endDate?: string
) {
  const where: any = {
    user_id: { _eq: userId },
  };

  if (startDate) {
    where.date = { ...where.date, _gte: startDate };
  }
  if (endDate) {
    where.date = { ...where.date, _lte: endDate };
  }

  return await hasyx.select({
    table: 'progress_metrics',
    where,
    order_by: [{ date: 'desc' }],
    returning: [
      'date',
      'words_learned',
      'tasks_completed',
      'study_minutes',
      'accuracy_grammar',
      'accuracy_vocabulary',
      'accuracy_listening',
      'accuracy_reading',
      'accuracy_writing',
    ],
  });
}

/**
 * Get streak information
 */
export async function getStreak(hasyx: Hasyx, userId: string) {
  return await hasyx.select({
    table: 'streaks',
    where: { user_id: { _eq: userId } },
    returning: ['current_streak', 'longest_streak', 'last_activity_date'],
  });
}

/**
 * Get stage progress
 */
export async function getStageProgress(
  hasyx: Hasyx,
  userId: string,
  stageId: string
) {
  return await hasyx.select({
    table: 'stage_progress',
    where: {
      user_id: { _eq: userId },
      stage_id: { _eq: stageId },
    },
    returning: [
      'id',
      'started_at',
      'completed_at',
      'tasks_completed',
      'tasks_total',
      'words_learned',
      'errors_pending',
      'average_accuracy',
      'status',
    ],
  });
}

/**
 * Get stage requirements
 */
export async function getStageRequirements(hasyx: Hasyx, stageId: string) {
  return await hasyx.select({
    table: 'stage_requirements',
    where: { stage_id: { _eq: stageId } },
    order_by: [{ order_index: 'asc' }],
    returning: [
      'id',
      'requirement_type',
      'requirement_value',
      'requirement_threshold',
      'description',
      'order_index',
    ],
  });
}

/**
 * Получить активный этап пользователя (в работе или готов к тесту)
 */
export async function getActiveStageProgress(
  hasyx: Hasyx,
  userId: string
) {
  const data = await hasyx.select({
    table: 'stage_progress',
    where: {
      user_id: { _eq: userId },
      status: { _in: ['in_progress', 'ready_for_test'] },
    },
    order_by: [{ started_at: 'desc' }],
    limit: 1,
    returning: [
      'id',
      'stage_id',
      'started_at',
      'completed_at',
      'tasks_completed',
      'tasks_total',
      'words_learned',
      'errors_pending',
      'average_accuracy',
      'status',
      {
        stage: [
          'id',
          'name',
          'level_from',
          'level_to',
          'focus',
          'description',
          'order_index',
          'start_month',
          'end_month',
        ],
      },
    ],
  });

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data ?? null;
}

/**
 * Получить структуру недели для этапа
 */
export async function getWeeklyStructureForStage(
  hasyx: Hasyx,
  stageId: string,
  dayOfWeek?: number
) {
  const where: Record<string, any> = {
    stage_id: { _eq: stageId },
  };

  if (typeof dayOfWeek === 'number') {
    where.day_of_week = { _eq: dayOfWeek };
  }

  return await hasyx.select({
    table: 'weekly_structure',
    where,
    order_by: [
      { day_of_week: 'asc' },
      { order_index: 'asc' },
    ],
    returning: [
      'id',
      'day_of_week',
      'activity_type',
      'duration_minutes',
      'description',
      'order_index',
    ],
  });
}

interface UpsertDailyTaskInput {
  userId: string;
  stageId?: string | null;
  taskDate: string;
  type: string;
  title: string;
  description?: string | null;
  duration: number;
  aiEnabled?: boolean;
  aiContext?: any;
  suggestedPrompt?: string | null;
  typeSpecificPayload?: any;
}

/**
 * Создать или обновить ежедневное задание
 */
export async function upsertDailyTaskFromStructure(
  hasyx: Hasyx,
  input: UpsertDailyTaskInput
) {
  return await hasyx.upsert({
    table: 'daily_tasks',
    object: {
      user_id: input.userId,
      stage_id: input.stageId ?? null,
      task_date: input.taskDate,
      type: input.type,
      title: input.title,
      description: input.description,
      duration_minutes: input.duration,
      ai_enabled: input.aiEnabled ?? false,
      ai_context: input.aiContext,
      suggested_prompt: input.suggestedPrompt,
      type_specific_payload: input.typeSpecificPayload,
    },
    on_conflict: {
      constraint: 'daily_tasks_user_id_task_date_type_key',
      update_columns: [
        'stage_id',
        'title',
        'description',
        'duration_minutes',
        'ai_enabled',
        'ai_context',
        'suggested_prompt',
        'type_specific_payload',
      ],
    },
    returning: ['id'],
  });
}

/**
 * Обновить метаданные задания (AI контекст, промпт, payload)
 */
export async function updateDailyTaskMetadata(
  hasyx: Hasyx,
  taskId: string,
  data: {
    aiContext?: any;
    suggestedPrompt?: string | null;
    typeSpecificPayload?: any;
  }
) {
  const payload: Record<string, any> = {};

  if ('aiContext' in data) {
    payload.ai_context = data.aiContext;
  }
  if ('suggestedPrompt' in data) {
    payload.suggested_prompt = data.suggestedPrompt;
  }
  if ('typeSpecificPayload' in data) {
    payload.type_specific_payload = data.typeSpecificPayload;
  }

  if (Object.keys(payload).length === 0) {
    return null;
  }

  return await hasyx.update({
    table: 'daily_tasks',
    pk_columns: { id: taskId },
    _set: payload,
    returning: ['id'],
  });
}

/**
 * Обновить агрегированные показатели этапа
 */
export async function updateStageProgressStats(
  hasyx: Hasyx,
  stageProgressId: string,
  data: {
    tasksCompleted?: number;
    tasksTotal?: number;
    wordsLearned?: number;
    errorsPending?: number;
    averageAccuracy?: number;
    status?: 'in_progress' | 'ready_for_test' | 'test_passed' | 'completed';
  }
) {
  const payload: Record<string, any> = {};

  if (typeof data.tasksCompleted === 'number') {
    payload.tasks_completed = data.tasksCompleted;
  }
  if (typeof data.tasksTotal === 'number') {
    payload.tasks_total = data.tasksTotal;
  }
  if (typeof data.wordsLearned === 'number') {
    payload.words_learned = data.wordsLearned;
  }
  if (typeof data.errorsPending === 'number') {
    payload.errors_pending = data.errorsPending;
  }
  if (typeof data.averageAccuracy === 'number') {
    payload.average_accuracy = data.averageAccuracy;
  }
  if (data.status) {
    payload.status = data.status;
  }

  if (Object.keys(payload).length === 0) {
    return null;
  }

  return await hasyx.update({
    table: 'stage_progress',
    pk_columns: { id: stageProgressId },
    _set: payload,
    returning: ['id'],
  });
}

/**
 * Получить последние метрики прогресса
 */
export async function getLatestProgressMetric(
  hasyx: Hasyx,
  userId: string
) {
  const data = await hasyx.select({
    table: 'progress_metrics',
    where: { user_id: { _eq: userId } },
    order_by: [{ date: 'desc' }],
    limit: 1,
    returning: [
      'date',
      'words_learned',
      'tasks_completed',
      'study_minutes',
      'accuracy_grammar',
      'accuracy_vocabulary',
      'accuracy_listening',
      'accuracy_reading',
      'accuracy_writing',
    ],
  });

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data ?? null;
}

/**
 * Получить достижения пользователя
 */
export async function getAchievements(hasyx: Hasyx, userId: string) {
  return await hasyx.select({
    table: 'achievements',
    where: { user_id: { _eq: userId } },
    order_by: [{ unlocked_at: 'desc' }],
    returning: ['id', 'type', 'title', 'description', 'icon', 'unlocked_at'],
  });
}

