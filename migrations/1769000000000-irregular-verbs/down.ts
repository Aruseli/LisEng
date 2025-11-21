import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Dropping irregular verbs tables...');

  // Drop tables in reverse order (respecting foreign keys)
  await hasura.sql('DROP TABLE IF EXISTS verb_review_history CASCADE;');
  await hasura.sql('DROP TABLE IF EXISTS verb_practice_sessions CASCADE;');
  await hasura.sql('DROP TABLE IF EXISTS verb_learning_progress CASCADE;');
  await hasura.sql('DROP TABLE IF EXISTS verb_examples CASCADE;');
  await hasura.sql('DROP TABLE IF EXISTS irregular_verbs CASCADE;');

  console.log('✅ Dropped irregular verbs tables');
}

