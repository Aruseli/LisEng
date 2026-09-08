/**
 * Stdio MCP: те же роли, что /api/llm/run. Приложение MCP не использует.
 * npx tsx --env-file=.env scripts/mcp-liseng.ts
 */
import { createInterface } from 'node:readline'

import {
  MCP_PROMPT_TUTOR,
  MCP_TOOLS,
  callMcpTool,
  getTutorPromptText,
} from '../src/lib/ai/mcp-server'

type JsonRpc = {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: Record<string, any>
}

function reply(id: JsonRpc['id'], result: unknown) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: id ?? null, result })}\n`)
}

function replyError(id: JsonRpc['id'], message: string) {
  process.stdout.write(
    `${JSON.stringify({ jsonrpc: '2.0', id: id ?? null, error: { code: -32000, message } })}\n`,
  )
}

async function handle(msg: JsonRpc) {
  const method = msg.method ?? ''
  if (method === 'initialize') {
    reply(msg.id, {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, prompts: {} },
      serverInfo: { name: 'liseng-llm', version: '0.1.0' },
    })
    return
  }
  if (method === 'notifications/initialized' || method === 'ping') {
    if (msg.id != null) reply(msg.id, {})
    return
  }
  if (method === 'tools/list') {
    reply(msg.id, { tools: MCP_TOOLS })
    return
  }
  if (method === 'prompts/list') {
    reply(msg.id, { prompts: [MCP_PROMPT_TUTOR] })
    return
  }
  if (method === 'prompts/get') {
    const name = msg.params?.name
    const level = msg.params?.arguments?.level
    if (name !== 'tutor') {
      replyError(msg.id, `Unknown prompt: ${name}`)
      return
    }
    reply(msg.id, {
      description: MCP_PROMPT_TUTOR.description,
      messages: [{ role: 'user', content: { type: 'text', text: getTutorPromptText(level) } }],
    })
    return
  }
  if (method === 'tools/call') {
    const name = String(msg.params?.name ?? '')
    const args = (msg.params?.arguments ?? {}) as Record<string, unknown>
    try {
      const data = await callMcpTool(name, args)
      reply(msg.id, {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      })
    } catch (error: any) {
      replyError(msg.id, error?.message ?? 'tool failed')
    }
    return
  }

  replyError(msg.id, `Unknown method: ${method}`)
}

const rl = createInterface({ input: process.stdin })
rl.on('line', (line) => {
  if (!line.trim()) return
  try {
    void handle(JSON.parse(line) as JsonRpc)
  } catch {
    replyError(null, 'Invalid JSON-RPC line')
  }
})
