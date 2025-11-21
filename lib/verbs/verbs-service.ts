import { Hasyx } from 'hasyx';
import { calculateSM2, getQualityScore, initializeSM2 } from '@/lib/lesson-snapshots/sm2-algorithm';

export interface IrregularVerb {
  id: string;
  infinitive: string;
  past_simple: string;
  past_participle: string;
  group_number: number | null;
  frequency: 'must_know' | 'high' | 'medium' | 'low' | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  mnemonic_tip: string | null;
  related_verbs: string[] | null;
  created_at: string;
}

export interface VerbExample {
  id: string;
  verb_id: string;
  form_type: 'base' | 'past' | 'participle';
  sentence_en: string;
  sentence_ru: string;
  context: string | null;
  created_at: string;
}

export interface VerbLearningProgress {
  id: string;
  user_id: string;
  verb_id: string;
  next_review_date: string;
  correct_count: number;
  incorrect_count: number;
  last_reviewed_at: string | null;
  mastered: boolean;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  created_at: string;
}

export interface VerbWithProgress extends IrregularVerb {
  progress?: VerbLearningProgress;
  examples?: VerbExample[];
}

export interface GroupProgress {
  group_number: number;
  total: number;
  learned: number;
  mastered: number;
  percentage: number;
}

export interface PracticeResult {
  verbId: string;
  wasCorrect: boolean;
  responseTime?: number;
  practiceMode: 'form-to-meaning' | 'sentence-to-form' | 'ai-dialog';
}

export class VerbsService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Get all irregular verbs with optional filters
   */
  async getVerbs(filters?: {
    group?: number;
    frequency?: 'must_know' | 'high' | 'medium' | 'low';
    userId?: string;
    includeProgress?: boolean;
    includeExamples?: boolean;
  }): Promise<VerbWithProgress[]> {
    const where: any = {};
    
    if (filters?.group) {
      where.group_number = { _eq: filters.group };
    }
    if (filters?.frequency) {
      where.frequency = { _eq: filters.frequency };
    }

    const verbs = await this.hasyx.select({
      table: 'irregular_verbs',
      where,
      order_by: [
        { frequency: 'asc' }, // must_know first
        { group_number: 'asc' },
        { infinitive: 'asc' },
      ],
      returning: [
        'id',
        'infinitive',
        'past_simple',
        'past_participle',
        'group_number',
        'frequency',
        'difficulty',
        'mnemonic_tip',
        'related_verbs',
        'created_at',
      ],
    });

    const normalized = Array.isArray(verbs) ? verbs : verbs ? [verbs] : [];
    
    // Load progress if requested
    let progressMap = new Map<string, VerbLearningProgress>();
    if (filters?.includeProgress && filters?.userId) {
      const verbIds = normalized.map(v => v.id);
      if (verbIds.length > 0) {
        const allProgress = await this.hasyx.select({
          table: 'verb_learning_progress',
          where: {
            user_id: { _eq: filters.userId },
            verb_id: { _in: verbIds },
          },
          returning: [
            'id',
            'user_id',
            'verb_id',
            'next_review_date',
            'correct_count',
            'incorrect_count',
            'last_reviewed_at',
            'mastered',
            'ease_factor',
            'interval_days',
            'repetitions',
            'created_at',
          ],
        });
        const progressArray = Array.isArray(allProgress) ? allProgress : allProgress ? [allProgress] : [];
        progressMap = new Map(progressArray.map(p => [p.verb_id, p]));
      }
    }

    // Load examples if requested
    let examplesMap = new Map<string, VerbExample[]>();
    if (filters?.includeExamples) {
      const verbIds = normalized.map(v => v.id);
      if (verbIds.length > 0) {
        const examples = await this.getExamplesForVerbs(verbIds);
        for (const example of examples) {
          const existing = examplesMap.get(example.verb_id) || [];
          existing.push(example);
          examplesMap.set(example.verb_id, existing);
        }
      }
    }

    // Combine verbs with progress and examples
    return normalized.map(verb => ({
      ...verb,
      progress: progressMap.get(verb.id),
      examples: examplesMap.get(verb.id),
    }));
  }

  /**
   * Get verb by ID with progress and examples
   */
  async getVerbWithDetails(
    verbId: string,
    userId?: string
  ): Promise<VerbWithProgress | null> {
    const verb = await this.hasyx.select({
      table: 'irregular_verbs',
      pk_columns: { id: verbId },
      returning: [
        'id',
        'infinitive',
        'past_simple',
        'past_participle',
        'group_number',
        'frequency',
        'difficulty',
        'mnemonic_tip',
        'related_verbs',
        'created_at',
      ],
    });

    const normalized = Array.isArray(verb) ? verb[0] : verb;
    if (!normalized) return null;

    const [examples, progress] = await Promise.all([
      this.getExamplesForVerb(verbId),
      userId ? this.getProgressForVerb(verbId, userId) : null,
    ]);

    return {
      ...normalized,
      examples,
      progress: progress || undefined,
    };
  }

  /**
   * Get examples for a verb
   */
  async getExamplesForVerb(verbId: string): Promise<VerbExample[]> {
    const examples = await this.hasyx.select({
      table: 'verb_examples',
      where: { verb_id: { _eq: verbId } },
      order_by: [{ form_type: 'asc' }],
      returning: [
        'id',
        'verb_id',
        'form_type',
        'sentence_en',
        'sentence_ru',
        'context',
        'created_at',
      ],
    });

    return Array.isArray(examples) ? examples : examples ? [examples] : [];
  }

  /**
   * Get examples for multiple verbs
   */
  async getExamplesForVerbs(verbIds: string[]): Promise<VerbExample[]> {
    if (verbIds.length === 0) return [];

    const examples = await this.hasyx.select({
      table: 'verb_examples',
      where: { verb_id: { _in: verbIds } },
      order_by: [{ verb_id: 'asc' }, { form_type: 'asc' }],
      returning: [
        'id',
        'verb_id',
        'form_type',
        'sentence_en',
        'sentence_ru',
        'context',
        'created_at',
      ],
    });

    return Array.isArray(examples) ? examples : examples ? [examples] : [];
  }

  /**
   * Get learning progress for a verb
   */
  async getProgressForVerb(
    verbId: string,
    userId: string
  ): Promise<VerbLearningProgress | null> {
    const progress = await this.hasyx.select({
      table: 'verb_learning_progress',
      where: {
        verb_id: { _eq: verbId },
        user_id: { _eq: userId },
      },
      returning: [
        'id',
        'user_id',
        'verb_id',
        'next_review_date',
        'correct_count',
        'incorrect_count',
        'last_reviewed_at',
        'mastered',
        'ease_factor',
        'interval_days',
        'repetitions',
        'created_at',
      ],
    });

    const normalized = Array.isArray(progress) ? progress[0] : progress;
    return normalized || null;
  }

  /**
   * Get verbs due for review
   */
  async getVerbsForReview(
    userId: string,
    date: string = new Date().toISOString().split('T')[0],
    limit: number = 20
  ): Promise<VerbWithProgress[]> {
    const progressList = await this.hasyx.select({
      table: 'verb_learning_progress',
      where: {
        user_id: { _eq: userId },
        next_review_date: { _lte: date },
        mastered: { _eq: false },
      },
      order_by: [{ next_review_date: 'asc' }],
      limit,
      returning: [
        'id',
        'user_id',
        'verb_id',
        'next_review_date',
        'correct_count',
        'incorrect_count',
        'last_reviewed_at',
        'mastered',
        'ease_factor',
        'interval_days',
        'repetitions',
        'created_at',
      ],
    });

    const normalized = Array.isArray(progressList) ? progressList : progressList ? [progressList] : [];
    
    if (normalized.length === 0) return [];

    const verbIds = normalized.map(p => p.verb_id);
    const verbs = await this.hasyx.select({
      table: 'irregular_verbs',
      where: { id: { _in: verbIds } },
      returning: [
        'id',
        'infinitive',
        'past_simple',
        'past_participle',
        'group_number',
        'frequency',
        'difficulty',
        'mnemonic_tip',
        'related_verbs',
        'created_at',
      ],
    });

    const verbsArray = Array.isArray(verbs) ? verbs : verbs ? [verbs] : [];
    const progressMap = new Map(normalized.map(p => [p.verb_id, p]));

    return verbsArray.map(verb => ({
      ...verb,
      progress: progressMap.get(verb.id),
    }));
  }

  /**
   * Get progress by groups
   */
  async getGroupProgress(userId: string): Promise<GroupProgress[]> {
    // Get all verbs grouped by group_number
    const allVerbs = await this.getVerbs();
    
    // Get all progress for user
    const allProgress = await this.hasyx.select({
      table: 'verb_learning_progress',
      where: { user_id: { _eq: userId } },
      returning: ['verb_id', 'mastered', 'correct_count'],
    });

    const progressArray = Array.isArray(allProgress) ? allProgress : allProgress ? [allProgress] : [];
    const progressMap = new Map(
      progressArray.map(p => [p.verb_id, { mastered: p.mastered, correctCount: p.correct_count }])
    );

    // Group by group_number
    const groups = new Map<number, { total: number; learned: number; mastered: number }>();
    
    for (const verb of allVerbs) {
      const group = verb.group_number || 6; // Default to group 6 if null
      const current = groups.get(group) || { total: 0, learned: 0, mastered: 0 };
      current.total++;
      
      const progress = progressMap.get(verb.id);
      if (progress) {
        if (progress.correctCount > 0) {
          current.learned++;
        }
        if (progress.mastered) {
          current.mastered++;
        }
      }
      
      groups.set(group, current);
    }

    return Array.from(groups.entries())
      .map(([group_number, stats]) => ({
        group_number,
        ...stats,
        percentage: stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0,
      }))
      .sort((a, b) => a.group_number - b.group_number);
  }

  /**
   * Record practice result and update progress
   */
  async recordPracticeResult(
    userId: string,
    verbId: string,
    result: PracticeResult
  ): Promise<void> {
    // Get or create progress
    let progress = await this.getProgressForVerb(verbId, userId);
    
    if (!progress) {
      // Initialize progress with SM-2
      const sm2Base = initializeSM2();
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 1);

      const inserted = await this.hasyx.insert({
        table: 'verb_learning_progress',
        object: {
          user_id: userId,
          verb_id: verbId,
          next_review_date: nextReviewDate.toISOString().split('T')[0],
          ease_factor: sm2Base.easeFactor,
          interval_days: sm2Base.interval,
          repetitions: sm2Base.repetitions,
        },
        returning: ['id'],
      });

      const progressId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
      if (!progressId) {
        throw new Error('Failed to create progress record');
      }

      progress = await this.getProgressForVerb(verbId, userId);
      if (!progress) {
        throw new Error('Failed to retrieve created progress');
      }
    }

    // Calculate quality score
    const quality = getQualityScore(result.wasCorrect, result.responseTime);

    // Calculate new SM-2 parameters
    const sm2Result = calculateSM2({
      quality,
      easeFactor: progress.ease_factor,
      interval: progress.interval_days,
      repetitions: progress.repetitions,
    });

    // Update progress
    const newCorrectCount = result.wasCorrect
      ? progress.correct_count + 1
      : progress.correct_count;
    const newIncorrectCount = !result.wasCorrect
      ? progress.incorrect_count + 1
      : progress.incorrect_count;

    const mastered = sm2Result.repetitions >= 5 && sm2Result.interval >= 30;

    await this.hasyx.update({
      table: 'verb_learning_progress',
      pk_columns: { id: progress.id },
      _set: {
        next_review_date: sm2Result.nextReviewDate.toISOString().split('T')[0],
        correct_count: newCorrectCount,
        incorrect_count: newIncorrectCount,
        last_reviewed_at: new Date().toISOString(),
        mastered,
        ease_factor: sm2Result.easeFactor,
        interval_days: sm2Result.interval,
        repetitions: sm2Result.repetitions,
      },
    });

    // Record in review history
    await this.hasyx.insert({
      table: 'verb_review_history',
      object: {
        verb_id: verbId,
        user_id: userId,
        was_correct: result.wasCorrect,
        response_time_seconds: result.responseTime,
        practice_mode: result.practiceMode,
      },
    });
  }

  /**
   * Add verb to user's review queue (from lesson)
   */
  async addToReviewQueue(userId: string, verbId: string): Promise<void> {
    // Check if progress exists
    const progress = await this.getProgressForVerb(verbId, userId);
    
    if (!progress) {
      // Create initial progress
      const sm2Base = initializeSM2();
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 1);

      await this.hasyx.insert({
        table: 'verb_learning_progress',
        object: {
          user_id: userId,
          verb_id: verbId,
          next_review_date: nextReviewDate.toISOString().split('T')[0],
          ease_factor: sm2Base.easeFactor,
          interval_days: sm2Base.interval,
          repetitions: sm2Base.repetitions,
        },
      });
    }
  }

  /**
   * Get weak verbs (high incorrect count)
   */
  async getWeakVerbs(
    userId: string,
    limit: number = 10
  ): Promise<VerbWithProgress[]> {
    const progressList = await this.hasyx.select({
      table: 'verb_learning_progress',
      where: {
        user_id: { _eq: userId },
        incorrect_count: { _gt: 0 },
      },
      order_by: [
        { incorrect_count: 'desc' },
        { correct_count: 'asc' },
      ],
      limit,
      returning: [
        'id',
        'user_id',
        'verb_id',
        'next_review_date',
        'correct_count',
        'incorrect_count',
        'last_reviewed_at',
        'mastered',
        'ease_factor',
        'interval_days',
        'repetitions',
        'created_at',
      ],
    });

    const normalized = Array.isArray(progressList) ? progressList : progressList ? [progressList] : [];
    if (normalized.length === 0) return [];

    const verbIds = normalized.map(p => p.verb_id);
    const verbs = await this.hasyx.select({
      table: 'irregular_verbs',
      where: { id: { _in: verbIds } },
      returning: [
        'id',
        'infinitive',
        'past_simple',
        'past_participle',
        'group_number',
        'frequency',
        'difficulty',
        'mnemonic_tip',
        'related_verbs',
        'created_at',
      ],
    });

    const verbsArray = Array.isArray(verbs) ? verbs : verbs ? [verbs] : [];
    const progressMap = new Map(normalized.map(p => [p.verb_id, p]));

    return verbsArray.map(verb => ({
      ...verb,
      progress: progressMap.get(verb.id),
    }));
  }
}

