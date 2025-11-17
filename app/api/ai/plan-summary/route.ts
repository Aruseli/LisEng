import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai/llm';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';
import { DailyPlanAiSummary } from '@/types/daily-plan';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { plan, userProfile } = await req.json();

    // Construct the prompt for the AI
    const prompt = `
            Based on the user's daily plan and profile, generate a concise summary and recommendations.
            User Profile: ${JSON.stringify(userProfile)}
            Daily Plan: ${JSON.stringify(plan)}
            Return a JSON object with 'summary', 'recommendations', and 'focus'.
        `;

    const summary = await generateJSON<DailyPlanAiSummary>(prompt);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error generating plan summary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate plan summary' },
      { status: 500 }
    );
  }
}


