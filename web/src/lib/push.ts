import webpush from 'web-push'

let configured = false

export function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || ''
}

export function configureWebPush() {
  const publicKey = getVapidPublicKey()
  const privateKey = process.env.VAPID_PRIVATE_KEY || ''
  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys are not configured')
  }
  if (!configured) {
    webpush.setVapidDetails('mailto:liseng@localhost', publicKey, privateKey)
    configured = true
  }
  return webpush
}
