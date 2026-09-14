import { createFileRoute } from '@tanstack/react-router'

import { generateJSON } from '#/lib/ai/llm'
import { getAdminClient } from '#/lib/hasura'
import { getUserInstructionLanguage } from '#/lib/hasura-queries'
import { jsonError, requireUserId } from '#/lib/server/route-utils'

interface CheckAnswerBody {
  prompt?: string
  expectedAnswer?: string
  hint?: string | null
  evaluationCriteria?: string[]
  answer?: string
  topic?: string
  level?: string
}

interface Verdict {
  correct?: boolean
  feedback?: string
  corrected?: string | null
}

/**
 * Семантическая проверка ответа на открытое задание (составить предложение
 * по грамматической теме). expectedAnswer из сгенерированного урока — лишь
 * ПРИМЕР, а не эталон: строковое сравнение заваливает любые корректные
 * альтернативы, поэтому финальное решение принимает LLM.
 */
export const Route = createFileRoute('/api/ai/check-answer')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        try {
          const body = (await request.json()) as CheckAnswerBody
          const answer = body.answer?.trim()
          if (!answer || !body.prompt) {
            return jsonError('prompt and answer are required', 400)
          }

          let instructionLanguage = 'ru'
          try {
            instructionLanguage = await getUserInstructionLanguage(getAdminClient(), who.userId)
          } catch {
            // нефатально: остаётся русский
          }

          const criteria = Array.isArray(body.evaluationCriteria)
            ? body.evaluationCriteria.filter(Boolean).join('; ')
            : ''

          const prompt = `Ты — строгий, но справедливый проверяющий грамматики английского языка.

Задание ученику: «${body.prompt}»
Тема урока: ${body.topic || 'не указана'}
Уровень ученика: ${body.level || 'A2'}
${body.hint ? `Подсказка из урока: ${body.hint}` : ''}
${criteria ? `Критерии оценки из урока: ${criteria}` : ''}
Пример возможного ответа (это ЛИШЬ ОДИН из допустимых вариантов, а НЕ эталон для сравнения): «${body.expectedAnswer || '—'}»

Ответ ученика: «${answer}»

Оцени ответ строго по этим правилам:
1. Ответ засчитывай, если выполнено грамматическое требование задания (нужное время/структура), порядок слов правильный и нет орфографических ошибок.
2. Если задание — составить СВОЁ предложение, подходит любое содержание, лишь бы выполнялись грамматические требования (включая обязательные маркеры из задания, например сигнальные слова времени).
3. НЕ требуй совпадения с примером ответа ни по смыслу, ни по словам.
4. Мелкие опечатки, не ломающие грамматику, отметь в feedback, но ответ засчитай, если структура верна.
5. Если грамматическое требование НЕ выполнено (другое время, нет обязательного маркера, сломан порядок слов) — ответ неверный.
6. Если задание — перевод с русского текста, ответ должен передавать смысл КАЖДОГО предложения оригинала (допустимы естественные перефразировки и иной порядок слов) и одновременно выполнять грамматическое требование. Пропущенное или искажённое по смыслу предложение = неверно; в feedback укажи, что именно потеряно или искажено.

Верни JSON:
{
  "correct": true или false,
  "feedback": "1-2 предложения на ${instructionLanguage === 'ru' ? 'русском' : instructionLanguage}: что не так, или почему ответ верный",
  "corrected": "исправленный вариант ответа ученика (минимальная правка) или null, если ответ верный"
}`

          const verdict = await generateJSON<Verdict>(prompt, { task: 'score' })

          return Response.json({
            correct: Boolean(verdict.correct),
            feedback: verdict.feedback ?? '',
            corrected: verdict.corrected ?? null,
          })
        } catch (error) {
          console.error('[API /ai/check-answer] Error:', error)
          return jsonError('Failed to check answer', 500)
        }
      },
    },
  },
})
