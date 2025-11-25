import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

/**
 * Откат миграции объединения дубликатов
 * 
 * Внимание: Эта миграция не может быть полностью откачена,
 * так как дубликаты были удалены. Можно только нормализовать слова обратно,
 * но восстановить удаленные записи невозможно без бэкапа.
 */
export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('⚠️  Warning: This migration cannot be fully rolled back.');
  console.log('⚠️  Duplicate cards were deleted and cannot be restored without a backup.');
  console.log('⚠️  Only word normalization can be reverted, but this is not recommended.');
  
  // Миграция не может быть откачена, так как данные были удалены
  // Можно только вывести предупреждение
  console.log('✅ Rollback skipped (data loss would occur)');
}

