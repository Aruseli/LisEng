import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import { signOut } from '#/lib/auth-client'
import { getUserClient } from '#/lib/hasura/hooks'
import { getHasuraToken } from '#/lib/hasura/token'
import { useHasuraAuth } from '#/lib/hasura/useHasuraAuth'

export const Route = createFileRoute('/')({ component: Home })

/** Временный проверочный экран этапа 2 (будет заменён продуктовым UI на этапе 4) */
function Home() {
  const { session, isPending } = useHasuraAuth()
  const [checkResult, setCheckResult] = useState<string | null>(null)

  if (isPending) {
    return <div className="p-8 text-gray-500">Загрузка сессии...</div>
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">LisEng</h1>
        <p className="mt-2 text-gray-600">Вы не авторизованы.</p>
        <Link to="/login" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white">
          Войти
        </Link>
      </div>
    )
  }

  const checkHasura = async () => {
    setCheckResult('Запрашиваю...')
    try {
      const token = getHasuraToken()
      if (!token) {
        setCheckResult('Hasura-токен ещё не получен, попробуйте через секунду')
        return
      }
      // Запрос от имени пользователя (роль user, permissions Hasura)
      const me = await getUserClient().select({
        table: 'users',
        pk_columns: { id: session.user.id },
        returning: ['id', 'name', 'email'],
      })
      setCheckResult(`Ответ Hasura (роль user): ${JSON.stringify(me)}`)
    } catch (e) {
      setCheckResult(`Ошибка: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">LisEng — этап 2 (auth)</h1>
      <div className="mt-4 space-y-2 text-sm">
        <p>
          Пользователь: <b>{session.user.name}</b> ({session.user.email})
        </p>
        <p>
          ID (uuid): <code className="rounded bg-gray-100 px-1">{session.user.id}</code>
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={checkHasura}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Проверить запрос к Hasura (JWT)
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          Выйти
        </button>
      </div>
      {checkResult && (
        <pre className="mt-4 max-w-2xl whitespace-pre-wrap rounded-lg bg-gray-100 p-4 text-xs">
          {checkResult}
        </pre>
      )}
    </div>
  )
}
