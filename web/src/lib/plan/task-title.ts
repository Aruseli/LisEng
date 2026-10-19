export const DAILY_TASK_TITLE_MAX = 255

export function activityTitleFallback(activityType: string): string {
  switch (activityType) {
    case 'grammar':
      return 'Грамматическое задание'
    case 'vocabulary':
      return 'Повтор словаря'
    case 'reading':
      return 'Чтение текста'
    case 'listening':
      return 'Аудирование'
    case 'writing':
      return 'Письменная практика'
    case 'speaking':
      return 'Говорение'
    case 'ai_practice':
      return 'Практика с AI'
    default:
      return 'Учебное задание'
  }
}

/**
 * Заголовок задачи не длиннее 255 символов.
 * Короткое описание берётся целиком, длинное — только первая фраза,
 * если она сама умещается в лимит. Иначе ярлык по типу занятия.
 */
export function dailyTaskTitle(
  description: string | null | undefined,
  activityType: string,
): string {
  const fallback = activityTitleFallback(activityType)
  const text = description?.trim() ?? ''
  if (!text || text.length <= DAILY_TASK_TITLE_MAX) {
    return text || fallback
  }

  const sentenceEnd = text.search(/[.!?]/)
  if (sentenceEnd > 0) {
    const sentence = text.slice(0, sentenceEnd).trim()
    if (sentence.length > 0 && sentence.length <= DAILY_TASK_TITLE_MAX) {
      return sentence
    }
  }

  return fallback
}
