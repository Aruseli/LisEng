import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Rolling back instruction_language migration...');

  // Удаляем колонку
  await hasura.sql(`
    ALTER TABLE users
      DROP COLUMN IF EXISTS instruction_language;
  `);

  console.log('✅ Column instruction_language removed');

  // ВАЖНО: Права нужно будет обновить вручную в Hasura Console,
  // так как мы не знаем точно, какие права были до миграции
  console.log('⚠️  Note: Permissions need to be manually updated in Hasura Console');
  console.log('   Remove instruction_language from select and update permissions for users table');
}

down();

