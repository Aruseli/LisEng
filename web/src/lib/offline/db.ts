import Dexie, { type Table } from 'dexie'

/**
 * Локальная офлайн-БД LisEng (IndexedDB через Dexie).
 *
 * Скоуп Этапа 3 (roadmap): KV-хранилище для персистентности кэша TanStack Query
 * + очередь офлайн-мутаций. Зеркальные таблицы (vocabularyCards, srsStates,
 * reviewHistory) из docs/recomendation.md добавятся отдельным offline-first
 * этапом через version(2).
 *
 * iOS: Background Sync не поддерживается — очередь флашится на
 * online / visibilitychange / старте приложения.
 */

export interface KvRecord {
  key: string
  value: unknown
}

export type OfflineMutationType = 'vocabulary_review' | 'verb_practice'

export interface OfflineMutation {
  id: string
  type: OfflineMutationType
  payload: Record<string, unknown>
  createdAt: number
}

class LisEngOfflineDB extends Dexie {
  kv!: Table<KvRecord, string>
  mutationQueue!: Table<OfflineMutation, string>

  constructor() {
    super('LisEngOfflineDB')
    this.version(1).stores({
      kv: 'key',
      mutationQueue: 'id, createdAt, type',
    })
  }
}

let instance: LisEngOfflineDB | null = null

/** Ленивый синглтон — Dexie нельзя создавать при SSR (нет indexedDB). */
export function getOfflineDb(): LisEngOfflineDB {
  if (!instance) {
    instance = new LisEngOfflineDB()
  }
  return instance
}
