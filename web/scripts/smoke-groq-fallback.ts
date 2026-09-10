import { GroqChatProvider } from '../src/lib/ai/llm'
import { getGroqToken } from '../src/lib/ai/models'

async function main() {
  const provider = new GroqChatProvider({ token: getGroqToken() })
  const { content } = await provider.query({ role: 'user', content: 'Reply with exactly: OK' })
  console.log('GROQ_CHAT_OK:', content.slice(0, 40))
}

main().catch((error) => {
  console.error('GROQ_CHAT_FAIL:', error)
  process.exit(1)
})
