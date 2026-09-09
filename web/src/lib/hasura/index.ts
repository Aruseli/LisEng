import { HasuraClient } from './client'
import schema from './schema.json'

function processEnv(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  const value = env?.[name]?.trim()
  return value || undefined
}

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
  const url =
    processEnv('HASURA_GRAPHQL_URL') ||
    processEnv('VITE_HASURA_GRAPHQL_URL') ||
    processEnv('NEXT_PUBLIC_HASURA_GRAPHQL_URL') ||
    (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_HASURA_GRAPHQL_URL : undefined)
  const adminSecret = processEnv('HASURA_ADMIN_SECRET')
  if (!url) {
    throw new Error('HASURA_GRAPHQL_URL is not set')
  }
  if (!adminSecret) {
    throw new Error('HASURA_ADMIN_SECRET is not set')
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
    processEnv('HASURA_GRAPHQL_URL') ||
    processEnv('VITE_HASURA_GRAPHQL_URL') ||
    processEnv('NEXT_PUBLIC_HASURA_GRAPHQL_URL')
  if (!url) throw new Error('VITE_HASURA_GRAPHQL_URL не задан')
  return new HasuraClient({ url, getToken }, schema)
}
