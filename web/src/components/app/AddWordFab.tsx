import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/app/Buttons/Button'
import { useAppData } from '@/lib/app-data'
import { useModalStore } from '@/store/modalStore'
import { useToastStore } from '@/store/toastStore'

export function AddWordFab() {
  const openModal = useModalStore((s) => s.openModal)
  const closeModal = useModalStore((s) => s.closeModal)
  const { refreshVocabulary } = useAppData()

  const open = () => {
    const id = openModal({
      closeOnOverlayClick: true,
      component: (
        <AddWordForm
          onDone={() => closeModal(id)}
          onSaved={refreshVocabulary}
        />
      ),
    })
  }

  return (
    <button
      type="button"
      onClick={open}
      className="fixed right-4 bottom-20 z-40 flex h-14 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-lg hover:opacity-90 sm:bottom-8"
      aria-label="Добавить слово"
    >
      <span className="text-xl leading-none">+</span>
      Слово
    </button>
  )
}

function AddWordForm({
  onDone,
  onSaved,
}: {
  onDone: () => void
  onSaved: () => Promise<void> | void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = word.trim()
    if (!trimmed) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/vocabulary/add-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: trimmed,
          translation: translation.trim() || undefined,
          example: example.trim() || undefined,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 409) {
        setError('Это слово уже есть в словаре')
        setBusy(false)
        return
      }
      if (!res.ok) throw new Error(body.error || 'Не удалось сохранить')
      await onSaved()
      const savedTranslation = body.card?.translation as string | undefined
      addToast({
        type: 'success',
        message: savedTranslation
          ? `«${trimmed}» — ${savedTranslation}`
          : `«${trimmed}» добавлено в карточки`,
      })
      onDone()
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка сохранения')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4 p-2">
      <h2 className="text-lg font-semibold text-gray-900">Новое слово</h2>
      <p className="text-sm text-gray-500">Достаточно самого слова — перевод и пример можно оставить пустыми.</p>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-gray-600">Слово (EN)</span>
        <input
          ref={inputRef}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="serendipity"
          required
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-gray-600">Перевод (необязательно)</span>
        <input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="счастливая случайность"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-gray-600">Пример (необязательно)</span>
        <input
          value={example}
          onChange={(e) => setExample(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="It was pure serendipity."
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={busy || !word.trim()} className="w-full">
        {busy ? (translation.trim() ? 'Сохраняем…' : 'Генерируем перевод…') : 'Добавить в карточки'}
      </Button>
    </form>
  )
}
