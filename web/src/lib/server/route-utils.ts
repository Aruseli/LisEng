/**
 * Утилиты для серверных API-роутов (замена паттернов NextResponse/getServerSession).
 */
import { auth } from '#/lib/auth'

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status })
}

/**
 * Проверка сессии. Возвращает { userId } или готовый 401-Response.
 * Использование:
 *   const who = await requireUserId(request)
 *   if (who instanceof Response) return who
 */
export async function requireUserId(
  request: Request,
): Promise<{ userId: string } | Response> {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) return jsonError('Unauthorized', 401)
  return { userId: session.user.id }
}
