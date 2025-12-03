import { Hasura } from 'hasyx/lib/hasura/hasura';
import dotenv from 'dotenv';

dotenv.config();

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Reverting all bigint columns back to timestamp...');

  // Список таблиц с created_at и/или updated_at
  const tables = [
    { name: 'study_stages', hasUpdatedAt: false },
    { name: 'weekly_structure', hasUpdatedAt: false },
    { name: 'daily_tasks', hasUpdatedAt: false },
    { name: 'vocabulary_cards', hasUpdatedAt: false },
    { name: 'error_log', hasUpdatedAt: false },
    { name: 'progress_metrics', hasUpdatedAt: false },
    { name: 'streaks', hasUpdatedAt: true },
    { name: 'stage_progress', hasUpdatedAt: true },
    { name: 'stage_tests', hasUpdatedAt: false },
    { name: 'stage_requirements', hasUpdatedAt: false },
    { name: 'irregular_verbs', hasUpdatedAt: false },
    { name: 'verb_examples', hasUpdatedAt: false },
    { name: 'verb_learning_progress', hasUpdatedAt: false },
    { name: 'verb_practice_sessions', hasUpdatedAt: false },
    { name: 'verb_review_history', hasUpdatedAt: false },
  ];

  for (const table of tables) {
    console.log(`🔄 Reverting table: ${table.name}`);

    // Откатываем created_at
    try {
      const checkCreatedAt = await hasura.sql(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = '${table.name}' 
          AND column_name = 'created_at';
      `);

      if (checkCreatedAt?.result?.[1]?.[0] === 'bigint') {
        console.log(`  → Reverting created_at from bigint to timestamp`);
        await hasura.sql(`
          ALTER TABLE ${table.name}
            ALTER COLUMN created_at TYPE timestamp without time zone
            USING TO_TIMESTAMP(created_at / 1000.0);
        `);
        await hasura.sql(`
          ALTER TABLE ${table.name}
            ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log(`  ✅ Reverted created_at for ${table.name}`);
      }
    } catch (error: any) {
      console.error(`  ❌ Error reverting created_at for ${table.name}:`, error?.message || error);
    }

    // Откатываем updated_at (если есть)
    if (table.hasUpdatedAt) {
      try {
        const checkUpdatedAt = await hasura.sql(`
          SELECT data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = '${table.name}' 
            AND column_name = 'updated_at';
        `);

        if (checkUpdatedAt?.result?.[1]?.[0] === 'bigint') {
          console.log(`  → Reverting updated_at from bigint to timestamp`);
          await hasura.sql(`
            ALTER TABLE ${table.name}
              ALTER COLUMN updated_at TYPE timestamp without time zone
              USING TO_TIMESTAMP(updated_at / 1000.0);
          `);
          await hasura.sql(`
            ALTER TABLE ${table.name}
              ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
          `);
          console.log(`  ✅ Reverted updated_at for ${table.name}`);
        }

        // Восстанавливаем триггер для TIMESTAMP
        console.log(`  → Restoring trigger for ${table.name}.updated_at`);
        try {
          await hasura.defineUpdatedTrigger({ 
            schema: 'public', 
            table: table.name, 
            column: 'updated_at',
            replace: true 
          });
          console.log(`  ✅ Restored trigger for ${table.name}`);
        } catch (error: any) {
          console.error(`  ❌ Error restoring trigger for ${table.name}:`, error?.message || error);
        }
      } catch (error: any) {
        console.error(`  ❌ Error reverting updated_at for ${table.name}:`, error?.message || error);
      }
    }
  }

  console.log('✅ All columns reverted successfully');
}

down();


