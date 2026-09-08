/**
 * Smoke: список MCP tools/prompts без сети.
 * npx tsx scripts/mcp-smoke.ts
 */
import { MCP_PROMPT_TUTOR, MCP_TOOLS, getTutorPromptText } from '../src/lib/ai/mcp-server'

const tools = MCP_TOOLS.map((t) => t.name)
const prompt = getTutorPromptText('A2')

console.log(
  JSON.stringify(
    {
      tools,
      prompts: [MCP_PROMPT_TUTOR.name],
      tutorPromptHasLevel: prompt.includes('A2'),
    },
    null,
    2,
  ),
)

if (tools.join(',') !== 'run_lesson,run_vocab,run_tutor,transcribe_audio') {
  process.exit(1)
}
