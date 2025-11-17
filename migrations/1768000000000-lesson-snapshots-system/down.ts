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
    // Удаляем триггеры
    await hasura.sql('DROP TRIGGER IF EXISTS update_shu_ha_ri_progress_updated_at ON shu_ha_ri_progress;');
    await hasura.sql('DROP TRIGGER IF EXISTS update_active_recall_updated_at ON active_recall_sessions;');
    await hasura.sql('DROP TRIGGER IF EXISTS update_kumon_progress_updated_at ON kumon_progress;');

    // Удаляем индексы
    await hasura.sql('DROP INDEX IF EXISTS idx_ai_sessions_type;');
    await hasura.sql('DROP INDEX IF EXISTS idx_vocabulary_extractions_snapshot;');
    await hasura.sql('DROP INDEX IF EXISTS idx_shu_ha_ri_tests_user_week;');
    await hasura.sql('DROP INDEX IF EXISTS idx_shu_ha_ri_progress_user_skill;');
    await hasura.sql('DROP INDEX IF EXISTS idx_active_recall_item;');
    await hasura.sql('DROP INDEX IF EXISTS idx_active_recall_next_review;');
    await hasura.sql('DROP INDEX IF EXISTS idx_kumon_progress_session;');
    await hasura.sql('DROP INDEX IF EXISTS idx_kumon_progress_user_skill;');
    await hasura.sql('DROP INDEX IF EXISTS idx_lesson_snapshots_session;');
    await hasura.sql('DROP INDEX IF EXISTS idx_lesson_snapshots_user_date;');
    await hasura.sql('DROP INDEX IF EXISTS idx_lesson_snapshots_latest;');

    // Удаляем таблицы в обратном порядке зависимостей
    await hasura.sql('DROP TABLE IF EXISTS lesson_vocabulary_extractions CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS shu_ha_ri_tests CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS shu_ha_ri_progress CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS active_recall_sessions CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS kumon_progress CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS lesson_snapshots CASCADE;');

    // Удаляем колонки из ai_sessions
    await hasura.sql('ALTER TABLE ai_sessions DROP COLUMN IF EXISTS tasks_total;');
    await hasura.sql('ALTER TABLE ai_sessions DROP COLUMN IF EXISTS tasks_completed;');
    await hasura.sql('ALTER TABLE ai_sessions DROP COLUMN IF EXISTS section_type;');
    await hasura.sql('ALTER TABLE ai_sessions DROP COLUMN IF EXISTS session_type;');

    await hasura.sql('COMMIT');
    console.log('✅ Lesson snapshots system rollback completed successfully');
  } catch (error) {
    await hasura.sql('ROLLBACK');
    console.error('❌ Lesson snapshots system rollback failed:', error);
    throw error;
  }
}

