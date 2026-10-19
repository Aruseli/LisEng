import { describe, expect, it } from 'vitest'

import { activityTitleFallback, dailyTaskTitle } from './task-title'

describe('dailyTaskTitle', () => {
  it('возвращает короткое описание целиком', () => {
    expect(dailyTaskTitle('Новая грамматическая структура (микро-урок)', 'grammar')).toBe(
      'Новая грамматическая структура (микро-урок)',
    )
  })

  it('берёт первую фразу, если описание длиннее 255 символов', () => {
    const sentence = 'Повтори неправильные глаголы группы 2'
    const description = `${sentence}. ${'а'.repeat(260)}`
    expect(description.length).toBeGreaterThan(255)
    expect(dailyTaskTitle(description, 'vocabulary')).toBe(sentence)
  })

  it('берёт ярлык по типу, если длинное описание без границы фразы', () => {
    const description = 'а'.repeat(300)
    expect(dailyTaskTitle(description, 'reading')).toBe(activityTitleFallback('reading'))
  })

  it('берёт ярлык по типу, если первая фраза сама длиннее 255 символов', () => {
    const description = `${'б'.repeat(256)}. хвост`
    expect(dailyTaskTitle(description, 'listening')).toBe(activityTitleFallback('listening'))
  })

  it('берёт ярлык по типу, если описания нет', () => {
    expect(dailyTaskTitle(null, 'writing')).toBe('Письменная практика')
    expect(dailyTaskTitle('   ', 'speaking')).toBe('Говорение')
  })
})
