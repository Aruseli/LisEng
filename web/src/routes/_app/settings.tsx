import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { NotificationSettings } from '@/components/app/NotificationSettings'
import { Button } from '@/components/app/Buttons/Button'
import { useAppData } from '@/lib/app-data'
import { useHasyx } from '@/lib/compat/hasyx'
import { updateUserInstructionLanguage } from '@/lib/hasura-queries'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function AssistantLanguageSettings() {
  const { userId, instructionLanguage } = useAppData()
  const hasyx = useHasyx()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<'ru' | 'en'>(instructionLanguage)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const save = async (language: 'ru' | 'en') => {
    if (!userId || language === value) return
    setBusy(true)
    setMessage(null)
    try {
      await updateUserInstructionLanguage(hasyx, userId, language)
      setValue(language)
      await queryClient.invalidateQueries({ queryKey: ['plan'] })
      setMessage(language === 'ru' ? 'Объяснения будут на русском' : 'Explanations will be in English')
    } catch (error: any) {
      setMessage(error?.message ?? 'Не удалось сохранить язык')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">Язык ассистента</h1>
      <p className="text-sm text-gray-600">
        Практика остаётся на английском. На этом языке ассистент объясняет ошибки.
      </p>
      <div className="flex gap-2">
        <Button
          variant={value === 'ru' ? 'default' : 'outline'}
          disabled={busy}
          onClick={() => void save('ru')}
        >
          Русский
        </Button>
        <Button
          variant={value === 'en' ? 'default' : 'outline'}
          disabled={busy}
          onClick={() => void save('en')}
        >
          English
        </Button>
      </div>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <AssistantLanguageSettings />
      <NotificationSettings />
    </div>
  )
}
