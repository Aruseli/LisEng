import { NextRequest, NextResponse } from 'next/server';
import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';

/**
 * Default handler for Hasura event triggers
 * Processes events from Hasura and returns operation details
 */
const handler = hasyxEvent(async (payload: HasuraEventPayload) => {
  const { event, table } = payload;
  const { op, data } = event;
  
  // Default response with operation information
  return {
    success: true,
    operation: {
      type: op,
      table: `${table.schema}.${table.name}`,
      trigger: payload.trigger.name,
      // Include relevant data based on operation type
      data: op === 'INSERT' ? { id: data.new?.id } :
            op === 'UPDATE' ? { id: data.new?.id } :
            op === 'DELETE' ? { id: data.old?.id } : {}
    }
  };
});

export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) => {
  return handler(request as any, context as any);
}; 