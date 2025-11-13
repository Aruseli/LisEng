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
    // Drop in reverse order (respecting foreign keys)
    await hasura.sql('DROP TRIGGER IF EXISTS update_stage_progress_updated_at ON stage_progress;');
    await hasura.sql('DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;');
    await hasura.sql('DROP TRIGGER IF EXISTS update_users_updated_at ON users;');
    await hasura.sql('DROP FUNCTION IF EXISTS update_updated_at_column();');
    
    // Drop indexes
    await hasura.sql('DROP INDEX IF EXISTS idx_stage_requirements_stage;');
    await hasura.sql('DROP INDEX IF EXISTS idx_stage_tests_user_stage;');
    await hasura.sql('DROP INDEX IF EXISTS idx_stage_progress_user_stage;');
    await hasura.sql('DROP INDEX IF EXISTS idx_ai_sessions_user_date;');
    await hasura.sql('DROP INDEX IF EXISTS idx_progress_metrics_user_date;');
    await hasura.sql('DROP INDEX IF EXISTS idx_error_log_user_review;');
    await hasura.sql('DROP INDEX IF EXISTS idx_vocabulary_next_review;');
    await hasura.sql('DROP INDEX IF EXISTS idx_daily_tasks_user_date;');
    
    // Drop tables in reverse dependency order
    await hasura.sql('DROP TABLE IF EXISTS stage_requirements CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS stage_tests CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS stage_progress CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS achievements CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS streaks CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS progress_metrics CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS ai_sessions CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS error_log CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS review_history CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS vocabulary_cards CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS daily_tasks CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS weekly_structure CASCADE;');
    await hasura.sql('DROP TABLE IF EXISTS study_stages CASCADE;');
    // Note: users table might be managed by hasyx-users migration, so we don't drop it here
    
    await hasura.sql('COMMIT');
    console.log('✅ LisEng schema rollback completed successfully');
  } catch (error) {
    await hasura.sql('ROLLBACK');
    console.error('❌ LisEng schema rollback failed:', error);
    throw error;
  }
}

