/**
 * Диагностика OpenRouter: ключ, каталог моделей, короткий chat.
 * npx tsx --env-file=.env scripts/check-openrouter.ts
 * Секреты в лог не пишет.
 */
import {
  BUDGET_MODEL,
  CATALOG_PREMIUM_MODEL,
  PREFERRED_PREMIUM_MODEL,
  getModelForTask,
  getOpenRouterToken,
  openRouterHeaders,
} from '../src/lib/ai/models'

const BASE = 'https://openrouter.ai/api/v1'

function mask() {
  return { hasKey: true, keyChars: getOpenRouterToken().length }
}

async function getJson(path: string, init?: RequestInit) {
  const token = getOpenRouterToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...openRouterHeaders(token), ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  let body: unknown = text
  try {
    body = JSON.parse(text)
  } catch {
    /* raw */
  }
  return { ok: res.ok, status: res.status, body }
}

async function probeChat(model: string) {
  const result = await getJson('/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      max_tokens: 8,
      messages: [{ role: 'user', content: 'Reply with the word ok' }],
    }),
  })
  const err =
    typeof result.body === 'object' && result.body && 'error' in result.body
      ? (result.body as { error?: { message?: string } }).error?.message
      : undefined
  return { model, status: result.status, ok: result.ok, error: err ?? null }
}

async function main() {
  try {
    getOpenRouterToken()
  } catch {
    console.log(JSON.stringify({ hasKey: false, hint: 'OPENROUTER_API_KEY отсутствует в web/.env' }, null, 2))
    process.exit(1)
  }

  const keyInfo = await getJson('/key')
  const modelsRes = await getJson('/models')
  const ids: string[] = []
  if (modelsRes.ok && typeof modelsRes.body === 'object' && modelsRes.body && 'data' in modelsRes.body) {
    const data = (modelsRes.body as { data?: Array<{ id?: string }> }).data ?? []
    for (const row of data) {
      if (row.id) ids.push(row.id)
    }
  }

  const routedPremium = getModelForTask('lesson')
  const routedBudget = getModelForTask('vocab')
  const wanted = Array.from(new Set([PREFERRED_PREMIUM_MODEL, routedPremium, routedBudget, BUDGET_MODEL]))
  const catalogHits = wanted.map((id) => ({
    id,
    inCatalog: ids.includes(id),
    similar: ids.filter((x) => x.includes(id.split('/')[1] ?? id)).slice(0, 8),
  }))

  const chats = []
  for (const model of [routedPremium, routedBudget]) {
    chats.push(await probeChat(model))
  }

  const keyBody = keyInfo.body as { data?: { limit_remaining?: number; usage?: number } } | undefined

  console.log(
    JSON.stringify(
      {
        ...mask(),
        keyEndpoint: { status: keyInfo.status, ok: keyInfo.ok, remaining: keyBody?.data?.limit_remaining ?? null },
        modelsEndpoint: { status: modelsRes.status, ok: modelsRes.ok, catalogSize: ids.length },
        preferredPremium: PREFERRED_PREMIUM_MODEL,
        catalogPremium: CATALOG_PREMIUM_MODEL,
        routed: { premium: routedPremium, budget: routedBudget },
        catalogHits,
        similarSonnet: ids.filter((x) => x.toLowerCase().includes('sonnet')).slice(0, 12),
        chats,
      },
      null,
      2,
    ),
  )

  if (!keyInfo.ok || chats.some((c) => !c.ok)) process.exit(1)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
