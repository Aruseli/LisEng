import type { Hasyx } from '@/lib/hasura/compat'
import { getDueStates } from '@/lib/srs'
import { VerbsService } from '@/lib/verbs/verbs-service'
import type { ProblemArea } from '@/lib/lesson-snapshots/lesson-snapshot-service'

import {
  OpenRouterProvider,
  type AgentMessage,
  type AIMessage,
  type ToolDefinition,
} from './llm'
import { getModelForTask, getOpenRouterToken, type LlmTask } from './models'

/**
 * Tool-use агент (Этап 5 roadmap): LLM сам запрашивает контекст ученика
 * через инструменты, а не получает заранее собранный промпт.
 * Инструменты читают srs_state напрямую — они не зависят от алгоритма SRS.
 */

const MAX_AGENT_ITERATIONS = 4

export const AGENT_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_due_words',
      description:
        'Vocabulary words due for spaced-repetition review today. Returns word/translation pairs. Use to pick words to reinforce in the generated material.',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max words to return (default 10)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_weak_verbs',
      description:
        'Irregular verbs the student struggles with (low FSRS stability/accuracy). Returns infinitive — past simple — past participle. Use to drill them in exercises.',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max verbs to return (default 8)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_pending_errors',
      description:
        "Recurring mistakes from the student's recent lessons (grammar, word choice). Use to target exercises at actual weaknesses.",
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max errors to return (default 8)' },
        },
      },
    },
  },
]

async function executeTool(
  hasyx: Hasyx,
  userId: string,
  name: string,
  args: { limit?: number },
): Promise<unknown> {
  const today = new Date().toISOString().split('T')[0]

  if (name === 'get_due_words') {
    const limit = args.limit ?? 10
    const states = await getDueStates(hasyx, userId, 'vocabulary_card', today)
    const limited = states.slice(0, limit)
    const ids = limited.map((s) => s.item_id)
    if (ids.length === 0) return { words: [] }
    const cards = await hasyx.select({
      table: 'vocabulary_cards',
      where: { id: { _in: ids } },
      returning: ['word', 'translation', 'example_sentence'],
    })
    return {
      words: (Array.isArray(cards) ? cards : []).map((c: any) => ({
        word: c.word,
        translation: c.translation,
        example: c.example_sentence ?? undefined,
      })),
    }
  }

  if (name === 'get_weak_verbs') {
    const limit = args.limit ?? 8
    const verbs = await new VerbsService(hasyx).getWeakVerbs(userId, limit)
    return {
      verbs: verbs.map((v) => ({
        infinitive: v.infinitive,
        past_simple: v.past_simple,
        past_participle: v.past_participle,
        translation: v.meaning_ru ?? undefined,
      })),
    }
  }

  if (name === 'get_pending_errors') {
    const limit = args.limit ?? 8
    const snapshots = await hasyx.select({
      table: 'lesson_snapshots',
      where: { user_id: { _eq: userId } },
      order_by: [{ lesson_date: 'desc' }],
      limit: 5,
      returning: ['problem_areas'],
    })
    const seen = new Set<string>()
    const errors: string[] = []
    for (const snapshot of Array.isArray(snapshots) ? snapshots : []) {
      const areas = (snapshot?.problem_areas as ProblemArea[] | undefined) ?? []
      for (const area of Array.isArray(areas) ? areas : []) {
        if (!area || typeof area !== 'object' || area.type === 'unknown_word') continue
        const key = area.content?.trim().toLowerCase()
        if (!key || seen.has(key)) continue
        seen.add(key)
        errors.push(area.content)
        if (errors.length >= limit) break
      }
      if (errors.length >= limit) break
    }
    return { errors }
  }

  return { error: `Unknown tool: ${name}` }
}

export interface AgentRunOptions {
  userId: string
  /** Системный промпт (инструкции агенту). */
  systemPrompt: string
  /** Пользовательский запрос (задача генерации). */
  prompt: string
  task?: LlmTask
  maxTokens?: number
  maxIterations?: number
}

export interface AgentRunResult {
  /** Финальный текстовый ответ модели (после всех tool-вызовов). */
  content: string
  /** Сколько tool-вызовов было выполнено (для логов/метрик). */
  toolCallCount: number
}

/**
 * Агентный цикл: модель вызывает инструменты, пока не выдаст финальный ответ
 * или не исчерпает лимит итераций. Ошибки инструментов не роняют цикл —
 * модель получает их как результат и продолжает без этих данных.
 */
export async function runAgentWithTools(
  hasyx: Hasyx,
  opts: AgentRunOptions,
): Promise<AgentRunResult> {
  const provider = new OpenRouterProvider({
    token: getOpenRouterToken(),
    model: getModelForTask(opts.task ?? 'lesson'),
    ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
  })

  const messages: AgentMessage[] = [
    { role: 'system', content: opts.systemPrompt },
    { role: 'user', content: opts.prompt },
  ]

  const maxIterations = opts.maxIterations ?? MAX_AGENT_ITERATIONS
  let toolCallCount = 0

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const { content, toolCalls } = await provider.queryWithTools(
      messages,
      AGENT_TOOL_DEFINITIONS,
    )

    if (toolCalls.length === 0) {
      if (!content) throw new Error('Agent returned an empty final response')
      return { content, toolCallCount }
    }

    // Фиксируем ход модели, затем результаты каждого инструмента
    messages.push({ role: 'assistant', content, tool_calls: toolCalls })
    for (const call of toolCalls) {
      toolCallCount++
      let result: unknown
      try {
        const args = call.function.arguments
          ? (JSON.parse(call.function.arguments) as { limit?: number })
          : {}
        result = await executeTool(hasyx, opts.userId, call.function.name, args)
      } catch (error) {
        console.warn(`[AI agent] tool ${call.function.name} failed:`, error)
        result = { error: 'Tool unavailable, proceed without this data' }
      }
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(result),
      })
    }
  }

  // Лимит итераций исчерпан: финальный вызов без инструментов.
  // OpenAI-совместимый API принимает tool-сообщения как есть.
  const { content } = await provider.query(messages as unknown as AIMessage[])
  if (!content) throw new Error('Agent produced no final response')
  return { content, toolCallCount }
}
