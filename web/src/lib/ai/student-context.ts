import type { Hasyx } from '@/lib/hasura/compat'
import { getDueStates } from '@/lib/srs'
import { VerbsService } from '@/lib/verbs/verbs-service'
import type { ProblemArea } from '@/lib/lesson-snapshots/lesson-snapshot-service'

/**
 * Профиль ученика для персонализации AI-тьютора (Этап 5 roadmap).
 * Собирается из srs_state (источник истины после FSRS-миграции) и
 * problem_areas последних lesson snapshots. Все источники нефатальны:
 * при ошибке любого из них секция просто будет пустой.
 */

export interface StudentContext {
  /** Слабые неправильные глаголы: "go — went — gone" */
  weakVerbs: string[]
  /** Слова на повторении (due) с переводом */
  dueWords: string[]
  /** Повторяющиеся ошибки из последних уроков */
  topErrors: string[]
}

export async function buildStudentContext(
  hasyx: Hasyx,
  userId: string,
): Promise<StudentContext> {
  const today = new Date().toISOString().split('T')[0]

  const [weakVerbsRaw, dueStates, snapshotsRaw] = await Promise.all([
    new VerbsService(hasyx).getWeakVerbs(userId, 6).catch(() => []),
    getDueStates(hasyx, userId, 'vocabulary_card', today).catch(() => []),
    hasyx
      .select({
        table: 'lesson_snapshots',
        where: { user_id: { _eq: userId } },
        order_by: [{ lesson_date: 'desc' }],
        limit: 5,
        returning: ['problem_areas'],
      })
      .catch(() => []),
  ])

  // Контент due-карточек
  const limitedDue = dueStates.slice(0, 10)
  const cardIds = limitedDue.map((s) => s.item_id)
  const cardsRaw = cardIds.length
    ? await hasyx
        .select({
          table: 'vocabulary_cards',
          where: { id: { _in: cardIds } },
          returning: ['id', 'word', 'translation'],
        })
        .catch(() => [])
    : []
  const cardsById = new Map(
    (Array.isArray(cardsRaw) ? cardsRaw : []).map((c: any) => [c.id, c]),
  )

  const dueWords = limitedDue
    .map((s) => cardsById.get(s.item_id))
    .filter(Boolean)
    .map((c: any) => `${c.word} — ${c.translation}`)

  const weakVerbs = weakVerbsRaw.map(
    (v) => `${v.infinitive} — ${v.past_simple} — ${v.past_participle}`,
  )

  // Топ ошибок: самые свежие problem_areas типа error/struggle, дедуп по content
  const seen = new Set<string>()
  const topErrors: string[] = []
  for (const snapshot of Array.isArray(snapshotsRaw) ? snapshotsRaw : []) {
    const areas = (snapshot?.problem_areas as ProblemArea[] | undefined) ?? []
    for (const area of Array.isArray(areas) ? areas : []) {
      if (!area || typeof area !== 'object' || area.type === 'unknown_word') continue
      const key = area.content?.trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      topErrors.push(area.content)
      if (topErrors.length >= 6) break
    }
    if (topErrors.length >= 6) break
  }

  return { weakVerbs, dueWords, topErrors }
}

/** Текстовая секция профиля для system-промпта тьютора. */
export function formatStudentContext(context: StudentContext): string {
  const lines: string[] = []
  if (context.weakVerbs.length > 0) {
    lines.push(`- Weak irregular verbs to drill: ${context.weakVerbs.join('; ')}`)
  }
  if (context.dueWords.length > 0) {
    lines.push(
      `- Words due for review (weave them into your questions naturally): ${context.dueWords.join('; ')}`,
    )
  }
  if (context.topErrors.length > 0) {
    lines.push(
      `- Recent recurring mistakes to watch for and correct: ${context.topErrors.join('; ')}`,
    )
  }
  if (lines.length === 0) return ''
  return [
    '',
    'Student profile (use it to personalize the practice):',
    ...lines,
  ].join('\n')
}
