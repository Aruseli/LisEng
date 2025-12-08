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
      type,
      topic,
      conversation: [],
      started_at: new Date().toISOString(),
    },
    returning: ['id'],
  });
}

/**
 * Get active AI session for user
 */
export async function getAISession(
  hasyx: Hasyx,
  userId: string,
  type: string,
  topic?: string
) {
  const where: any = {
    user_id: { _eq: userId },
    type: { _eq: type },
    ended_at: { _is_null: true },
  };

  if (topic) {
    where.topic = { _eq: topic };
  }

  const result = await hasyx.select({
    table: 'ai_sessions',
    where,
    order_by: [{ started_at: 'desc' }],
    limit: 1,
    returning: ['id', 'conversation', 'started_at'],
  });

  return Array.isArray(result) && result.length > 0 ? result[0] : null;
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
    ended_at?: string | null;
  }
) {
  const updateData: any = { ...data };
  // ended_at устанавливается только если явно передан
  if (!('ended_at' in data)) {
    // Не устанавливаем ended_at при обычном обновлении
    delete updateData.ended_at;
  }

  return await hasyx.update({
    table: 'ai_sessions',
    pk_columns: { id: sessionId },
    _set: updateData,
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
 * Get user instruction language preference
 */
export async function getUserInstructionLanguage(hasyx: Hasyx, userId: string): Promise<string> {
  const result = await hasyx.select({
    table: 'users',
    pk_columns: { id: userId },
    returning: ['instruction_language'],
  });

  const user = Array.isArray(result) ? result[0] : result;
  return user?.instruction_language || 'ru';
}

/**
 * Update user instruction language preference
 */
export async function updateUserInstructionLanguage(
  hasyx: Hasyx,
  userId: string,
  language: string
) {
  return await hasyx.update({
    table: 'users',
    pk_columns: { id: userId },
    _set: {
      instruction_language: language,
    },
    returning: ['id', 'instruction_language'],
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
 * Обновить или создать метрики прогресса для пользователя
 */
export async function updateProgressMetrics(
  hasyx: Hasyx,
  userId: string,
  date: string,
  data: {
    tasksCompleted?: number;
    studyMinutes?: number;
    wordsLearned?: number;
  }
) {
  // Получаем текущие метрики
  const existing = await hasyx.select({
    table: 'progress_metrics',
    where: {
      user_id: { _eq: userId },
      date: { _eq: date },
    },
    limit: 1,
    returning: ['id', 'tasks_completed', 'study_minutes', 'words_learned'],
  });

  const existingMetric = Array.isArray(existing) ? existing[0] : existing;

  const updates: any = {};
  if (typeof data.tasksCompleted === 'number') {
    updates.tasks_completed = existingMetric
      ? (existingMetric.tasks_completed || 0) + data.tasksCompleted
      : data.tasksCompleted;
  }
  if (typeof data.studyMinutes === 'number') {
    updates.study_minutes = existingMetric
      ? (existingMetric.study_minutes || 0) + data.studyMinutes
      : data.studyMinutes;
  }
  if (typeof data.wordsLearned === 'number') {
    updates.words_learned = existingMetric
      ? (existingMetric.words_learned || 0) + data.wordsLearned
      : data.wordsLearned;
  }

  if (existingMetric?.id) {
    return await hasyx.update({
      table: 'progress_metrics',
      pk_columns: { id: existingMetric.id },
      _set: updates,
      returning: ['id'],
    });
  } else {
    return await hasyx.insert({
      table: 'progress_metrics',
      object: {
        user_id: userId,
        date,
        ...updates,
      },
      returning: ['id'],
    });
  }
}

/**
 * Обновить стрик пользователя (увеличить только если все задания дня выполнены)
 * Также проверяет, нужно ли создать тест Shu-Ha-Ri на 7-й день стрика
 */
export async function updateStreak(hasyx: Hasyx, userId: string, date: string) {
  // Получаем все задания дня
  const tasks = await getDailyTasks(hasyx, userId, date);
  const allTasks = Array.isArray(tasks) ? tasks : [];
  
  // Проверяем, все ли задания выполнены
  const allCompleted = allTasks.length > 0 && allTasks.every((task: any) => task.status === 'completed');
  
  if (!allCompleted) {
    return null; // Не обновляем стрик, если не все задания выполнены
  }

  // Получаем текущий стрик
  const streakResult = await hasyx.select({
    table: 'streaks',
    where: {
      user_id: { _eq: userId },
    },
    limit: 1,
    returning: ['id', 'current_streak', 'longest_streak', 'last_activity_date'],
  });

  const streak = Array.isArray(streakResult) ? streakResult[0] : streakResult;
  const today = new Date(date);
  const todayStr = today.toISOString().split('T')[0];
  const lastActivity = streak?.last_activity_date ? new Date(streak.last_activity_date) : null;
  const lastActivityStr = lastActivity ? lastActivity.toISOString().split('T')[0] : null;
  
  let newCurrentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;

  // Если уже обновляли сегодня - не увеличиваем стрик повторно
  if (lastActivityStr === todayStr) {
    // Уже обновляли сегодня, возвращаем текущий стрик без изменений
    return streak;
  }

  // Проверяем, был ли вчера активность
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const wasActiveYesterday = lastActivityStr === yesterdayStr;

  if (wasActiveYesterday) {
    // Продолжаем стрик - увеличиваем на 1
    newCurrentStreak = (streak?.current_streak || 0) + 1;
  } else if (!lastActivity) {
    // Первый день - начинаем стрик с 1
    newCurrentStreak = 1;
  } else {
    // Пропустили день(и) - сбрасываем стрик и начинаем с 1
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(longestStreak, newCurrentStreak);

  let updatedStreak;
  if (streak?.id) {
    updatedStreak = await hasyx.update({
      table: 'streaks',
      pk_columns: { id: streak.id },
      _set: {
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: date,
        updated_at: new Date().toISOString(),
      },
      returning: ['id', 'current_streak'],
    });
  } else {
    updatedStreak = await hasyx.insert({
      table: 'streaks',
      object: {
        user_id: userId,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: date,
      },
      returning: ['id', 'current_streak'],
    });
  }

  const finalStreak = Array.isArray(updatedStreak) ? updatedStreak[0] : updatedStreak;

  // Проверяем, нужно ли создать тест Shu-Ha-Ri на 7-й день стрика (или кратный 7)
  if (newCurrentStreak > 0 && newCurrentStreak % 7 === 0) {
    try {
      // Динамически импортируем ShuHaRiService, чтобы избежать циклических зависимостей
      const { ShuHaRiService } = await import('@/lib/lesson-snapshots/shu-ha-ri-service');
      const shuHaRiService = new ShuHaRiService(hasyx);
      
      // Рассчитываем дату начала недели стрика (7 дней назад от текущей даты)
      const weekStartDate = new Date(today);
      weekStartDate.setDate(weekStartDate.getDate() - 6); // 7 дней назад (включая сегодня)
      
      // Проверяем, был ли уже создан тест на этот стрик-день
      const testExists = await shuHaRiService.shouldCreateWeeklyTest(userId, weekStartDate);
      
      if (testExists) {
        // Создаем тест для этого стрик-дня
        await shuHaRiService.generateWeeklyTest(userId, weekStartDate, 'comprehensive');
        console.log(`[updateStreak] Created Shu-Ha-Ri test for streak day ${newCurrentStreak}`);
      }
    } catch (error) {
      // Не прерываем обновление стрика, если не удалось создать тест
      console.error('[updateStreak] Failed to create Shu-Ha-Ri test:', error);
    }
  }

  return finalStreak;
}

/**
 * Получить прогресс Кумон для пользователя
 */
export async function getKumonProgress(hasyx: Hasyx, userId: string) {
  return await hasyx.select({
    table: 'kumon_progress',
    where: {
      user_id: { _eq: userId },
    },
    order_by: [
      { current_level: 'desc' },
      { last_practiced_at: 'desc' },
    ],
    returning: [
      'id',
      'skill_category',
      'skill_subcategory',
      'current_level',
      'target_level',
      'consecutive_correct',
      'accuracy_rate',
      'completion_time_avg',
      'status',
      'last_practiced_at',
      'created_at',
      'updated_at',
    ],
  });
}

/**
 * Обновить прогресс этапа на основе задания
 */
export async function updateStageProgressFromTask(
  hasyx: Hasyx,
  userId: string,
  taskId: string
) {
  // Получаем задание
  const taskResult = await hasyx.select({
    table: 'daily_tasks',
    pk_columns: { id: taskId },
    returning: ['stage_id', 'duration_minutes'],
  });

  const taskData = Array.isArray(taskResult) ? taskResult[0] : taskResult;
  if (!taskData?.stage_id) {
    return null;
  }

  // Получаем прогресс этапа
  const progressResult = await hasyx.select({
    table: 'stage_progress',
    pk_columns: { id: taskData.stage_id },
    returning: ['id', 'tasks_completed', 'tasks_total'],
  });

  const progress = Array.isArray(progressResult) ? progressResult[0] : progressResult;
  if (!progress?.id) {
    return null;
  }

  // Увеличиваем счетчик выполненных заданий
  const newTasksCompleted = (progress.tasks_completed || 0) + 1;

  return await hasyx.update({
    table: 'stage_progress',
    pk_columns: { id: progress.id },
    _set: {
      tasks_completed: newTasksCompleted,
    },
    returning: ['id', 'tasks_completed'],
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

