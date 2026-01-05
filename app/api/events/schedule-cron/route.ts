import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { processScheduledEvents } from '@/lib/schedule/schedule-handlers';

const HASURA_EVENT_SECRET = process.env.HASURA_EVENT_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Валидация Hasura Event Secret
    const headersList = await headers();
    const eventSecret = headersList.get('x-hasura-event-secret');

    if (!HASURA_EVENT_SECRET || eventSecret !== HASURA_EVENT_SECRET) {
      console.error('❌ Invalid Hasura Event Secret for /api/events/schedule-cron');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('⏰ Cron trigger: Processing scheduled events...');

    // Вызвать обработчик запланированных событий
    const processedCount = await processScheduledEvents();

    return NextResponse.json({
      success: true,
      message: 'Scheduled events processed successfully',
      processed_count: processedCount
    });

  } catch (error) {
    console.error('❌ Error processing scheduled events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
