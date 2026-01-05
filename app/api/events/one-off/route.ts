import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { onOneOffExecuted } from '@/lib/schedule/schedule-handlers';

const HASURA_EVENT_SECRET = process.env.HASURA_EVENT_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Валидация Hasura Event Secret
    const headersList = await headers();
    const eventSecret = headersList.get('x-hasura-event-secret');

    if (!HASURA_EVENT_SECRET || eventSecret !== HASURA_EVENT_SECRET) {
      console.error('❌ Invalid Hasura Event Secret for /api/events/one-off');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Парсинг Hasura one-off execution payload
    const payload = await request.json();
    console.log('🚀 One-off event executed:', {
      event_id: payload.event_id,
      client_event_id: payload.payload?.client_event_id,
      scheduled_time: payload.scheduled_time
    });

    // Вызвать обработчик выполнения one-off события
    await onOneOffExecuted(payload);

    return NextResponse.json({
      success: true,
      message: 'One-off event processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing one-off event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
