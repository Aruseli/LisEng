/** Куда вести с дашборда: урок или AI-экран (SPA, не новая вкладка). */

export type PlanTaskLike = {
  id: string | number
  type?: string | null
  title?: string | null
  description?: string | null
  ai_enabled?: boolean | null
}

export function isVoiceMessagesTask(task: PlanTaskLike) {
  if (task.type !== 'ai_practice') return false
  const text = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase()
  return text.includes('голос')
}

export function getTaskLocation(task: PlanTaskLike): {
  to: string
  params?: { taskId: string }
  search?: { taskId: string }
} {
  const taskId = String(task.id)
  if (task.type === 'speaking') {
    return { to: '/ai/speaking/$taskId', params: { taskId } }
  }
  if (isVoiceMessagesTask(task)) {
    return { to: '/ai/voice/$taskId', params: { taskId } }
  }
  if (task.ai_enabled || task.type === 'ai_practice') {
    return { to: '/ai', search: { taskId } }
  }
  return { to: '/lesson/$taskId', params: { taskId } }
}
