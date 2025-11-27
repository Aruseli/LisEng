import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

/**
 * Миграция для объединения дубликатов vocabulary_cards
 * 
 * Логика:
 * 1. Находит все дубликаты по нормализованному слову (LOWER(TRIM(word))) для каждого пользователя
 * 2. Для каждой группы дубликатов выбирает самую старую карточку как основную
 * 3. Объединяет все example_sentence через разделитель " | "
 * 4. Обновляет все связанные записи (active_recall_sessions, review_history) на ID основной карточки
 * 5. Удаляет дубликаты
 */
export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql('BEGIN');

  try {
    console.log('📝 Starting vocabulary cards deduplication...');

    // Шаг 1: Создаем временную таблицу для группировки дубликатов
    await hasura.sql(`
      CREATE TEMP TABLE IF NOT EXISTS duplicate_groups AS
      SELECT 
        user_id,
        LOWER(TRIM(word)) AS normalized_word,
        MIN(created_at) AS oldest_created_at,
        MIN(added_date) AS oldest_added_date
      FROM vocabulary_cards
      GROUP BY user_id, LOWER(TRIM(word))
      HAVING COUNT(*) > 1;
    `);

    console.log('✅ Created duplicate groups table');

    // Шаг 2: Находим основную карточку для каждой группы (самая старая)
    await hasura.sql(`
      CREATE TEMP TABLE IF NOT EXISTS primary_cards AS
      SELECT DISTINCT ON (dg.user_id, dg.normalized_word)
        vc.id AS primary_id,
        dg.user_id,
        dg.normalized_word
      FROM duplicate_groups dg
      INNER JOIN vocabulary_cards vc 
        ON vc.user_id = dg.user_id 
        AND LOWER(TRIM(vc.word)) = dg.normalized_word
      ORDER BY 
        dg.user_id, 
        dg.normalized_word,
        COALESCE(vc.added_date, vc.created_at::date) ASC,
        vc.created_at ASC
      LIMIT 1;
    `);

    console.log('✅ Identified primary cards');

    // Шаг 3: Объединяем example_sentence для всех дубликатов в основной карточке
    await hasura.sql(`
      UPDATE vocabulary_cards vc
      SET example_sentence = (
        SELECT 
          STRING_AGG(
            DISTINCT COALESCE(example_sentence, ''),
            ' | '
            ORDER BY COALESCE(example_sentence, '')
          )
        FROM vocabulary_cards vc2
        WHERE vc2.user_id = vc.user_id
          AND LOWER(TRIM(vc2.word)) = LOWER(TRIM(vc.word))
          AND COALESCE(vc2.example_sentence, '') != ''
      )
      WHERE EXISTS (
        SELECT 1 
        FROM primary_cards pc
        WHERE pc.primary_id = vc.id
      )
      AND (
        SELECT COUNT(*)
        FROM vocabulary_cards vc3
        WHERE vc3.user_id = vc.user_id
          AND LOWER(TRIM(vc3.word)) = LOWER(TRIM(vc.word))
      ) > 1;
    `);

    console.log('✅ Merged example sentences');

    // Шаг 4: Обновляем active_recall_sessions - перенаправляем на основную карточку
    await hasura.sql(`
      UPDATE active_recall_sessions ars
      SET recall_item_id = pc.primary_id
      FROM primary_cards pc, vocabulary_cards vc
      WHERE vc.id = ars.recall_item_id
        AND ars.recall_item_type = 'vocabulary_card'
        AND vc.user_id = pc.user_id
        AND LOWER(TRIM(vc.word)) = pc.normalized_word
        AND ars.recall_item_id != pc.primary_id;
    `);

    console.log('✅ Updated active_recall_sessions references');

    // Шаг 5: Обновляем review_history - перенаправляем на основную карточку
    await hasura.sql(`
      UPDATE review_history rh
      SET card_id = pc.primary_id
      FROM primary_cards pc, vocabulary_cards vc
      WHERE vc.id = rh.card_id
        AND vc.user_id = pc.user_id
        AND LOWER(TRIM(vc.word)) = pc.normalized_word
        AND rh.card_id != pc.primary_id;
    `);

    console.log('✅ Updated review_history references');

    // Шаг 6: Удаляем дубликаты (оставляем только основные карточки)
    await hasura.sql(`
      DELETE FROM vocabulary_cards vc
      WHERE EXISTS (
        SELECT 1 
        FROM duplicate_groups dg
        WHERE dg.user_id = vc.user_id
          AND LOWER(TRIM(vc.word)) = dg.normalized_word
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM primary_cards pc
        WHERE pc.primary_id = vc.id
      );
    `);

    console.log('✅ Deleted duplicate cards');

    // Шаг 7: Нормализуем все оставшиеся слова (на случай, если они еще не нормализованы)
    await hasura.sql(`
      UPDATE vocabulary_cards
      SET word = LOWER(TRIM(word))
      WHERE word != LOWER(TRIM(word));
    `);

    console.log('✅ Normalized remaining words');

    await hasura.sql('COMMIT');
    console.log('✅ Vocabulary cards deduplication completed successfully');
  } catch (error) {
    await hasura.sql('ROLLBACK');
    console.error('❌ Vocabulary cards deduplication failed:', error);
    throw error;
  }
}

up();

