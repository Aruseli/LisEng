/**
 * Роли моделей. Премиум для lesson / tutor / score — Claude Sonnet 5.5.
 * Снятые slug игнорируются, даже если они остались в env.
 */
export const CATALOG_PREMIUM_MODEL = 'anthropic/claude-sonnet-5.5'
const RETIRED_PREMIUM_MODELS = new Set([
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-sonnet-4',
])
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

export function getGroqToken() {
  const token = process.env.GROQ_API_KEY
  if (!token) throw new Error('GROQ_API_KEY is not set in environment variables')
  return token
}

/** Chat-модель Groq для fallback-цепочки (OpenRouter → Groq) на роли vocab/budget. */
// llama-3.3 снята с Groq (проверка каталога 2026-09); gpt-oss-120b — сильнейшая
// из доступных open-weight на этом ключе, хорошо держит JSON-формат.
export const GROQ_CHAT_MODEL = 'openai/gpt-oss-120b'

export function getGroqChatModel() {
  return process.env.GROQ_CHAT_MODEL || GROQ_CHAT_MODEL
}

export function getModelForTask(task: LlmTask = 'lesson') {
  if (task === 'speech') {
    throw new Error('speech идёт в Groq Whisper, не в OpenRouter')
  }
  const override = process.env.OPENROUTER_MODEL
  if (override && !RETIRED_PREMIUM_MODELS.has(override)) return override
  if (task === 'vocab') {
    return process.env.OPENROUTER_MODEL_BUDGET || BUDGET_MODEL
  }
  const premium = process.env.OPENROUTER_MODEL_PREMIUM
  if (premium && !RETIRED_PREMIUM_MODELS.has(premium)) return premium
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
