import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Fixing users table timestamps (TIMESTAMP → bigint)...');

  // Проверяем текущий тип колонок и конвертируем только если они timestamp
  await hasura.sql(`
    DO $$
    DECLARE
      created_at_type text;
      updated_at_type text;
    BEGIN
      -- Получаем типы колонок
      SELECT data_type INTO created_at_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'created_at';
      
      SELECT data_type INTO updated_at_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'updated_at';
      
      -- Конвертируем created_at только если это timestamp/timestamptz
      IF created_at_type IN ('timestamp without time zone', 'timestamp with time zone', 'timestamp') THEN
        -- Сначала удаляем DEFAULT
        ALTER TABLE users ALTER COLUMN created_at DROP DEFAULT;
        -- Потом меняем тип
        ALTER TABLE users
          ALTER COLUMN created_at TYPE bigint 
            USING EXTRACT(EPOCH FROM created_at)::bigint * 1000;
        -- Затем устанавливаем новый DEFAULT
        ALTER TABLE users
          ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::bigint;
      END IF;
      
      -- Конвертируем updated_at только если это timestamp/timestamptz
      IF updated_at_type IN ('timestamp without time zone', 'timestamp with time zone', 'timestamp') THEN
        -- Сначала удаляем DEFAULT
        ALTER TABLE users ALTER COLUMN updated_at DROP DEFAULT;
        -- Потом меняем тип
        ALTER TABLE users
          ALTER COLUMN updated_at TYPE bigint 
            USING EXTRACT(EPOCH FROM updated_at)::bigint * 1000;
        -- Затем устанавливаем новый DEFAULT
        ALTER TABLE users
          ALTER COLUMN updated_at SET DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::bigint;
      END IF;
    END $$;
  `);

  console.log('✅ Converted users.created_at and users.updated_at to bigint');

  // Удаляем старый триггер, который использует update_updated_at_column() с NOW()
  console.log('🗑️  Removing old trigger update_users_updated_at...');
  await hasura.sql(`
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  `);

  // Обновляем триггер для updated_at, чтобы он работал с bigint
  // defineUpdatedTrigger автоматически определит тип колонки и создаст правильный триггер
  console.log('🔧 Creating new trigger for users.updated_at with bigint support...');
  await hasura.defineUpdatedTrigger({ 
    schema: 'public', 
    table: 'users', 
    column: 'updated_at',
    replace: true 
  });
  
  console.log('✅ Trigger updated successfully');
}

up();