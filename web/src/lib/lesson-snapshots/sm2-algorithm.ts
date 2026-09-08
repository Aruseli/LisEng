/**
 * SM-2 Algorithm for Spaced Repetition
 * 
 * Based on SuperMemo 2 algorithm for calculating optimal intervals
 * between reviews based on quality of recall (0-5 scale).
 */

export interface SM2Params {
  quality: number; // 0-5: 0=blackout, 1=incorrect, 2=incorrect but remembered, 3=correct with difficulty, 4=correct, 5=perfect
  easeFactor: number; // Current ease factor (default: 2.5)
  interval: number; // Current interval in days
  repetitions: number; // Number of successful repetitions
}

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

/**
 * Calculate next review parameters using SM-2 algorithm
 * 
 * @param params Current SM-2 parameters
 * @returns Updated parameters and next review date
 */
export function calculateSM2(params: SM2Params): SM2Result {
  const { quality, easeFactor: currentEaseFactor, interval: currentInterval, repetitions: currentRepetitions } = params;

  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;
  let newRepetitions = currentRepetitions;

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // But EF cannot be less than 1.3
  newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // Calculate new interval and repetitions based on quality
  if (quality < 3) {
    // Incorrect response: reset repetitions and interval
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Correct response
    if (currentRepetitions === 0) {
      newInterval = 1; // First review: tomorrow
    } else if (currentRepetitions === 1) {
      newInterval = 6; // Second review: in 6 days
    } else {
      // Subsequent reviews: multiply interval by ease factor
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
    newRepetitions = currentRepetitions + 1;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
}

/**
 * Initialize SM-2 parameters for a new item
 */
export function initializeSM2(): Omit<SM2Params, 'quality'> {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
  };
}

/**
 * Get quality score from user response
 * 
 * @param wasCorrect Whether the user answered correctly
 * @param responseTimeSeconds Time taken to respond (optional, for fine-tuning)
 * @param hintUsed Whether user needed a hint (optional)
 * @returns Quality score 0-5
 */
export function getQualityScore(
  wasCorrect: boolean,
  responseTimeSeconds?: number,
  hintUsed?: boolean
): number {
  if (!wasCorrect) {
    // Incorrect response
    if (hintUsed) {
      return 1; // Incorrect even with hint
    }
    return 2; // Incorrect but might remember
  }

  // Correct response
  if (hintUsed) {
    return 3; // Correct but with difficulty (needed hint)
  }

  if (responseTimeSeconds !== undefined) {
    // Use response time to determine quality
    if (responseTimeSeconds < 2) {
      return 5; // Very fast = perfect recall
    } else if (responseTimeSeconds < 5) {
      return 4; // Fast = easy recall
    } else {
      return 3; // Slower = correct but with some difficulty
    }
  }

  // Default: correct without hint
  return 4;
}

