import { HasuraClient } from './client'
import schema from './schema.json'

export { HasuraClient, HasuraError, type QueryOptions } from './client'
export { Generator, type GenerateOptions, type GenerateResult } from './generator'
export { schema }

let adminClient: HasuraClient | null = null

/**
 * Серверный клиент с админ-секретом (только для server routes / server functions).
 * Ленивый синглтон.
 */
export function getAdminClient(): HasuraClient {
  if (adminClient) return adminClient
  const url = process.env.HASURA_GRAPHQL_URL
  const adminSecret = process.env.HASURA_ADMIN_SECRET
  if (!url || !adminSecret) {
    throw new Error('HASURA_GRAPHQL_URL и HASURA_ADMIN_SECRET должны быть заданы в env')
  }
  adminClient = new HasuraClient({ url, adminSecret }, schema)
  return adminClient
}

/**
 * Клиент от имени пользователя (JWT). Используется на клиенте и в server routes
 * при работе с permissions конкретного пользователя.
 */
export function createUserClient(getToken: () => string | null | Promise<string | null>) {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HASURA_GRAPHQL_URL) ||
    process.env.HASURA_GRAPHQL_URL
  if (!url) throw new Error('VITE_HASURA_GRAPHQL_URL не задан')
  return new HasuraClient({ url, getToken }, schema)
}
