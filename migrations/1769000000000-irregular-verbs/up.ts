import { Hasura } from 'hasyx/lib/hasura/hasura';
import dotenv from 'dotenv';

dotenv.config();

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Creating irregular verbs tables...');

  // Main irregular verbs table
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS irregular_verbs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      infinitive VARCHAR(100) NOT NULL,
      past_simple VARCHAR(100) NOT NULL,
      past_participle VARCHAR(100) NOT NULL,
      group_number INTEGER CHECK (group_number BETWEEN 1 AND 6),
      frequency VARCHAR(20) CHECK (frequency IN ('must_know', 'high', 'medium', 'low')),
      difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
      mnemonic_tip TEXT,
      related_verbs TEXT[], -- Array of related verb infinitives
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(infinitive)
    );
  `);

  // Verb examples table
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS verb_examples (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      verb_id UUID REFERENCES irregular_verbs(id) ON DELETE CASCADE,
      form_type VARCHAR(20) NOT NULL CHECK (form_type IN ('base', 'past', 'participle')),
      sentence_en TEXT NOT NULL,
      sentence_ru TEXT NOT NULL,
      context VARCHAR(100), -- 'Present Simple', 'Past Perfect', etc.
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Verb learning progress table
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS verb_learning_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      verb_id UUID REFERENCES irregular_verbs(id) ON DELETE CASCADE,
      next_review_date DATE NOT NULL,
      correct_count INTEGER DEFAULT 0,
      incorrect_count INTEGER DEFAULT 0,
      last_reviewed_at TIMESTAMP,
      mastered BOOLEAN DEFAULT false,
      ease_factor DECIMAL(4,2) DEFAULT 2.5, -- SM-2 ease factor
      interval_days INTEGER DEFAULT 1, -- SM-2 interval
      repetitions INTEGER DEFAULT 0, -- SM-2 repetitions
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, verb_id)
    );
  `);

  // Verb practice sessions table
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS verb_practice_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_date DATE DEFAULT CURRENT_DATE,
      verbs_practiced INTEGER DEFAULT 0,
      accuracy DECIMAL(3,2), -- 0.00 to 1.00
      duration_minutes INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Verb review history table (similar to review_history for vocabulary)
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS verb_review_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      verb_id UUID REFERENCES irregular_verbs(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      reviewed_at TIMESTAMP DEFAULT NOW(),
      was_correct BOOLEAN NOT NULL,
      response_time_seconds INTEGER,
      practice_mode VARCHAR(50), -- 'form-to-meaning', 'sentence-to-form', 'ai-dialog'
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Indexes for performance
  await hasura.sql(`
    CREATE INDEX IF NOT EXISTS idx_irregular_verbs_group ON irregular_verbs(group_number);
    CREATE INDEX IF NOT EXISTS idx_irregular_verbs_frequency ON irregular_verbs(frequency);
    CREATE INDEX IF NOT EXISTS idx_verb_examples_verb_id ON verb_examples(verb_id);
    CREATE INDEX IF NOT EXISTS idx_verb_learning_progress_user ON verb_learning_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_verb_learning_progress_review ON verb_learning_progress(user_id, next_review_date);
    CREATE INDEX IF NOT EXISTS idx_verb_practice_sessions_user ON verb_practice_sessions(user_id, session_date);
    CREATE INDEX IF NOT EXISTS idx_verb_review_history_user ON verb_review_history(user_id, reviewed_at);
  `);

  console.log('✅ Created irregular verbs tables');

  // Track tables in Hasura
  console.log('🔄 Tracking tables in Hasura...');
  const tablesToTrack = [
    'irregular_verbs',
    'verb_examples',
    'verb_learning_progress',
    'verb_practice_sessions',
    'verb_review_history',
  ];

  for (const table of tablesToTrack) {
    try {
      await hasura.defineTable({ schema: 'public', table });
      console.log(`✅ Tracked table: ${table}`);
    } catch (error: any) {
      if (error?.message?.includes('already exists')) {
        console.log(`⚠️  Table ${table} already tracked`);
      } else {
        console.error(`❌ Error tracking table ${table}:`, error);
      }
    }
  }

  console.log('✅ Irregular verbs migration completed successfully');
}
up();
