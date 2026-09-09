/** Динамический доступ, чтобы Vite не вырезал переменные на билде. */
export function readEnv(name: string) {
  return process.env[name]
}

export function authEnvStatus() {
  const url = readEnv('BETTER_AUTH_URL') ?? ''
  return {
    DATABASE_URL: Boolean(readEnv('DATABASE_URL')),
    BETTER_AUTH_SECRET: Boolean(readEnv('BETTER_AUTH_SECRET')),
    BETTER_AUTH_URL: Boolean(url),
    BETTER_AUTH_URL_LOCALHOST: /localhost|127\.0\.0\.1/.test(url),
    GOOGLE_CLIENT_ID: Boolean(readEnv('GOOGLE_CLIENT_ID')),
    GOOGLE_CLIENT_SECRET: Boolean(readEnv('GOOGLE_CLIENT_SECRET')),
  }
}

export function getAuthConfigError() {
  const status = authEnvStatus()
  if (!status.DATABASE_URL) return 'DATABASE_URL is not set'
  if (!status.BETTER_AUTH_SECRET) return 'BETTER_AUTH_SECRET is not set'
  if (!status.GOOGLE_CLIENT_ID || !status.GOOGLE_CLIENT_SECRET) {
    return 'GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set'
  }
  return null
}

export function getAuthBaseURL() {
  const raw = (readEnv('BETTER_AUTH_URL') ?? '').replace(/\/$/, '')
  if (raw && !/localhost|127\.0\.0\.1/.test(raw)) return raw
  const vercel = readEnv('VERCEL_URL')
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`
  return raw || 'http://localhost:3000'
}
