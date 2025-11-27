import { Hasura } from 'hasyx/lib/hasura/hasura';
import dotenv from 'dotenv';

dotenv.config();

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Fixing all timestamp columns to bigint...');

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
    console.log(`🔄 Processing table: ${table.name}`);

    // Проверяем и конвертируем created_at
    try {
      const checkCreatedAt = await hasura.sql(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = '${table.name}' 
          AND column_name = 'created_at';
      `);

      if (checkCreatedAt?.result?.[1]?.[0]) {
        const colType = checkCreatedAt.result[1][0];
        if (colType === 'timestamp without time zone' || colType === 'timestamp with time zone' || colType === 'timestamp') {
          console.log(`  → Converting created_at from ${colType} to bigint`);
          await hasura.sql(`
            ALTER TABLE ${table.name}
              ALTER COLUMN created_at TYPE bigint 
              USING EXTRACT(EPOCH FROM created_at)::bigint * 1000;
          `);
          await hasura.sql(`
            ALTER TABLE ${table.name}
              ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::bigint;
          `);
          console.log(`  ✅ Converted created_at for ${table.name}`);
        } else {
          console.log(`  ⏭️  created_at already ${colType}, skipping`);
        }
      }
    } catch (error: any) {
      console.error(`  ❌ Error processing created_at for ${table.name}:`, error?.message || error);
    }

    // Проверяем и конвертируем updated_at (если есть)
    if (table.hasUpdatedAt) {
      try {
        const checkUpdatedAt = await hasura.sql(`
          SELECT data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = '${table.name}' 
            AND column_name = 'updated_at';
        `);

        if (checkUpdatedAt?.result?.[1]?.[0]) {
          const colType = checkUpdatedAt.result[1][0];
          if (colType === 'timestamp without time zone' || colType === 'timestamp with time zone' || colType === 'timestamp') {
            console.log(`  → Converting updated_at from ${colType} to bigint`);
            await hasura.sql(`
              ALTER TABLE ${table.name}
                ALTER COLUMN updated_at TYPE bigint 
                USING EXTRACT(EPOCH FROM updated_at)::bigint * 1000;
            `);
            await hasura.sql(`
              ALTER TABLE ${table.name}
                ALTER COLUMN updated_at SET DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::bigint;
            `);
            console.log(`  ✅ Converted updated_at for ${table.name}`);
          } else {
            console.log(`  ⏭️  updated_at already ${colType}, skipping`);
          }
        }

        // Обновляем триггер для updated_at
        console.log(`  → Updating trigger for ${table.name}.updated_at`);
        try {
          await hasura.defineUpdatedTrigger({ 
            schema: 'public', 
            table: table.name, 
            column: 'updated_at',
            replace: true 
          });
          console.log(`  ✅ Updated trigger for ${table.name}`);
        } catch (error: any) {
          console.error(`  ❌ Error updating trigger for ${table.name}:`, error?.message || error);
        }
      } catch (error: any) {
        console.error(`  ❌ Error processing updated_at for ${table.name}:`, error?.message || error);
      }
    }
  }

  console.log('✅ All timestamp columns fixed successfully');
}

up();

