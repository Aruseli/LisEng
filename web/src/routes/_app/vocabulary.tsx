import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/app/Buttons/Button'
import { VocabularyTab } from '@/components/app/vocabulary/VocabularyTab'
import { useAppData } from '@/lib/app-data'

export const Route = createFileRoute('/_app/vocabulary')({
  component: VocabularyPage,
})

function VocabularyPage() {
  const { vocabularyCards, dashboard, userId, currentLevel, isLoading, regeneratePlan } = useAppData()
  const [generating, setGenerating] = useState(false)
  const dueToday = dashboard?.plan?.vocabulary?.dueToday ?? vocabularyCards.length
  const empty = vocabularyCards.length === 0 && dueToday === 0

  const generatePack = async () => {
    setGenerating(true)
    try {
      await fetch('/api/vocabulary/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, level: currentLevel || 'A2' }),
      })
      await regeneratePlan()
    } finally {
      setGenerating(false)
    }
  }

  if (empty && !isLoading) {
    return (
      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Словарь пока пустой</h2>
        <p className="text-sm text-gray-500">
          Добавь слово кнопкой «+ Слово» или сгенерируй стартовый набор под свой уровень.
        </p>
        <Button onClick={generatePack} disabled={generating}>
          {generating ? 'Генерируем…' : 'Сгенерировать набор под мой уровень'}
        </Button>
      </div>
    )
  }

  return (
    <VocabularyTab loading={isLoading} cards={vocabularyCards} dueToday={dueToday} />
  )
}
