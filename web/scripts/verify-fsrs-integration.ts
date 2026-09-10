/**
 * Интеграционная проверка FSRS-миграции (п. Шаг 6 плана):
 * 1. Создаёт тестовую карточку + srs_state через add-word путь (saveState/createNewCard)
 * 2. Прогоняет review через applyReview + updateVocabularyCardReview (как /api/vocabulary/review)
 * 3. Проверяет: srs_state обновлён (reps=1, due в будущем), vocabulary_cards.next_review_date/difficulty НЕ изменились
 * 4. Удаляет тестовые данные (card, srs_state, review_history)
 *
 * Запуск: npx tsx --env-file=.env scripts/verify-fsrs-integration.ts
 */

import { getAdminClient } from '../src/lib/hasura'
import { applyReview, createNewCard, getQualityScore, getState, saveState } from '../src/lib/srs'
import { updateVocabularyCardReview } from '../src/lib/hasura-queries'

const TEST_WORD = '__fsrs_integration_test__'

async function main() {
  const hasyx = getAdminClient()

  // Берём первого пользователя с карточками
  const anyCard = await hasyx.select({
    table: 'vocabulary_cards',
    limit: 1,
    returning: ['user_id'],
  })
  const userId = (Array.isArray(anyCard) ? anyCard[0] : anyCard)?.user_id
  if (!userId) throw new Error('Нет пользователей с карточками')
  console.log(`Пользователь: ${userId}`)

  let cardId: string | null = null
  try {
    // 1. Создание карточки (как add-word)
    const today = new Date().toISOString().split('T')[0]
    const inserted = await hasyx.insert({
      table: 'vocabulary_cards',
      object: {
        user_id: userId,
        word: TEST_WORD,
        translation: 'тест',
        next_review_date: today, // legacy NOT NULL колонка
        difficulty: 'new',
        added_date: today,
      },
      returning: ['id', 'next_review_date', 'difficulty'],
    })
    const card = Array.isArray(inserted) ? inserted[0] : inserted
    cardId = card.id
    const id: string = card.id
    const legacyBefore = { next_review_date: card.next_review_date ?? null, difficulty: card.difficulty }
    console.log(`1. Карточка создана: ${id} (legacy: ${JSON.stringify(legacyBefore)})`)

    await saveState(hasyx, userId, 'vocabulary_card', id, createNewCard(new Date()))
    const initial = await getState(hasyx, userId, 'vocabulary_card', id)
    console.log(`2. srs_state создан: state=${initial?.state}, reps=${initial?.reps}, due=${initial?.due}`)
    if (!initial || initial.state !== 'New' || initial.reps !== 0) throw new Error('Некорректное начальное состояние')

    // 2. Review (как /api/vocabulary/review): счётчики + FSRS
    const quality = getQualityScore(true, 3) // correct, 3s → quality 4 (Good)
    await updateVocabularyCardReview(hasyx, id, userId, true, 3)
    await applyReview(hasyx, userId, 'vocabulary_card', id, quality)

    // 3. Проверки
    const after = await getState(hasyx, userId, 'vocabulary_card', id)
    console.log(`3. После review: state=${after?.state}, reps=${after?.reps}, due=${after?.due}, S=${after?.stability.toFixed(2)}, D=${after?.difficulty.toFixed(2)}`)
    if (!after || after.reps !== 1) throw new Error('reps должен стать 1')
    if (after.due <= today) throw new Error(`due должен быть в будущем, получено ${after.due}`)

    const cardAfter = await hasyx.select({
      table: 'vocabulary_cards',
      pk_columns: { id: id },
      returning: ['next_review_date', 'difficulty', 'correct_count', 'last_reviewed_at'],
    })
    const cardData = Array.isArray(cardAfter) ? cardAfter[0] : cardAfter
    console.log(`4. vocabulary_cards: next_review_date=${cardData.next_review_date ?? 'null'}, difficulty=${cardData.difficulty}, correct_count=${cardData.correct_count}`)
    if (cardData.next_review_date !== today) {
      throw new Error(`next_review_date не должен меняться при review (legacy), было ${today}, стало ${cardData.next_review_date}`)
    }
    if (cardData.difficulty !== 'new') throw new Error(`difficulty не должен меняться (legacy), получено ${cardData.difficulty}`)
    if (cardData.correct_count !== 1) throw new Error('correct_count должен стать 1')
    if (!cardData.last_reviewed_at) throw new Error('last_reviewed_at должен быть записан')

    const history = await hasyx.select({
      table: 'review_history',
      where: { card_id: { _eq: id } },
      returning: ['id', 'was_correct'],
    })
    const historyList = Array.isArray(history) ? history : history ? [history] : []
    console.log(`5. review_history: ${historyList.length} запись(ей)`)
    if (historyList.length !== 1) throw new Error('review_history должен содержать 1 запись')

    console.log('\n✅ Все проверки пройдены')
  } finally {
    // 4. Очистка
    if (cardId) {
      await hasyx.delete({ table: 'review_history', where: { card_id: { _eq: cardId } } })
      await hasyx.delete({
        table: 'srs_state',
        where: { item_id: { _eq: cardId }, item_type: { _eq: 'vocabulary_card' } },
      })
      await hasyx.delete({ table: 'vocabulary_cards', pk_columns: { id: cardId } })
      console.log('Тестовые данные удалены')
    }
  }
}

main().catch((err) => {
  console.error('❌', err)
  process.exit(1)
})
