import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { onEventRowChange } from '@/lib/schedule/schedule-handlers';

const HASURA_EVENT_SECRET = process.env.HASURA_EVENT_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Валидация Hasura Event Secret
    const headersList = await headers();
    const eventSecret = headersList.get('x-hasura-event-secret');

    if (!HASURA_EVENT_SECRET || eventSecret !== HASURA_EVENT_SECRET) {
      console.error('❌ Invalid Hasura Event Secret for /api/events/events');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Парсинг Hasura event payload
    const payload = await request.json();
    console.log('📨 Events table event received:', {
      operation: payload.event.op,
      table: payload.table.name,
      id: payload.event.data.new?.id || payload.event.data.old?.id,
      status: payload.event.data.new?.status || payload.event.data.old?.status
    });

    // Вызвать обработчик изменений событий
    await onEventRowChange(payload);

    return NextResponse.json({
      success: true,
      message: 'Events table event processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing events table event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}