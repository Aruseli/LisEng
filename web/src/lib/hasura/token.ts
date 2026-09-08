/**
 * Хранилище Hasura JWT на клиенте.
 * На этапе 2 (auth) сюда будет записываться токен после логина.
 */
let currentToken: string | null = null

export function setHasuraToken(token: string | null) {
  currentToken = token
}

export function getHasuraToken(): string | null {
  return currentToken
}
