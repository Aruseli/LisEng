import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

const schema = 'public';

const userIdFilter = { user_id: { _eq: 'X-Hasura-User-Id' } };

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  // irregular_verbs — доступ на чтение всем авторизованным
  await hasura.definePermission({
    schema,
    table: 'irregular_verbs',
    role: 'user',
    operation: 'select',
    filter: {},
    columns: [
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

  // verb_examples — только чтение
  await hasura.definePermission({
    schema,
    table: 'verb_examples',
    role: 'user',
    operation: 'select',
    filter: {},
    columns: [
      'id',
      'verb_id',
      'form_type',
      'sentence_en',
      'sentence_ru',
      'context',
      'created_at',
    ],
  });

  // verb_learning_progress
  await hasura.definePermission({
    schema,
    table: 'verb_learning_progress',
    role: 'user',
    operation: 'select',
    filter: userIdFilter,
    columns: [
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

  await hasura.definePermission({
    schema,
    table: 'verb_learning_progress',
    role: 'user',
    operation: 'insert',
    check: userIdFilter,
    filter: userIdFilter,
    set: { user_id: 'X-Hasura-User-Id' },
    columns: [
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

  await hasura.definePermission({
    schema,
    table: 'verb_learning_progress',
    role: 'user',
    operation: 'update',
    filter: userIdFilter,
    check: userIdFilter,
    columns: [
      'next_review_date',
      'correct_count',
      'incorrect_count',
      'last_reviewed_at',
      'mastered',
      'ease_factor',
      'interval_days',
      'repetitions',
    ],
  });

  // verb_practice_sessions
  await hasura.definePermission({
    schema,
    table: 'verb_practice_sessions',
    role: 'user',
    operation: 'select',
    filter: userIdFilter,
    columns: [
      'id',
      'user_id',
      'session_date',
      'verbs_practiced',
      'accuracy',
      'duration_minutes',
      'created_at',
    ],
  });

  await hasura.definePermission({
    schema,
    table: 'verb_practice_sessions',
    role: 'user',
    operation: 'insert',
    filter: userIdFilter,
    check: userIdFilter,
    set: { user_id: 'X-Hasura-User-Id' },
    columns: ['session_date', 'verbs_practiced', 'accuracy', 'duration_minutes'],
  });

  // verb_review_history
  await hasura.definePermission({
    schema,
    table: 'verb_review_history',
    role: 'user',
    operation: 'select',
    filter: userIdFilter,
    columns: [
      'id',
      'verb_id',
      'user_id',
      'reviewed_at',
      'was_correct',
      'response_time_seconds',
      'practice_mode',
      'created_at',
    ],
  });

  await hasura.definePermission({
    schema,
    table: 'verb_review_history',
    role: 'user',
    operation: 'insert',
    filter: userIdFilter,
    check: userIdFilter,
    set: { user_id: 'X-Hasura-User-Id' },
    columns: ['verb_id', 'was_correct', 'response_time_seconds', 'practice_mode'],
  });

  console.log('✅ Irregular verbs permissions migration applied');
}

up();


