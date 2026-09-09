/**
 * Выпуск Hasura JWT для залогиненного пользователя.
 * Клеймы совместимы с прежними (hasyx):
 *   x-hasura-allowed-roles: ['user', 'anonymous', 'me'], default: 'user', user-id: <uuid>
 * Подпись: HS256 ключом из HASURA_JWT_SECRET (тот же секрет, что настроен в Hasura).
 */
import { createFileRoute } from '@tanstack/react-router'
import { SignJWT } from 'jose'

import { auth } from '#/lib/auth'
import { readServerEnv } from '#/lib/server/env'

const TOKEN_TTL_SECONDS = 60 * 60 // 1 час; клиент перезапрашивает по мере надобности

export const Route = createFileRoute('/api/auth/hasura-jwt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) {
          return Response.json({ error: 'Не авторизован' }, { status: 401 })
        }

        const jwtRaw = readServerEnv().HASURA_JWT_SECRET
        if (!jwtRaw) {
          return Response.json({ error: 'HASURA_JWT_SECRET is not set' }, { status: 500 })
        }
        const jwtSecret = JSON.parse(jwtRaw) as {
          type: string
          key: string
        }
        if (jwtSecret.type !== 'HS256') {
          return Response.json(
            { error: `Неподдерживаемый тип JWT-секрета: ${jwtSecret.type}` },
            { status: 500 },
          )
        }

        const userId = session.user.id
        const token = await new SignJWT({
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'anonymous', 'me'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': userId,
          },
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setSubject(userId)
          .setIssuedAt()
          .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS)
          .sign(new TextEncoder().encode(jwtSecret.key))

        return Response.json({ token, expiresIn: TOKEN_TTL_SECONDS })
      },
    },
  },
})
