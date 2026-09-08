/**
 * Связывает сессию better-auth с Hasura-токеном:
 * при активной сессии запрашивает /api/auth/hasura-jwt и кладёт токен в token store,
 * откуда его берёт HasuraClient пользователя. Обновляет токен до истечения TTL.
 */
import { useEffect } from 'react'

import { useSession } from '#/lib/auth-client'
import { setHasuraToken } from './token'

export function useHasuraAuth() {
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!session) {
      setHasuraToken(null)
      return
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const fetchToken = async () => {
      try {
        const res = await fetch('/api/auth/hasura-jwt')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const { token, expiresIn } = (await res.json()) as {
          token: string
          expiresIn: number
        }
        if (cancelled) return
        setHasuraToken(token)
        // Обновляем за 5 минут до истечения
        timer = setTimeout(fetchToken, Math.max((expiresIn - 300) * 1000, 60_000))
      } catch (e) {
        console.error('Не удалось получить Hasura JWT:', e)
        if (!cancelled) timer = setTimeout(fetchToken, 30_000)
      }
    }

    fetchToken()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [session?.user?.id])

  return { session, isPending }
}
