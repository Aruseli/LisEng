/**
 * LLM-хелперы поверх OpenRouter (прямой fetch, без hasyx).
 * Таймауты + retry с backoff на сетевые ошибки и 429/5xx.
 * Fallback-цепочка для роли vocab/budget: OpenRouter → Groq chat.
 */
import { jsonrepair } from 'jsonrepair'

import {
  type LlmTask,
  getGroqChatModel,
  getGroqToken,
  getModelForTask,
  getOpenRouterToken,
  openRouterHeaders,
} from './models'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/** Определение инструмента в формате OpenAI function-calling. */
export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

/** Вызов инструмента, запрошенный моделью. */
export interface ToolCall {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

/** Сообщение в агентном цикле (может нести tool_calls или ответ tool). */
export interface AgentMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: ToolCall[]
  tool_call_id?: string
}

interface ProviderOptions {
  token: string
  model: string
  max_tokens?: number
}

const REQUEST_TIMEOUT_MS = 30_000
const MAX_ATTEMPTS = 3

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * fetch с таймаутом (30с) и retry с экспоненциальным backoff
 * (500мс, 1500мс) на сетевых ошибках, 429 и 5xx.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  label: string,
): Promise<Response> {
  let lastError: unknown
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      const retryable = res.status === 429 || res.status >= 500
      if (retryable && attempt < MAX_ATTEMPTS - 1) {
        console.warn(`[AI] ${label} HTTP ${res.status}, retry ${attempt + 1}/${MAX_ATTEMPTS - 1}`)
        await sleep(500 * 2 ** attempt + Math.random() * 200)
        continue
      }
      return res
    } catch (error) {
      lastError = error
      if (attempt < MAX_ATTEMPTS - 1) {
        console.warn(`[AI] ${label} network error, retry ${attempt + 1}/${MAX_ATTEMPTS - 1}:`, error)
        await sleep(500 * 2 ** attempt + Math.random() * 200)
        continue
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

export class OpenRouterProvider {
  protected readonly opts: ProviderOptions

  constructor(opts: ProviderOptions) {
    this.opts = opts
  }

  protected get url() {
    return 'https://openrouter.ai/api/v1/chat/completions'
  }

  protected headers(): Record<string, string> {
    return openRouterHeaders(this.opts.token)
  }

  protected get label() {
    return 'OpenRouter'
  }

  private buildBody(messages: AIMessage[], stream: boolean) {
    return JSON.stringify({
      model: this.opts.model,
      messages,
      ...(this.opts.max_tokens ? { max_tokens: this.opts.max_tokens } : {}),
      ...(stream ? { stream: true } : {}),
    })
  }

  /**
   * Запрос с function-calling: модель может вернуть tool_calls вместо content.
   * Используется агентным циклом (runAgentWithTools).
   */
  async queryWithTools(
    messages: AgentMessage[],
    tools: ToolDefinition[],
  ): Promise<{ content: string | null; toolCalls: ToolCall[] }> {
    const body = JSON.parse(this.buildBody(messages as AIMessage[], false)) as Record<
      string,
      unknown
    >
    body.tools = tools
    const res = await fetchWithRetry(
      this.url,
      { method: 'POST', headers: this.headers(), body: JSON.stringify(body) },
      this.label,
    )
    if (!res.ok) {
      throw new Error(`${this.label} HTTP ${res.status}: ${await res.text()}`)
    }
    const json = (await res.json()) as {
      choices?: Array<{
        message?: { content?: string | null; tool_calls?: ToolCall[] }
      }>
      error?: { message?: string }
    }
    if (json.error) throw new Error(`${this.label} error: ${json.error.message}`)
    const message = json.choices?.[0]?.message
    if (!message) throw new Error(`${this.label} вернул пустой ответ`)
    return {
      content: message.content ?? null,
      toolCalls: message.tool_calls ?? [],
    }
  }

  async query(messages: AIMessage | AIMessage[]): Promise<{ content: string }> {
    const list = Array.isArray(messages) ? messages : [messages]
    const res = await fetchWithRetry(this.url, {
      method: 'POST',
      headers: this.headers(),
      body: this.buildBody(list, false),
    }, this.label)
    if (!res.ok) {
      throw new Error(`${this.label} HTTP ${res.status}: ${await res.text()}`)
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
      error?: { message?: string }
    }
    if (json.error) throw new Error(`${this.label} error: ${json.error.message}`)
    const content = json.choices?.[0]?.message?.content
    if (!content) throw new Error(`${this.label} вернул пустой ответ`)
    return { content }
  }

  /**
   * Стриминг: возвращает ReadableStream текстовых дельт (OpenAI-compatible SSE).
   * Retry покрывает только установление соединения — обрыв посреди стрима
   * не перезапрашивается (частичный ответ уже ушёл клиенту).
   */
  async streamQuery(messages: AIMessage[]): Promise<ReadableStream<Uint8Array>> {
    const res = await fetchWithRetry(this.url, {
      method: 'POST',
      headers: this.headers(),
      body: this.buildBody(messages, true),
    }, this.label)
    if (!res.ok) {
      throw new Error(`${this.label} HTTP ${res.status}: ${await res.text()}`)
    }
    if (!res.body) throw new Error(`${this.label} не вернул поток`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    const label = this.label

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = ''
        try {
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const data = trimmed.slice(5).trim()
              if (!data || data === '[DONE]') continue
              try {
                const json = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>
                }
                const delta = json.choices?.[0]?.delta?.content
                if (delta) controller.enqueue(encoder.encode(delta))
              } catch {
                // неполный JSON-чанк — пропускаем
              }
            }
          }
          controller.close()
        } catch (error) {
          console.error(`[AI] ${label} stream оборвался:`, error)
          controller.error(error)
        }
      },
      cancel() {
        void reader.cancel()
      },
    })
  }
}

/**
 * Groq chat (OpenAI-compatible API) — fallback для роли vocab/budget.
 * GROQ_API_KEY уже есть в окружении (используется для Whisper).
 */
export class GroqChatProvider extends OpenRouterProvider {
  constructor(opts: Omit<ProviderOptions, 'model'> & { model?: string }) {
    super({ ...opts, model: opts.model ?? getGroqChatModel() })
  }

  protected override get url() {
    return 'https://api.groq.com/openai/v1/chat/completions'
  }

  protected override headers(): Record<string, string> {
    return {
      authorization: `Bearer ${this.opts.token}`,
      'content-type': 'application/json',
    }
  }

  protected override get label() {
    return 'Groq'
  }
}

/** Роли, для которых разрешён fallback на Groq (дешёвые/объёмные задачи). */
const FALLBACK_TASKS: ReadonlySet<LlmTask> = new Set(['vocab'])

/**
 * Запрос с fallback-цепочкой OpenRouter → Groq для роли vocab/budget.
 * Для остальных ролей ошибка OpenRouter пробрасывается как есть.
 */
export async function queryWithFallback(
  messages: AIMessage[],
  opts: { task: LlmTask; maxTokens?: number },
): Promise<{ content: string }> {
  const provider = new OpenRouterProvider({
    token: getOpenRouterToken(),
    model: getModelForTask(opts.task),
    ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
  })
  try {
    return await provider.query(messages)
  } catch (error) {
    if (!FALLBACK_TASKS.has(opts.task) || !process.env.GROQ_API_KEY) throw error
    console.warn(`[AI] OpenRouter недоступен для ${opts.task}, fallback на Groq:`, error)
    const fallback = new GroqChatProvider({
      token: getGroqToken(),
      ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
    })
    return fallback.query(messages)
  }
}

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

// Кэш per-task: раньше один синглтон «залипал» на модели первого вызова
// и игнорировал task всех последующих.
const providerInstances = new Map<LlmTask, OpenRouterProvider>()
let aiInstance: AI | null = null

export function getProvider(task: LlmTask = 'lesson'): OpenRouterProvider {
  let instance = providerInstances.get(task)
  if (!instance) {
    instance = new OpenRouterProvider({
      token: getOpenRouterToken(),
      model: getModelForTask(task),
    })
    providerInstances.set(task, instance)
  }
  return instance
}

function getAI(): AI {
  if (!aiInstance) {
    aiInstance = new AI({ provider: getProvider() })
  }
  return aiInstance
}

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
  task?: LlmTask
}

export async function generateJSON<T>(
  prompt: string,
  options: GenerateJsonOptions = {},
): Promise<T> {
  const task = options.task ?? 'lesson'
  const messages: AIMessage[] = options.systemPrompt
    ? [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: prompt },
      ]
    : [{ role: 'user', content: prompt }]

  // queryWithFallback: для vocab/budget при недоступности OpenRouter уходим в Groq
  const { content: response } = await queryWithFallback(messages, {
    task,
    maxTokens: options.maxTokens,
  })
  if (!response) {
    console.error('[AI] Empty response received for prompt:', prompt.substring(0, 500) + '...')
    throw new Error('AI returned an empty response')
  }
  return parseJSONResponse<T>(response)
}

export default getAI
