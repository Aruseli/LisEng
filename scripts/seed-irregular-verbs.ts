/**
 * Script to seed irregular verbs data into the database
 * Run with: npx tsx scripts/seed-irregular-verbs.ts
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '../public/hasura-schema.json';

dotenv.config();

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

interface VerbData {
  infinitive: string;
  past_simple: string;
  past_participle: string;
  group_number: number;
  frequency: 'must_know' | 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  mnemonic_tip: string;
  related_verbs: string[];
  examples: Array<{
    form_type: 'base' | 'past' | 'participle';
    sentence_en: string;
    sentence_ru: string;
    context: string;
  }>;
}

async function seedVerbs() {
  console.log('📝 Starting irregular verbs seeding...');

  const apolloClient = createAdminClient();
  const hasyx = new Hasyx(apolloClient, generate);

  // Read JSON file
  const dataPath = join(process.cwd(), 'data', 'irregular-verbs.json');
  const fileContent = readFileSync(dataPath, 'utf-8');
  const verbs: VerbData[] = JSON.parse(fileContent);

  console.log(`Found ${verbs.length} verbs to seed`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const verbData of verbs) {
    try {
      // Check if verb already exists
      const existing = await hasyx.select({
        table: 'irregular_verbs',
        where: { infinitive: { _eq: verbData.infinitive } },
        returning: ['id'],
      });

      const existingVerb = Array.isArray(existing) ? existing[0] : existing;

      if (existingVerb?.id) {
        console.log(`⏭️  Skipping ${verbData.infinitive} (already exists)`);
        skipped++;
        continue;
      }

      // Insert verb
      const insertedVerb = await hasyx.insert({
        table: 'irregular_verbs',
        object: {
          infinitive: verbData.infinitive,
          past_simple: verbData.past_simple,
          past_participle: verbData.past_participle,
          group_number: verbData.group_number,
          frequency: verbData.frequency,
          difficulty: verbData.difficulty,
          mnemonic_tip: verbData.mnemonic_tip || null,
          related_verbs: verbData.related_verbs || null,
        },
        returning: ['id'],
      });

      const verbId = Array.isArray(insertedVerb) ? insertedVerb[0]?.id : insertedVerb?.id;

      if (!verbId) {
        throw new Error('Failed to get verb ID after insert');
      }

      // Insert examples
      for (const example of verbData.examples || []) {
        await hasyx.insert({
          table: 'verb_examples',
          object: {
            verb_id: verbId,
            form_type: example.form_type,
            sentence_en: example.sentence_en,
            sentence_ru: example.sentence_ru,
            context: example.context || null,
          },
        });
      }

      inserted++;
      console.log(`✅ Inserted ${verbData.infinitive} (${inserted}/${verbs.length})`);
    } catch (error: any) {
      errors++;
      console.error(`❌ Error inserting ${verbData.infinitive}:`, error?.message);
    }
  }

  console.log('\n📊 Seeding summary:');
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('✅ Seeding completed!');
}

seedVerbs().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

