import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('📝 Adding instruction_language column to users table...');

  // Добавляем колонку
  await hasura.sql(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS instruction_language VARCHAR(10) DEFAULT 'ru';
  `);

  console.log('✅ Column instruction_language added');

  // Обновляем select права для роли 'user' - добавляем instruction_language
  console.log('🔐 Updating select permissions for users table...');
  await hasura.definePermission({
    schema: 'public',
    table: 'users',
    operation: 'select',
    role: 'user',
    filter: { id: { _eq: 'X-Hasura-User-Id' } }, // Пользователь может читать только свою запись
    columns: [
      'id',
      'name',
      'email',
      'image',
      'created_at',
      'updated_at',
      'current_level',
      'target_level',
      'exam_date',
      'start_date',
      'study_time',
      'study_place',
      'daily_goal_minutes',
      'reminder_enabled',
      'instruction_language', // Новое поле
      'hasura_role',
    ],
  });

  console.log('✅ Select permissions updated');

  // Создаем или обновляем update права для роли 'user' - добавляем instruction_language
  console.log('🔐 Creating/updating update permissions for users table...');
  await hasura.definePermission({
    schema: 'public',
    table: 'users',
    operation: 'update',
    role: 'user',
    filter: { id: { _eq: 'X-Hasura-User-Id' } }, // Пользователь может обновлять только свою запись
    check: { id: { _eq: 'X-Hasura-User-Id' } }, // Дополнительная проверка
    columns: [
      'current_level',
      'target_level',
      'exam_date',
      'start_date',
      'study_time',
      'study_place',
      'daily_goal_minutes',
      'reminder_enabled',
      'instruction_language', // Новое поле - пользователь может менять язык инструкций
    ],
  });

  console.log('✅ Update permissions created/updated');
  console.log('✅ Migration completed successfully');
}

up();

