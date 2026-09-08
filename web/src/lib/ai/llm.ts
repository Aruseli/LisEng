/**
 * LLM-хелперы поверх OpenRouter (прямой fetch, без hasyx).
 */
import { jsonrepair } from 'jsonrepair'

import { type LlmTask, getModelForTask, getOpenRouterToken, openRouterHeaders } from './models'

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

  async query(messages: AIMessage | AIMessage[]): Promise<{ content: string }> {
    const list = Array.isArray(messages) ? messages : [messages]
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: openRouterHeaders(this.opts.token),
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

let providerInstance: OpenRouterProvider | null = null
let aiInstance: AI | null = null

export function getProvider(task: LlmTask = 'lesson'): OpenRouterProvider {
  if (!providerInstance) {
    providerInstance = new OpenRouterProvider({
      token: getOpenRouterToken(),
      model: getModelForTask(task),
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
  const provider = new OpenRouterProvider({
    token: getOpenRouterToken(),
    model: getModelForTask(task),
    ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
  })
  const ai = new AI({ provider, systemPrompt: options.systemPrompt })

  const response = await ai.query({ role: 'user', content: prompt })
  if (!response) {
    console.error('[AI] Empty response received for prompt:', prompt.substring(0, 500) + '...')
    throw new Error('AI returned an empty response')
  }
  return parseJSONResponse<T>(response)
}

export default getAI
