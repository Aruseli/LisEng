import { useEffect, useState } from 'react'

import { Button } from '@/components/app/Buttons/Button'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i)
  return output
}

async function ensureSw() {
  if (!('serviceWorker' in navigator)) throw new Error('Service Worker не поддерживается')
  const existing = await navigator.serviceWorker.getRegistration()
  if (existing) return existing
  return navigator.serviceWorker.register('/sw.js')
}

export function NotificationSettings() {
  const [supported, setSupported] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  )
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const standalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)

  useEffect(() => {
    setSupported('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)
  }, [])

  const enable = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        setMessage('Разрешение не выдано')
        return
      }
      const vapidRes = await fetch('/api/notifications/vapid')
      const { publicKey } = await vapidRes.json()
      if (!publicKey) throw new Error('Нет VAPID-ключа')
      const reg = await ensureSw()
      await navigator.serviceWorker.ready
      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })
      }
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })
      if (!res.ok) throw new Error('Не удалось сохранить подписку')
      setMessage('Уведомления включены')
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setMessage('Уведомления выключены')
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  const test = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/notifications/test', { method: 'POST' })
      if (!res.ok) throw new Error('Не удалось отправить тест')
      setMessage('Тестовое уведомление отправлено')
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">Уведомления</h1>
      {!supported && <p className="text-sm text-red-600">Этот браузер не поддерживает Web Push.</p>}
      <p className="text-sm text-gray-600">Статус разрешения: {permission}</p>
      {!standalone && (
        <div className="space-y-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Как включить на iPhone / iPad</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Нужен iOS 16.4 или новее.</li>
            <li>Откройте сайт в Safari (не в Chrome).</li>
            <li>Поделиться → На экран «Домой».</li>
            <li>Откройте приложение с иконки на домашнем экране.</li>
            <li>Здесь нажмите «Включить уведомления» и подтвердите.</li>
          </ol>
          <p className="text-xs text-amber-800">Во вкладке Safari пуш не работает — только из иконки на Домой.</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button onClick={enable} disabled={busy || !supported}>
          Включить уведомления
        </Button>
        <Button variant="outline" onClick={test} disabled={busy}>
          Отправить тест
        </Button>
        <Button variant="ghost" onClick={disable} disabled={busy}>
          Выключить
        </Button>
      </div>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  )
}
