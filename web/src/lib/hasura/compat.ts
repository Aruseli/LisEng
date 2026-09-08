/**
 * Шим совместимости для перенесённого доменного кода:
 * сервисы принимали параметр типа `Hasyx` — теперь это наш HasuraClient
 * с тем же интерфейсом (select/insert/update/delete/upsert).
 */
export type { HasuraClient as Hasyx } from './client'
export { HasuraClient } from './client'
