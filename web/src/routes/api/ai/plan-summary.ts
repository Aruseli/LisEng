import { createFileRoute } from '@tanstack/react-router'

import { generateJSON } from '#/lib/ai/llm'
import { requireUserId } from '#/lib/server/route-utils'
import type { DailyPlanAiSummary } from '#/types/daily-plan'

export const Route = createFileRoute('/api/ai/plan-summary')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const who = await requireUserId(request)
        if (who instanceof Response) return who

        try {
          const { plan, userProfile } = await request.json()

          // Construct the prompt for the AI
          const prompt = `
            Based on the user's daily plan and profile, generate a concise summary and recommendations.
            User Profile: ${JSON.stringify(userProfile)}
            Daily Plan: ${JSON.stringify(plan)}
            Return a JSON object with 'summary', 'recommendations', and 'focus'.
        `

          const summary = await generateJSON<DailyPlanAiSummary>(prompt)

          return Response.json(summary)
        } catch (error: any) {
          console.error('Error generating plan summary:', error)
          return Response.json(
            { error: error.message || 'Failed to generate plan summary' },
            { status: 500 },
          )
        }
      },
    },
  },
})
