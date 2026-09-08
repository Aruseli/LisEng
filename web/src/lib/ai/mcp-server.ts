/**
 * Тонкий MCP над llm-роутером. Приложение сюда не ходит.
 */
import { buildTutorPrompt } from './tutor-prompt'
import { runLlm } from './router'
import { transcribeAudio } from './speech'

export const MCP_PROMPT_TUTOR = {
  name: 'tutor',
  description: 'Strict supportive English tutor prompt with current level',
  arguments: [{ name: 'level', description: 'CEFR level, e.g. A2', required: false }],
}

export const MCP_TOOLS = [
  {
    name: 'run_lesson',
    description: 'Generate a lesson or grammar explanation via the premium model',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        level: { type: 'string' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'run_vocab',
    description: 'Generate vocabulary cards or simple translations via the budget model',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'run_tutor',
    description: 'Tutor dialogue via the premium model and the tutor prompt',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        level: { type: 'string' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'transcribe_audio',
    description: 'Speech-to-text via Groq Whisper (not OpenRouter)',
    inputSchema: {
      type: 'object',
      properties: {
        audioBase64: { type: 'string' },
      },
      required: ['audioBase64'],
    },
  },
] as const

export function getTutorPromptText(level?: string) {
  return buildTutorPrompt(level || 'A2')
}

export async function callMcpTool(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const prompt = typeof args.prompt === 'string' ? args.prompt : ''
  const level = typeof args.level === 'string' ? args.level : undefined

  switch (name) {
    case 'run_lesson':
      return { content: await runLlm({ task: 'lesson', prompt, level }) }
    case 'run_vocab':
      return { content: await runLlm({ task: 'vocab', prompt }) }
    case 'run_tutor':
      return { content: await runLlm({ task: 'tutor', prompt, level }) }
    case 'transcribe_audio': {
      const audioBase64 = typeof args.audioBase64 === 'string' ? args.audioBase64 : ''
      if (!audioBase64) throw new Error('audioBase64 is required')
      const bytes = Uint8Array.from(Buffer.from(audioBase64, 'base64'))
      return transcribeAudio(bytes)
    }
    default:
      throw new Error(`Unknown MCP tool: ${name}`)
  }
}
