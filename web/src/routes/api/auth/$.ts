import { createFileRoute } from '@tanstack/react-router'

import { getAuth } from '#/lib/auth'
import { getAuthConfigError } from '#/lib/server/env'

function sanitizeAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : 'auth failed'
  if (/DATABASE_URL|BETTER_AUTH|GOOGLE_|ECONN|ssl|password|secret|ENOTFOUND/i.test(message)) {
    return 'Auth is not configured. Set DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL=https://lis-eng.vercel.app, GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on Vercel.'
  }
  return message
}

async function handleAuth(request: Request) {
  const configError = getAuthConfigError()
  if (configError) {
    return Response.json({ error: configError }, { status: 500 })
  }
  try {
    return await getAuth().handler(request)
  } catch (error) {
    console.error('[auth]', error)
    return Response.json({ error: sanitizeAuthError(error) }, { status: 500 })
  }
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => handleAuth(request),
      POST: async ({ request }) => handleAuth(request),
    },
  },
})
