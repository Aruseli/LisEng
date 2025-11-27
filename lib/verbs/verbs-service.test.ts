import { describe, expect, it } from '@jest/globals';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '@/public/hasura-schema.json';
import { VerbsService } from './verbs-service';
import { randomUUID } from 'crypto';

const generate = Generator(schema as any);

function createAdminClient(): HasyxApolloClient {
  const url = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  if (!url || !secret) {
    throw new Error('Hasura admin credentials are not configured');
  }

  return createApolloClient({
    url,
    secret,
    ws: false,
  }) as HasyxApolloClient;
}

async function createTestUser(hasyx: Hasyx): Promise<string> {
  const testUserId = randomUUID();
  await hasyx.insert({
    table: 'users',
    object: {
      id: testUserId,
      name: `Test User ${testUserId.substring(0, 8)}`,
      email: `test-${testUserId}@example.com`,
    },
    returning: ['id'],
  });
  return testUserId;
}

async function deleteTestUser(hasyx: Hasyx, userId: string): Promise<void> {
  try {
    await hasyx.delete({
      table: 'users',
      pk_columns: { id: userId },
    });
  } catch (error) {
    // Ignore errors during cleanup
  }
}

describe('VerbsService', () => {
  it('should get verbs with filters', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      // Get all verbs
      const allVerbs = await service.getVerbs();
      expect(Array.isArray(allVerbs)).toBe(true);

      // Get verbs by group
      const group1Verbs = await service.getVerbs({ group: 1 });
      expect(Array.isArray(group1Verbs)).toBe(true);
      group1Verbs.forEach((verb) => {
        expect(verb.group_number).toBe(1);
      });

      // Get verbs by frequency
      const mustKnowVerbs = await service.getVerbs({ frequency: 'must_know' });
      expect(Array.isArray(mustKnowVerbs)).toBe(true);
      mustKnowVerbs.forEach((verb) => {
        expect(verb.frequency).toBe('must_know');
      });
    } catch (error) {
      // Skip if database is not available
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });

  it('should get verb with details including progress and examples', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      // First, get any verb
      const verbs = await service.getVerbs();
      if (verbs.length === 0) {
        console.warn('Skipping test: No verbs in database');
        return;
      }

      const testVerbId = verbs[0].id;
      const testUserId = randomUUID();

      // Get verb details without progress
      const verbWithoutProgress = await service.getVerbWithDetails(testVerbId);
      expect(verbWithoutProgress).toBeDefined();
      expect(verbWithoutProgress?.id).toBe(testVerbId);

      // Get verb details with progress (will be null if no progress exists)
      const verbWithProgress = await service.getVerbWithDetails(testVerbId, testUserId);
      expect(verbWithProgress).toBeDefined();
      expect(verbWithProgress?.id).toBe(testVerbId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });

  it('should get examples for verb', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      const verbs = await service.getVerbs();
      if (verbs.length === 0) {
        console.warn('Skipping test: No verbs in database');
        return;
      }

      const testVerbId = verbs[0].id;
      const examples = await service.getExamplesForVerb(testVerbId);
      expect(Array.isArray(examples)).toBe(true);
      examples.forEach((example) => {
        expect(example.verb_id).toBe(testVerbId);
        expect(['base', 'past', 'participle']).toContain(example.form_type);
        expect(example.sentence_en).toBeDefined();
        expect(example.sentence_ru).toBeDefined();
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });

  it('should get verbs for review', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      const testUserId = randomUUID();
      const today = new Date().toISOString().split('T')[0];

      // Get verbs for review (should return empty array if no progress exists)
      const verbsForReview = await service.getVerbsForReview(testUserId, today, 10);
      expect(Array.isArray(verbsForReview)).toBe(true);
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });

  it('should get group progress', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      const testUserId = randomUUID();
      const groups = await service.getGroupProgress(testUserId);
      expect(Array.isArray(groups)).toBe(true);
      groups.forEach((group) => {
        expect(group.group_number).toBeGreaterThanOrEqual(1);
        expect(group.group_number).toBeLessThanOrEqual(6);
        expect(group.total).toBeGreaterThanOrEqual(0);
        expect(group.learned).toBeGreaterThanOrEqual(0);
        expect(group.mastered).toBeGreaterThanOrEqual(0);
        expect(group.percentage).toBeGreaterThanOrEqual(0);
        expect(group.percentage).toBeLessThanOrEqual(100);
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });

  it('should record practice result and update progress', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    let testUserId: string | null = null;

    try {
      const verbs = await service.getVerbs();
      if (verbs.length === 0) {
        console.warn('Skipping test: No verbs in database');
        return;
      }

      // Create test user
      testUserId = await createTestUser(hasyx);
      const testVerbId = verbs[0].id;

      // Record correct answer
      await service.recordPracticeResult(testUserId, testVerbId, {
        verbId: testVerbId,
        wasCorrect: true,
        responseTime: 3,
        practiceMode: 'form-to-meaning',
      });

      // Check progress was created/updated
      const progress = await service.getProgressForVerb(testVerbId, testUserId);
      expect(progress).toBeDefined();
      expect(progress?.correct_count).toBeGreaterThanOrEqual(1);
      expect(progress?.next_review_date).toBeDefined();

      // Record incorrect answer
      await service.recordPracticeResult(testUserId, testVerbId, {
        verbId: testVerbId,
        wasCorrect: false,
        responseTime: 10,
        practiceMode: 'sentence-to-form',
      });

      // Check progress was updated
      const updatedProgress = await service.getProgressForVerb(testVerbId, testUserId);
      expect(updatedProgress).toBeDefined();
      expect(updatedProgress?.incorrect_count).toBeGreaterThanOrEqual(1);

      // Cleanup
      if (updatedProgress?.id) {
        await hasyx.delete({
          table: 'verb_learning_progress',
          pk_columns: { id: updatedProgress.id },
        });
      }
      await hasyx.delete({
        table: 'verb_review_history',
        where: {
          verb_id: { _eq: testVerbId },
          user_id: { _eq: testUserId },
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    } finally {
      // Cleanup test user
      if (testUserId) {
        await deleteTestUser(hasyx, testUserId);
      }
    }
  });

  it('should add verb to review queue', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    let testUserId: string | null = null;

    try {
      const verbs = await service.getVerbs();
      if (verbs.length === 0) {
        console.warn('Skipping test: No verbs in database');
        return;
      }

      // Create test user
      testUserId = await createTestUser(hasyx);
      const testVerbId = verbs[0].id;

      // Add to queue
      await service.addToReviewQueue(testUserId, testVerbId);

      // Check progress was created
      const progress = await service.getProgressForVerb(testVerbId, testUserId);
      expect(progress).toBeDefined();
      expect(progress?.next_review_date).toBeDefined();

      // Cleanup
      if (progress?.id) {
        await hasyx.delete({
          table: 'verb_learning_progress',
          pk_columns: { id: progress.id },
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    } finally {
      // Cleanup test user
      if (testUserId) {
        await deleteTestUser(hasyx, testUserId);
      }
    }
  });

  it('should get weak verbs', async () => {
    const apolloClient = createAdminClient();
    const hasyx = new Hasyx(apolloClient, generate);
    const service = new VerbsService(hasyx);

    try {
      const testUserId = randomUUID();
      const weakVerbs = await service.getWeakVerbs(testUserId, 10);
      expect(Array.isArray(weakVerbs)).toBe(true);
    } catch (error) {
      if (error instanceof Error && error.message.includes('credentials')) {
        console.warn('Skipping test: Hasura credentials not configured');
        return;
      }
      throw error;
    }
  });
});

