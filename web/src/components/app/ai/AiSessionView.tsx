import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import { AIPracticeTab } from '@/components/app/ai/AIPracticeTab'
import { SpeakingRolePlayTab } from '@/components/app/ai/SpeakingRolePlayTab'
import { VoiceMessagesTab } from '@/components/app/ai/VoiceMessagesTab'
import { useAISession } from '@/hooks/useAISession'
import { useAppData, type PlanTask } from '@/lib/app-data'

export function AiSessionView({
  userId,
  currentLevel,
  task,
  kind,
}: {
  userId: string
  currentLevel: string | null
  task: PlanTask | null
  kind: 'practice' | 'speaking' | 'voice'
}) {
  const navigate = useNavigate()
  const { refreshRequirementChecks, refreshProgressMetrics } = useAppData()
  const [targetWords, setTargetWords] = useState<string[]>([])

  const aiContextMessage = useMemo(() => {
    const rawContext = task?.ai_context
    if (
      rawContext &&
      typeof rawContext === 'object' &&
      'context' in rawContext &&
      typeof (rawContext as { context?: unknown }).context === 'string'
    ) {
      return {
        role: 'assistant' as const,
        content: (rawContext as { context: string }).context,
        timestamp: new Date().toISOString(),
      }
    }
    return undefined
  }, [task?.ai_context])

  const sessionType = kind === 'speaking' ? 'speaking' : 'ai_practice'
  const topic =
    task?.title ??
    (kind === 'speaking' ? 'Ролевая игра' : kind === 'voice' ? 'Голосовые сообщения' : 'Практика с AI')

  const { messages, isLoading, startSession, sendMessage, hasSession } = useAISession({
    userId,
    type: sessionType,
    topic,
    level: currentLevel ?? 'A2',
    initialMessages: aiContextMessage ? [aiContextMessage] : [],
    suggestedPrompt: task?.suggested_prompt ?? null,
  })

  useEffect(() => {
    if (!hasSession) startSession()
  }, [hasSession, startSession])

  useEffect(() => {
    if (!task) {
      setTargetWords([])
      return
    }
    const payload = task.type_specific_payload as Record<string, any> | undefined
    if (payload?.lesson_materials?.targetWords) {
      setTargetWords(payload.lesson_materials.targetWords)
      return
    }
    if (payload?.targetWords) {
      setTargetWords(payload.targetWords)
      return
    }
    fetch(`/api/lesson/task?taskId=${task.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const p = data?.type_specific_payload
        setTargetWords(p?.lesson_materials?.targetWords ?? p?.targetWords ?? [])
      })
      .catch(() => setTargetWords([]))
  }, [task])

  const suggested =
    task?.suggested_prompt ??
    ((task?.type_specific_payload as { recommended_prompt?: string } | undefined)?.recommended_prompt ??
      null)

  const mapped = messages.map(({ role, content }) => ({ role, content }))

  if (kind === 'speaking') {
    return (
      <SpeakingRolePlayTab
        topic={topic}
        messages={mapped}
        isLoading={isLoading}
        suggestedPrompt={suggested}
        targetWords={targetWords}
        taskId={task?.id ? String(task.id) : undefined}
        userId={userId}
        refreshRequirementChecks={refreshRequirementChecks}
        refreshProgressMetrics={refreshProgressMetrics}
        onSendMessage={sendMessage}
        onComplete={() => navigate({ to: '/' })}
      />
    )
  }

  if (kind === 'voice') {
    return (
      <VoiceMessagesTab
        topic={topic}
        messages={mapped}
        isLoading={isLoading}
        suggestedPrompt={suggested}
        targetWords={targetWords}
        taskId={task?.id ? String(task.id) : undefined}
        userId={userId}
        refreshRequirementChecks={refreshRequirementChecks}
        refreshProgressMetrics={refreshProgressMetrics}
        onSendMessage={sendMessage}
        onComplete={() => navigate({ to: '/' })}
      />
    )
  }

  return (
    <AIPracticeTab
      topic={topic}
      messages={mapped}
      isLoading={isLoading}
      suggestedPrompt={suggested}
      onSendMessage={sendMessage}
    />
  )
}
