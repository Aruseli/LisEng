import { buildTutorPrompt } from './tutor-prompt'
import type { AIMessage } from './llm'
import { queryWithFallback } from './llm'
import type { LlmTask } from './models'
import { parseJSONResponse } from './llm'

export type LlmRunInput = {
  task: LlmTask
  prompt: string
  systemPrompt?: string
  level?: string
  maxTokens?: number
}

export async function runLlm(input: LlmRunInput): Promise<string> {
  if (input.task === 'speech') {
    throw new Error('speech идёт в Groq Whisper через transcribeAudio, не в OpenRouter')
  }
  const systemPrompt =
    input.task === 'tutor'
      ? input.systemPrompt || buildTutorPrompt(input.level || 'A2')
      : input.systemPrompt

  const messages: AIMessage[] = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: input.prompt })

  // queryWithFallback: для vocab/budget при недоступности OpenRouter уходим в Groq
  const { content } = await queryWithFallback(messages, {
    task: input.task,
    maxTokens: input.maxTokens,
  })
  return content
}

export async function runLlmJson<T>(input: LlmRunInput): Promise<T> {
  const text = await runLlm(input)
  if (!text) throw new Error('AI returned an empty response')
  return parseJSONResponse<T>(text)
}
