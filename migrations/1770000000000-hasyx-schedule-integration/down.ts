import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql('BEGIN');

  try {
    console.log('🔄 Starting Hasyx Schedule integration rollback...');

    // ============================================
    // Удаление таблиц в обратном порядке зависимостей
    // ============================================

    // Сначала events (ссылается на schedule)
    console.log('🗑️  Dropping events table...');
    await hasura.sql(`
      DROP TABLE IF EXISTS public.events;
    `);
    console.log('✅ Dropped events table');

    // Затем schedule
    console.log('🗑️  Dropping schedule table...');
    await hasura.sql(`
      DROP TABLE IF EXISTS public.schedule;
    `);
    console.log('✅ Dropped schedule table');

    await hasura.sql('COMMIT');
    console.log('✅ Hasyx Schedule integration rollback completed successfully');

  } catch (error) {
    await hasura.sql('ROLLBACK').catch(() => {});
    console.error('❌ Hasyx Schedule integration rollback failed:', error);
    throw error;
  }
}

down();
