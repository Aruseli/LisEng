/**
 * Upsert полного списка неправильных глаголов.
 * Run with: npx tsx --env-file=.env scripts/seed-irregular-verbs.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { getAdminClient } from '../src/lib/hasura'

interface VerbData {
  infinitive: string
  past_simple: string
  past_participle: string
  group_number: number
  frequency: 'must_know' | 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  mnemonic_tip: string
  related_verbs: string[]
  examples: Array<{
    form_type: 'base' | 'past' | 'participle'
    sentence_en: string
    sentence_ru: string
    context: string
  }>
}

async function findVerbId(hasyx: ReturnType<typeof getAdminClient>, infinitive: string) {
  const existing = await hasyx.select({
    table: 'irregular_verbs',
    where: { infinitive: { _eq: infinitive } },
    returning: ['id'],
  })
  const row = Array.isArray(existing) ? existing[0] : existing
  return row?.id as string | undefined
}

async function ensureExamples(
  hasyx: ReturnType<typeof getAdminClient>,
  verbId: string,
  examples: VerbData['examples'],
) {
  const current = await hasyx.select({
    table: 'verb_examples',
    where: { verb_id: { _eq: verbId } },
    returning: ['id'],
  })
  const list = Array.isArray(current) ? current : current ? [current] : []
  if (list.length > 0) return
  for (const example of examples || []) {
    await hasyx.insert({
      table: 'verb_examples',
      object: {
        verb_id: verbId,
        form_type: example.form_type,
        sentence_en: example.sentence_en,
        sentence_ru: example.sentence_ru,
        context: example.context || null,
      },
    })
  }
}

async function seedVerbs() {
  console.log('📝 Starting irregular verbs seeding...')

  const hasyx = getAdminClient()
  const dataPath = join(process.cwd(), 'data', 'irregular-verbs.json')
  const verbs: VerbData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))
  console.log(`Found ${verbs.length} verbs to seed`)

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const verbData of verbs) {
    try {
      const fields = {
        infinitive: verbData.infinitive,
        past_simple: verbData.past_simple,
        past_participle: verbData.past_participle,
        group_number: verbData.group_number,
        frequency: verbData.frequency,
        difficulty: verbData.difficulty,
        mnemonic_tip: verbData.mnemonic_tip || null,
        related_verbs: verbData.related_verbs || null,
      }

      let verbId = await findVerbId(hasyx, verbData.infinitive)

      if (verbId) {
        await hasyx.update({
          table: 'irregular_verbs',
          pk_columns: { id: verbId },
          _set: {
            past_simple: fields.past_simple,
            past_participle: fields.past_participle,
            group_number: fields.group_number,
            frequency: fields.frequency,
            difficulty: fields.difficulty,
            mnemonic_tip: fields.mnemonic_tip,
            related_verbs: fields.related_verbs,
          },
        })
        await ensureExamples(hasyx, verbId, verbData.examples)
        updated++
        continue
      }

      try {
        const insertedVerb = await hasyx.insert({
          table: 'irregular_verbs',
          object: fields,
          returning: ['id'],
        })
        verbId = (Array.isArray(insertedVerb) ? insertedVerb[0]?.id : insertedVerb?.id) as string | undefined
      } catch (error: any) {
        const message = String(error?.message ?? '')
        if (!message.toLowerCase().includes('uniqueness') && !message.toLowerCase().includes('unique')) {
          throw error
        }
        verbId = await findVerbId(hasyx, verbData.infinitive)
      }

      if (!verbId) throw new Error('Failed to get verb ID after upsert')
      await ensureExamples(hasyx, verbId, verbData.examples)
      inserted++
      console.log(`✅ Upserted ${verbData.infinitive} (${inserted + updated}/${verbs.length})`)
    } catch (error: any) {
      errors++
      console.error(`❌ Error inserting ${verbData.infinitive}:`, error?.message)
    }
  }

  console.log('\n📊 Seeding summary:')
  console.log(`  ✅ Inserted: ${inserted}`)
  console.log(`  🔄 Updated: ${updated}`)
  console.log(`  ❌ Errors: ${errors}`)
  console.log('✅ Seeding completed!')
}

seedVerbs().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
