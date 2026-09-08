import { useEffect, useState } from 'react'

import { getHasuraToken, subscribeHasuraToken } from './token'

/** Актуальный Hasura JWT; null, пока сессия не выдала токен. */
export function useHasuraToken() {
  const [token, setToken] = useState<string | null>(() => getHasuraToken())
  useEffect(() => subscribeHasuraToken(setToken), [])
  return token
}

export function useHasuraReady() {
  return !!useHasuraToken()
}
