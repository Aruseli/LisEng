import type { Hasyx } from '@/lib/hasura/compat';
import {
  applyReview,
  createNewCard,
  getDueStates,
  getQualityScore,
  getState,
  getWeakStates,
  isMastered,
  recordToCard,
  saveState,
  type SrsStateRecord,
} from '@/lib/srs';
import verbsCatalog from '../../../data/irregular-verbs.json';

export interface IrregularVerb {
  id: string;
  infinitive: string;
  past_simple: string;
  past_participle: string;
  group_number: number | null;
  frequency: 'must_know' | 'high' | 'medium' | 'low' | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  mnemonic_tip: string | null;
  meaning_ru?: string | null;
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

const meaningByInfinitive = new Map(
  (verbsCatalog as Array<{ infinitive: string; meaning_ru?: string }>).map((verb) => [
    verb.infinitive,
    verb.meaning_ru ?? null,
  ])
);

function withMeaning<T extends { infinitive: string }>(verb: T): T & { meaning_ru?: string | null } {
  return { ...verb, meaning_ru: meaningByInfinitive.get(verb.infinitive) ?? null };
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
      limit: 500,
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
    return normalized.map(verb => withMeaning({
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
   * Get verbs due for review (FSRS: due из srs_state)
   */
  async getVerbsForReview(
    userId: string,
    date: string = new Date().toISOString().split('T')[0],
    limit: number = 20
  ): Promise<VerbWithProgress[]> {
    const dueStates = await getDueStates(this.hasyx, userId, 'verb', date);

    // mastered фильтруем по FSRS stability, сортировка как раньше: reps asc, due asc
    const active = dueStates
      .filter((s) => !isMastered(recordToCard(s)))
      .sort((a, b) => a.reps - b.reps || a.due.localeCompare(b.due))
      .slice(0, limit);

    return this.joinVerbsWithProgress(active);
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
   *
   * FSRS: scheduling считается в srs_state (источник истины).
   * verb_learning_progress — денормализованная read-model для UI
   * (счётчики correct/incorrect + зеркала next_review_date/mastered/repetitions).
   */
  async recordPracticeResult(
    userId: string,
    verbId: string,
    result: PracticeResult
  ): Promise<void> {
    const quality = getQualityScore(result.wasCorrect, result.responseTime);
    const card = await applyReview(this.hasyx, userId, 'verb', verbId, quality);
    const dueDate = card.due.toISOString().split('T')[0];

    // Get or create progress (read-model)
    let progress = await this.getProgressForVerb(verbId, userId);

    if (!progress) {
      const inserted = await this.hasyx.insert({
        table: 'verb_learning_progress',
        object: {
          user_id: userId,
          verb_id: verbId,
          next_review_date: dueDate,
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

    const newCorrectCount = result.wasCorrect
      ? progress.correct_count + 1
      : progress.correct_count;
    const newIncorrectCount = !result.wasCorrect
      ? progress.incorrect_count + 1
      : progress.incorrect_count;

    // mastered по FSRS: stability >= 30 дней (замена «5 reps + 30 дней»)
    const mastered = isMastered(card);

    await this.hasyx.update({
      table: 'verb_learning_progress',
      pk_columns: { id: progress.id },
      _set: {
        next_review_date: dueDate,
        correct_count: newCorrectCount,
        incorrect_count: newIncorrectCount,
        last_reviewed_at: new Date().toISOString(),
        mastered,
        // Зеркала из FSRS для сортировок UI (ease_factor — legacy, не пишем)
        interval_days: card.scheduled_days,
        repetitions: card.reps,
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
    const today = new Date().toISOString().split('T')[0];

    // Read-model для UI
    const progress = await this.getProgressForVerb(verbId, userId);
    if (!progress) {
      await this.hasyx.insert({
        table: 'verb_learning_progress',
        object: {
          user_id: userId,
          verb_id: verbId,
          next_review_date: today,
        },
      });
    }

    // FSRS: новое состояние без фиктивных повторений, due = сегодня
    const existing = await getState(this.hasyx, userId, 'verb', verbId);
    if (!existing) {
      const card = createNewCard(new Date());
      await saveState(this.hasyx, userId, 'verb', verbId, card);
    }
  }

  /**
   * Get weak verbs (FSRS: высокая difficulty или низкая retrievability)
   */
  async getWeakVerbs(
    userId: string,
    limit: number = 10
  ): Promise<VerbWithProgress[]> {
    const weakStates = await getWeakStates(this.hasyx, userId, 'verb');
    return this.joinVerbsWithProgress(weakStates.slice(0, limit));
  }

  /**
   * Join srs_state с контентом глаголов и read-model verb_learning_progress.
   * Scheduling-поля (next_review_date, mastered, repetitions, interval_days)
   * берутся из srs_state — источника истины; счётчики — из verb_learning_progress.
   */
  private async joinVerbsWithProgress(states: SrsStateRecord[]): Promise<VerbWithProgress[]> {
    if (states.length === 0) return [];

    const verbIds = states.map((s) => s.item_id);
    const [verbs, progressList] = await Promise.all([
      this.hasyx.select({
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
      }),
      this.hasyx.select({
        table: 'verb_learning_progress',
        where: {
          user_id: { _eq: states[0].user_id },
          verb_id: { _in: verbIds },
        },
        returning: [
          'id',
          'user_id',
          'verb_id',
          'correct_count',
          'incorrect_count',
          'last_reviewed_at',
          'created_at',
        ],
      }),
    ]);

    const verbsArray = Array.isArray(verbs) ? verbs : verbs ? [verbs] : [];
    const progressArray = Array.isArray(progressList) ? progressList : progressList ? [progressList] : [];
    const progressMap = new Map(progressArray.map((p) => [p.verb_id, p]));
    const stateMap = new Map(states.map((s) => [s.item_id, s]));
    const order = new Map(verbIds.map((id, index) => [id, index]));

    return verbsArray
      .slice()
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
      .map((verb) => {
        const state = stateMap.get(verb.id)!;
        const progressRow = progressMap.get(verb.id);
        const progress: VerbLearningProgress = {
          id: progressRow?.id ?? state.id,
          user_id: state.user_id,
          verb_id: verb.id,
          next_review_date: state.due,
          correct_count: progressRow?.correct_count ?? 0,
          incorrect_count: progressRow?.incorrect_count ?? 0,
          last_reviewed_at: state.last_review_at,
          mastered: isMastered(recordToCard(state)),
          ease_factor: 0, // legacy, не используется
          interval_days: state.scheduled_days,
          repetitions: state.reps,
          created_at: progressRow?.created_at ?? state.created_at,
        };
        return withMeaning({ ...verb, progress });
      });
  }

  async pickDailyPack(userId: string, count: number = 4): Promise<VerbWithProgress[]> {
    const today = new Date().toISOString().split('T')[0];
    const due = await this.getVerbsForReview(userId, today, 30);
    const picked: VerbWithProgress[] = [];
    const seen = new Set<string>();

    const take = (verb: VerbWithProgress) => {
      if (seen.has(verb.id) || picked.length >= count) return;
      if (verb.progress?.repetitions != null && verb.progress.repetitions >= 5) return;
      seen.add(verb.id);
      picked.push(verb);
    };

    due
      .filter((verb) => (verb.progress?.repetitions ?? 0) === 0 && (verb.progress?.incorrect_count ?? 0) > 0)
      .forEach(take);
    due.forEach(take);

    if (picked.length < 3) {
      const catalog = await this.getVerbs({ includeProgress: true, userId });
      const fresh = catalog
        .filter((verb) => !verb.progress)
        .sort((a, b) => {
          const freqRank = (value: string | null) =>
            value === 'must_know' ? 0 : value === 'high' ? 1 : value === 'medium' ? 2 : 3;
          return freqRank(a.frequency) - freqRank(b.frequency) || (a.group_number ?? 9) - (b.group_number ?? 9);
        });
      for (const verb of fresh) {
        if (picked.length >= count) break;
        await this.addToReviewQueue(userId, verb.id);
        take(verb);
      }
    }

    return picked.slice(0, count);
  }
}

