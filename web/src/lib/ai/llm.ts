/**
 * LLM-хелперы поверх OpenRouter (прямой fetch, без hasyx).
 * Сохраняет API прежнего lib/ai/llm.ts: getAI (default), getProvider,
 * generateJSON, parseJSONResponse.
 */
import { jsonrepair } from 'jsonrepair'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ProviderOptions {
  token: string
  model: string
  max_tokens?: number
}

export class OpenRouterProvider {
  private readonly opts: ProviderOptions

  constructor(opts: ProviderOptions) {
    this.opts = opts
  }

  /** Возвращает { content } — совместимо с прежним provider.query(messages) */
  async query(messages: AIMessage | AIMessage[]): Promise<{ content: string }> {
    const list = Array.isArray(messages) ? messages : [messages]
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.opts.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages: list,
        ...(this.opts.max_tokens ? { max_tokens: this.opts.max_tokens } : {}),
      }),
    })
    if (!res.ok) {
      throw new Error(`OpenRouter HTTP ${res.status}: ${await res.text()}`)
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
      error?: { message?: string }
    }
    if (json.error) throw new Error(`OpenRouter error: ${json.error.message}`)
    const content = json.choices?.[0]?.message?.content
    if (!content) throw new Error('OpenRouter вернул пустой ответ')
    return { content }
  }
}

/** Совместимо с прежним AI из hasyx: ai.query({role, content}) → string */
class AI {
  private readonly provider: OpenRouterProvider
  private readonly systemPrompt?: string

  constructor(opts: { provider: OpenRouterProvider; systemPrompt?: string }) {
    this.provider = opts.provider
    this.systemPrompt = opts.systemPrompt
  }

  async query(message: AIMessage | AIMessage[]): Promise<string> {
    const list = Array.isArray(message) ? message : [message]
    const messages: AIMessage[] = this.systemPrompt
      ? [{ role: 'system', content: this.systemPrompt }, ...list]
      : list
    const { content } = await this.provider.query(messages)
    return content
  }
}

const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet'

let providerInstance: OpenRouterProvider | null = null
let aiInstance: AI | null = null

export function getProvider(): OpenRouterProvider {
  if (!providerInstance) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables')
    }
    providerInstance = new OpenRouterProvider({
      token: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    })
  }
  return providerInstance
}

function getAI(): AI {
  if (!aiInstance) {
    aiInstance = new AI({ provider: getProvider() })
  }
  return aiInstance
}

/** Достаёт JSON из текстового ответа модели (markdown-обёртки, починка через jsonrepair) */
export function parseJSONResponse<T>(text: string): T {
  const cleanedText = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim()

  const tryParse = (value: string) => JSON.parse(value)

  try {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) return tryParse(jsonMatch[0])
    return tryParse(cleanedText)
  } catch {
    try {
      const repaired = jsonrepair(cleanedText)
      return tryParse(repaired)
    } catch (repairError) {
      console.error('[AI] Failed to parse JSON response')
      console.error('[AI] Raw response text (first 500 chars):', text.substring(0, 500))
      throw new Error(
        `Invalid JSON response from AI: ${
          repairError instanceof Error ? repairError.message : String(repairError)
        }`,
      )
    }
  }
}

interface GenerateJsonOptions {
  maxTokens?: number
  systemPrompt?: string
}

/** Генерация JSON-объекта по промпту (совместимо с прежним generateJSON) */
export async function generateJSON<T>(
  prompt: string,
  options: GenerateJsonOptions = {},
): Promise<T> {
  let ai: AI
  if (options.systemPrompt || options.maxTokens) {
    const provider = new OpenRouterProvider({
      token: process.env.OPENROUTER_API_KEY as string,
      model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
      ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
    })
    ai = new AI({ provider, systemPrompt: options.systemPrompt })
  } else {
    ai = getAI()
  }

  const response = await ai.query({ role: 'user', content: prompt })
  if (!response) {
    console.error('[AI] Empty response received for prompt:', prompt.substring(0, 500) + '...')
    throw new Error('AI returned an empty response')
  }
  return parseJSONResponse<T>(response)
}

export default getAI
