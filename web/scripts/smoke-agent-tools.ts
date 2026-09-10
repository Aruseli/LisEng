/**
 * Smoke-тест tool-use агента (Этап 5): проверяет, что модель вызывает
 * инструменты get_due_words/get_weak_verbs/get_pending_errors и цикл сходится.
 *
 * Запуск: node_modules/.bin/tsx --env-file=.env scripts/smoke-agent-tools.ts
 */
import { getAdminClient } from '../src/lib/hasura'
import { runAgentWithTools } from '../src/lib/ai/agent-tools'

async function main() {
  const hasyx = getAdminClient()

  // Первый пользователь с карточками
  const anyCard = await hasyx.select({
    table: 'vocabulary_cards',
    limit: 1,
    returning: ['user_id'],
  })
  const userId = (Array.isArray(anyCard) ? anyCard[0] : anyCard)?.user_id
  if (!userId) throw new Error('Нет пользователей с карточками')
  console.log(`Пользователь: ${userId}`)

  const result = await runAgentWithTools(hasyx, {
    userId,
    systemPrompt:
      'You are a study planner. You MUST use the available tools to fetch the student context before answering. Answer in one short paragraph.',
    prompt:
      'Fetch my due words and weak verbs, then suggest one short practice focus for today.',
    task: 'lesson',
    maxTokens: 512,
  })

  console.log(`Tool calls: ${result.toolCallCount}`)
  console.log(`Ответ: ${result.content.slice(0, 400)}`)
  if (result.toolCallCount === 0) {
    console.warn('AGENT_SMOKE_WARN: модель не вызвала ни одного инструмента')
  } else {
    console.log('AGENT_SMOKE_OK')
  }
}

main().catch((error) => {
  console.error('AGENT_SMOKE_FAIL:', error)
  process.exit(1)
})
