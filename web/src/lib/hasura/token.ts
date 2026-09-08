/**
 * Хранилище Hasura JWT на клиенте + подписка, чтобы UI ждал Bearer
 * до любых запросов к Hasura.
 */
let currentToken: string | null = null
const listeners = new Set<(token: string | null) => void>()

export function setHasuraToken(token: string | null) {
  currentToken = token
  listeners.forEach((fn) => fn(currentToken))
}

export function getHasuraToken(): string | null {
  return currentToken
}

export function subscribeHasuraToken(fn: (token: string | null) => void) {
  listeners.add(fn)
  fn(currentToken)
  return () => {
    listeners.delete(fn)
  }
}
