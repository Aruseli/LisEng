import { describe, expect, it } from '@jest/globals';
import { calculateSM2, initializeSM2, getQualityScore } from './sm2-algorithm';

describe('SM-2 Algorithm', () => {
  describe('initializeSM2', () => {
    it('should initialize with default values', () => {
      const init = initializeSM2();
      expect(init.easeFactor).toBe(2.5);
      expect(init.interval).toBe(1);
      expect(init.repetitions).toBe(0);
    });
  });

  describe('getQualityScore', () => {
    it('should return 1 for incorrect answer with hint', () => {
      expect(getQualityScore(false, undefined, true)).toBe(1);
    });

    it('should return 2 for incorrect answer without hint', () => {
      expect(getQualityScore(false, undefined, false)).toBe(2);
      expect(getQualityScore(false)).toBe(2);
    });

    it('should return 3 for correct answer with hint', () => {
      expect(getQualityScore(true, undefined, true)).toBe(3);
    });

    it('should return 5 for very fast correct answer (< 2 seconds)', () => {
      expect(getQualityScore(true, 1.5)).toBe(5);
    });

    it('should return 4 for fast correct answer (2-5 seconds)', () => {
      expect(getQualityScore(true, 3)).toBe(4);
      expect(getQualityScore(true, 4.9)).toBe(4);
    });

    it('should return 3 for slow correct answer (> 5 seconds)', () => {
      expect(getQualityScore(true, 6)).toBe(3);
      expect(getQualityScore(true, 10)).toBe(3);
    });

    it('should return 4 for correct answer without time or hint', () => {
      expect(getQualityScore(true)).toBe(4);
      expect(getQualityScore(true, undefined, false)).toBe(4);
    });
  });

  describe('calculateSM2', () => {
    it('should reset repetitions and interval for quality < 3', () => {
      const result = calculateSM2({
        quality: 2,
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
      });

      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
      expect(result.easeFactor).toBeLessThan(2.5); // Should decrease
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should set interval to 1 day for first correct review (repetitions = 0)', () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
      });

      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
      // Quality 4 doesn't change ease factor (remains 2.5)
      expect(result.easeFactor).toBe(2.5);
    });

    it('should set interval to 6 days for second correct review (repetitions = 1)', () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
      });

      expect(result.repetitions).toBe(2);
      expect(result.interval).toBe(6);
      // Quality 4 doesn't change ease factor (remains 2.5)
      expect(result.easeFactor).toBe(2.5);
    });

    it('should multiply interval by ease factor for subsequent reviews', () => {
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
      });

      expect(result.repetitions).toBe(3);
      expect(result.interval).toBe(15); // 6 * 2.5 = 15
      // Quality 4 doesn't change ease factor (remains 2.5)
      expect(result.easeFactor).toBe(2.5);
    });

    it('should decrease ease factor for low quality answers', () => {
      const result = calculateSM2({
        quality: 3,
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
      });

      expect(result.easeFactor).toBeLessThan(2.5);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should increase ease factor for high quality answers', () => {
      const result = calculateSM2({
        quality: 5,
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
      });

      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('should never allow ease factor below 1.3', () => {
      const result = calculateSM2({
        quality: 0,
        easeFactor: 1.3,
        interval: 1,
        repetitions: 0,
      });

      expect(result.easeFactor).toBe(1.3);
    });

    it('should calculate next review date correctly', () => {
      const today = new Date();
      const result = calculateSM2({
        quality: 4,
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
      });

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() + result.interval);

      expect(result.nextReviewDate.getDate()).toBe(expectedDate.getDate());
      expect(result.nextReviewDate.getMonth()).toBe(expectedDate.getMonth());
      expect(result.nextReviewDate.getFullYear()).toBe(expectedDate.getFullYear());
    });

    it('should handle perfect recall (quality = 5)', () => {
      const result = calculateSM2({
        quality: 5,
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
      });

      expect(result.easeFactor).toBeGreaterThan(2.5);
      expect(result.repetitions).toBe(3);
      expect(result.interval).toBeGreaterThan(6);
    });

    it('should handle complete blackout (quality = 0)', () => {
      const result = calculateSM2({
        quality: 0,
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
      });

      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
      expect(result.easeFactor).toBeLessThan(2.5);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });
});

