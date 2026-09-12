import { useEffect, useState } from 'react'

/** Локальная дата в формате YYYY-MM-DD (без UTC-сдвига). */
export function localToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function msUntilNextMidnight(): number {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5)
  return midnight.getTime() - now.getTime()
}

/**
 * Реактивная локальная дата «сегодня».
 * PWA может жить через полночь без перезагрузки — дата обновляется:
 *  - таймером на ближайшую полночь;
 *  - при возврате во вкладку (visibilitychange) и на focus.
 * Единый источник даты для ритуала и query-ключей дневных данных.
 */
export function useToday(): string {
  const [today, setToday] = useState(localToday)

  useEffect(() => {
    const sync = () => {
      const current = localToday()
      setToday((prev) => (prev === current ? prev : current))
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') sync()
    }

    // Таймер на полночь; после срабатывания перепланируется на следующую
    let timer: ReturnType<typeof setTimeout>
    const armMidnightTimer = () => {
      timer = setTimeout(() => {
        sync()
        armMidnightTimer()
      }, msUntilNextMidnight())
    }
    armMidnightTimer()

    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return today
}
