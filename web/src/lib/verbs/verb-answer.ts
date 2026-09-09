export function tokenizeVerbAnswer(value: string): string[] {
  return value
    .trim()
    .toLowerCase()
    .split(/[\s,/]+/)
    .map((part) => part.replace(/[^a-z'-]/g, ''))
    .filter(Boolean)
}

export function expandFormVariants(value: string): string[] {
  return tokenizeVerbAnswer(value)
}

export function answersMatch(userAnswer: string, expectedParts: string[]): boolean {
  const given = tokenizeVerbAnswer(userAnswer)
  if (given.length === 0) return false

  const required = expectedParts.map((part) => expandFormVariants(part)).filter((set) => set.length > 0)
  if (required.length === 0) return false

  const allowed = new Set(required.flat())
  if (!given.every((token) => allowed.has(token))) return false

  return required.every((variants) => given.some((token) => variants.includes(token)))
}

export function expectedSlotsForPrompt(
  formType: 'infinitive' | 'past_simple' | 'past_participle',
  verb: { infinitive: string; past_simple: string; past_participle: string }
): string[] {
  if (formType === 'infinitive') {
    return [verb.past_simple, verb.past_participle]
  }
  return [verb.infinitive]
}
