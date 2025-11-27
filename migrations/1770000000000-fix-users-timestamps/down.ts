import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  // Откатываем изменения: конвертируем bigint обратно в timestamp
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
      
      -- Сначала удаляем значения по умолчанию, чтобы избежать ошибки при изменении типа
      IF created_at_type = 'bigint' THEN
        ALTER TABLE users ALTER COLUMN created_at DROP DEFAULT;
      END IF;
      
      IF updated_at_type = 'bigint' THEN
        ALTER TABLE users ALTER COLUMN updated_at DROP DEFAULT;
      END IF;
      
      -- Конвертируем created_at обратно в timestamp только если это bigint
      IF created_at_type = 'bigint' THEN
        ALTER TABLE users
          ALTER COLUMN created_at TYPE timestamp without time zone
            USING TO_TIMESTAMP(created_at / 1000.0);
      END IF;
      
      -- Конвертируем updated_at обратно в timestamp только если это bigint
      IF updated_at_type = 'bigint' THEN
        ALTER TABLE users
          ALTER COLUMN updated_at TYPE timestamp without time zone
            USING TO_TIMESTAMP(updated_at / 1000.0);
      END IF;
      
      -- Восстанавливаем значения по умолчанию для timestamp
      IF created_at_type = 'bigint' THEN
        ALTER TABLE users
          ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
      END IF;
      
      IF updated_at_type = 'bigint' THEN
        ALTER TABLE users
          ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
      END IF;
    END $$;
  `);

  // Восстанавливаем триггер для updated_at, чтобы он работал с TIMESTAMP
  // defineUpdatedTrigger автоматически определит тип колонки и создаст правильный триггер
  await hasura.defineUpdatedTrigger({ 
    schema: 'public', 
    table: 'users', 
    column: 'updated_at',
    replace: true 
  });
}

down();

