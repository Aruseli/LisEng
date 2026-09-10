/**
 * Единая шкала качества ответа 0–5 (см. документацию шкалы в fsrs-config.ts).
 * Перенесено из lesson-snapshots/sm2-algorithm.ts без изменений логики.
 */

import { RESPONSE_TIME_FAST_SEC, RESPONSE_TIME_SLOW_SEC } from './fsrs-config'

export function getQualityScore(
  wasCorrect: boolean,
  responseTimeSeconds?: number,
  hintUsed?: boolean,
): number {
  if (!wasCorrect) {
    // Неправильный ответ
    return hintUsed ? 1 : 2
  }

  // Правильный ответ
  if (hintUsed) {
    return 3 // правильно, но с трудом (нужна подсказка)
  }

  if (responseTimeSeconds !== undefined) {
    if (responseTimeSeconds < RESPONSE_TIME_FAST_SEC) {
      return 5 // очень быстро = идеальное воспроизведение
    }
    if (responseTimeSeconds < RESPONSE_TIME_SLOW_SEC) {
      return 4 // быстро = лёгкое воспроизведение
    }
    return 3 // медленно = правильно, но с усилием
  }

  return 4 // правильно без подсказки, время не замеряли
}
