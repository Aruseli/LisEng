/**
 * Роли моделей. Каталог OpenRouter (проверка 2026-09) не содержит
 * anthropic/claude-3.5-sonnet — живой id той же линейки Sonnet: anthropic/claude-sonnet-4.
 * OPENROUTER_MODEL_PREMIUM может вернуть 3.5, когда слот снова появится.
 */
export const PREFERRED_PREMIUM_MODEL = 'anthropic/claude-3.5-sonnet'
export const CATALOG_PREMIUM_MODEL = 'anthropic/claude-sonnet-4'
export const BUDGET_MODEL = 'deepseek/deepseek-r1-0528'

export type LlmChatTask = 'lesson' | 'tutor' | 'vocab' | 'score'
export type LlmTask = LlmChatTask | 'speech'

export const SPEECH_MODEL = 'whisper-large-v3'
/** Совместимое имя для скриптов: живой Sonnet из каталога этого ключа. */
export const PREMIUM_MODEL = CATALOG_PREMIUM_MODEL

export function getOpenRouterToken() {
  const token = process.env.OPENROUTER_API_KEY
  if (!token) throw new Error('OPENROUTER_API_KEY is not set in environment variables')
  return token
}

export function getModelForTask(task: LlmTask = 'lesson') {
  if (task === 'speech') {
    throw new Error('speech идёт в Groq Whisper, не в OpenRouter')
  }
  if (process.env.OPENROUTER_MODEL) return process.env.OPENROUTER_MODEL
  if (task === 'vocab') {
    return process.env.OPENROUTER_MODEL_BUDGET || BUDGET_MODEL
  }
  const premium = process.env.OPENROUTER_MODEL_PREMIUM
  // 3.5 — предпочтительный slug, но у текущего ключа нет endpoint. Берём живой Sonnet из каталога.
  if (premium && premium !== PREFERRED_PREMIUM_MODEL) return premium
  return CATALOG_PREMIUM_MODEL
}

export function openRouterHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
    'HTTP-Referer': process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    'X-Title': 'LisEng',
  }
}
