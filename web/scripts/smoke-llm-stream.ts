import { OpenRouterProvider } from '../src/lib/ai/llm'
import { getModelForTask, getOpenRouterToken } from '../src/lib/ai/models'

async function main() {
  const provider = new OpenRouterProvider({
    token: getOpenRouterToken(),
    model: getModelForTask('vocab'),
  })
  const stream = await provider.streamQuery([
    { role: 'user', content: 'Count from 1 to 5, separated by spaces.' },
  ])
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let acc = ''
  let chunks = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks++
    acc += decoder.decode(value)
  }
  console.log('STREAM_OK chunks:', chunks, 'text:', JSON.stringify(acc.slice(0, 80)))
}

main().catch((error) => {
  console.error('STREAM_FAIL:', error)
  process.exit(1)
})
