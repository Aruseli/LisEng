import { Hasyx, createApolloClient, Generator, Hasura } from 'hasyx';
import { ScheduleService, ScheduleRecord, EventRecord } from './schedule-service';

// Глобальный инстанс Hasyx для обработчиков
let hasyxInstance: Hasyx | null = null;
let hasuraInstance: Hasura | null = null;
let scheduleServiceInstance: ScheduleService | null = null;

function getHasyx(): Hasyx {
  if (!hasyxInstance) {
    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });
    const generate = Generator({} as any); // Пустая схема для базовой функциональности
    hasyxInstance = new Hasyx(apolloClient, generate);
  }
  return hasyxInstance;
}

function getHasura(): Hasura {
  if (!hasuraInstance) {
    hasuraInstance = new Hasura({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    });
  }
  return hasuraInstance;
}

function getScheduleService(): ScheduleService {
  if (!scheduleServiceInstance) {
    scheduleServiceInstance = new ScheduleService(getHasyx());
  }
  return scheduleServiceInstance;
}

/**
 * Обрабатывает изменения в таблице schedule
 */
export async function onScheduleRowChange(payload: any): Promise<void> {
  const { event } = payload;
  const { op, data } = event;

  console.log(`📅 Schedule ${op}:`, data.new?.id || data.old?.id);

  try {
    const scheduleService = getScheduleService();

    if (op === 'INSERT') {
      // При создании расписания создаем первое событие
      await handleScheduleInsert(scheduleService, data.new);
    } else if (op === 'UPDATE') {
      // При обновлении расписания пересчитываем события
      await handleScheduleUpdate(scheduleService, data.new, data.old);
    } else if (op === 'DELETE') {
      // При удалении расписания отменяем связанные события
      await handleScheduleDelete(scheduleService, data.old);
    }
  } catch (error) {
    console.error('❌ Error handling schedule change:', error);
    throw error;
  }
}

/**
 * Обрабатывает изменения в таблице events
 */
export async function onEventRowChange(payload: any): Promise<void> {
  const { event } = payload;
  const { op, data } = event;

  console.log(`📅 Event ${op}:`, data.new?.id || data.old?.id, data.new?.status || data.old?.status);

  try {
    const hasura = getHasura();
    const hasyx = getHasyx();

    if (op === 'INSERT') {
      // При создании события создаем Hasura one-off event
      await handleEventInsert(hasura, hasyx, data.new);
    } else if (op === 'UPDATE') {
      // При обновлении события обновляем Hasura one-off event
      await handleEventUpdate(hasura, hasyx, data.new, data.old);
    } else if (op === 'DELETE') {
      // При удалении события отменяем Hasura one-off event
      await handleEventDelete(hasura, data.old);
    }
  } catch (error) {
    console.error('❌ Error handling event change:', error);
    throw error;
  }
}

/**
 * Обрабатывает выполнение one-off событий
 */
export async function onOneOffExecuted(payload: any): Promise<void> {
  const { event_id, payload: eventPayload } = payload;
  const { client_event_id, schedule_id } = eventPayload || {};

  console.log(`🚀 One-off executed: ${event_id}, client_event_id: ${client_event_id}`);

  try {
    const hasyx = getHasyx();
    const scheduleService = getScheduleService();

    if (!client_event_id) {
      console.warn('⚠️ No client_event_id in one-off payload');
      return;
    }

    // Найти событие в базе
    const events = await hasyx.select({
      table: 'events',
      where: { id: { _eq: client_event_id } },
      returning: ['id', 'schedule_id', 'status', 'plan_start', 'plan_end', 'meta']
    });

    if (!events.length) {
      console.warn(`⚠️ Event ${client_event_id} not found`);
      return;
    }

    const event = events[0] as EventRecord;

    // Обновить статус события
    await hasyx.update({
      table: 'events',
      where: { id: { _eq: client_event_id } },
      _set: {
        status: 'in_progress',
        start: Math.floor(Date.now() / 1000)
      }
    });

    // Если есть schedule_id, создать следующее событие
    if (event.schedule_id) {
      await createNextScheduleEvent(scheduleService, event.schedule_id, event);
    }

    // Выполнить специфичную логику для типа события
    await executeEventLogic(hasyx, event);

  } catch (error) {
    console.error('❌ Error handling one-off execution:', error);
    throw error;
  }
}

/**
 * Обрабатывает cron события для выполнения запланированных задач
 */
export async function processScheduledEvents(): Promise<number> {
  console.log('⏰ Processing scheduled events...');

  try {
    const hasyx = getHasyx();
    const now = Math.floor(Date.now() / 1000);

    // Найти все pending события, время которых пришло
    const readyEvents = await hasyx.select({
      table: 'events',
      where: {
        status: { _eq: 'pending' },
        plan_start: { _lte: now }
      },
      returning: ['id', 'schedule_id', 'user_id', 'object_id', 'plan_start', 'plan_end', 'meta'],
      order_by: [{ plan_start: 'asc' }],
      limit: 50 // Ограничение для предотвращения перегрузки
    });

    console.log(`📋 Found ${readyEvents.length} ready events`);

    for (const event of readyEvents) {
      try {
        // Выполнить логику события
        await executeEventLogic(hasyx, event as EventRecord);

        // Обновить статус
        await hasyx.update({
          table: 'events',
          where: { id: { _eq: event.id } },
          _set: {
            status: 'completed',
            end: now
          }
        });

        // Если есть schedule_id, создать следующее событие
        if (event.schedule_id) {
          const scheduleService = getScheduleService();
          await createNextScheduleEvent(scheduleService, event.schedule_id, event as EventRecord);
        }

      } catch (error) {
        console.error(`❌ Error processing event ${event.id}:`, error);

        // Отметить событие как failed (если нужно добавить поле status)
        await hasyx.update({
          table: 'events',
          where: { id: { _eq: event.id } },
          _set: {
            status: 'cancelled',
            meta: {
              ...event.meta,
              error: error instanceof Error ? error.message : 'Unknown error',
              processed_at: now
            }
          }
        });
      }
    }

    return readyEvents.length;

  } catch (error) {
    console.error('❌ Error processing scheduled events:', error);
    throw error;
  }
}

// Вспомогательные функции

async function handleScheduleInsert(scheduleService: ScheduleService, schedule: ScheduleRecord): Promise<void> {
  // Для Shu-Ha-Ri расписаний создаем первое событие
  if (schedule.meta?.type === 'shu_ha_ri_weekly') {
    const nextTestDate = schedule.meta.next_test_date || scheduleService['calculateNextSunday'](schedule.start_at);

    await getHasyx().insert({
      table: 'events',
      objects: [{
        schedule_id: schedule.id,
        user_id: schedule.user_id,
        plan_start: nextTestDate,
        status: 'pending',
        meta: {
          type: 'shu_ha_ri_test',
          description: 'Еженедельный тест Shu-Ha-Ri'
        }
      }]
    });

    console.log(`✅ Created first Shu-Ha-Ri event for schedule ${schedule.id}`);
  }
}

async function handleScheduleUpdate(scheduleService: ScheduleService, newSchedule: ScheduleRecord, oldSchedule: ScheduleRecord): Promise<void> {
  // Если изменилось время или cron, нужно пересчитать события
  if (newSchedule.cron !== oldSchedule.cron || newSchedule.start_at !== oldSchedule.start_at) {
    // Удалить будущие pending события
    await getHasyx().update({
      table: 'events',
      where: {
        schedule_id: { _eq: newSchedule.id },
        status: { _eq: 'pending' },
        plan_start: { _gt: Math.floor(Date.now() / 1000) }
      },
      _set: { status: 'cancelled' }
    });

    // Создать новое событие
    if (newSchedule.meta?.type === 'shu_ha_ri_weekly') {
      const nextTestDate = scheduleService['calculateNextSunday'](Math.floor(Date.now() / 1000));

      await getHasyx().insert({
        table: 'events',
        objects: [{
          schedule_id: newSchedule.id,
          user_id: newSchedule.user_id,
          plan_start: nextTestDate,
          status: 'pending',
          meta: {
            type: 'shu_ha_ri_test',
            description: 'Еженедельный тест Shu-Ha-Ri (обновлено)'
          }
        }]
      });
    }
  }
}

async function handleScheduleDelete(scheduleService: ScheduleService, schedule: ScheduleRecord): Promise<void> {
  // Отменить все связанные события
  await getHasyx().update({
    table: 'events',
    where: {
      schedule_id: { _eq: schedule.id },
      status: { _in: ['pending', 'in_progress'] }
    },
    _set: { status: 'cancelled' }
  });

  console.log(`✅ Cancelled all events for deleted schedule ${schedule.id}`);
}

async function handleEventInsert(hasura: Hasura, hasyx: Hasyx, event: EventRecord): Promise<void> {
  try {
    // NOTE: Hasura не имеет API для создания scheduled events
    // Этот функционал обрабатывается через cron triggers в Hasura
    console.log(`📅 Event scheduled for ${new Date(event.plan_start * 1000).toISOString()}: ${event.meta?.type || 'generic'}`);

    // Пометить событие как запланированное (без создания one-off event)
    await hasyx.update({
      table: 'events',
      where: { id: { _eq: event.id } },
      _set: { status: 'scheduled' }
    });

    console.log(`✅ Event scheduled: ${event.id}`);

    // Если есть plan_end, отметить время окончания
    if (event.plan_end) {
      const endTime = new Date(event.plan_end * 1000).toISOString();
      console.log(`📅 Event ${event.id} ends at ${endTime}`);

      // Обновить статус на scheduled (cron job обработает завершение)
      await hasyx.update({
        table: 'events',
        where: { id: { _eq: event.id } },
        _set: { status: 'scheduled' }
      });
    }

  } catch (error) {
    console.error(`❌ Failed to create Hasura one-off for event ${event.id}:`, error);
    // Не бросаем ошибку, чтобы не блокировать создание события
  }
}

async function handleEventUpdate(hasura: Hasura, hasyx: Hasyx, newEvent: EventRecord, oldEvent: EventRecord): Promise<void> {
  // Если изменилось время и событие еще не началось, пересоздать one-off
  if (newEvent.plan_start !== oldEvent.plan_start && newEvent.status === 'pending') {
    // NOTE: Hasura не имеет API для удаления scheduled events
    // События автоматически удаляются cron job'ами

    // Обновить статус события (cron job обработает выполнение)
    try {
      const scheduledAt = new Date(newEvent.plan_start * 1000).toISOString();
      console.log(`📅 Updated event ${newEvent.id} scheduled for ${scheduledAt}`);

      await hasyx.update({
        table: 'events',
        where: { id: { _eq: newEvent.id } },
        _set: { status: 'scheduled' }
      });

      console.log(`✅ Updated event ${newEvent.id} status to scheduled`);
    } catch (error) {
      console.error(`❌ Failed to update event ${newEvent.id}:`, error);
    }
  }
}

async function handleEventDelete(hasura: Hasura, event: EventRecord): Promise<void> {
  // NOTE: Hasura не имеет API для удаления scheduled events
  // События автоматически очищаются cron job'ами
  console.log(`🗑️ Event ${event.id} deleted - scheduled events will be cleaned by cron jobs`);
}

async function createNextScheduleEvent(scheduleService: ScheduleService, scheduleId: string, completedEvent: EventRecord): Promise<void> {
  try {
    const schedule = await getHasyx().select({
      table: 'schedule',
      where: { id: { _eq: scheduleId } },
      returning: ['id', 'user_id', 'cron', 'meta', 'end_at']
    });

    if (!schedule.length) return;

    const scheduleData = schedule[0];

    // Проверить, не закончилось ли расписание
    if (scheduleData.end_at && Math.floor(Date.now() / 1000) >= scheduleData.end_at) {
      console.log(`⏹️ Schedule ${scheduleId} has ended`);
      return;
    }

    // Для Shu-Ha-Ri расписаний создать следующее еженедельное событие
    if (scheduleData.meta?.type === 'shu_ha_ri_weekly') {
      const nextTestDate = scheduleService['calculateNextSunday'](completedEvent.plan_start);

      await getHasyx().insert({
        table: 'events',
        objects: [{
          schedule_id: scheduleId,
          user_id: scheduleData.user_id,
          plan_start: nextTestDate,
          status: 'pending',
          meta: {
            type: 'shu_ha_ri_test',
            description: 'Еженедельный тест Shu-Ha-Ri'
          }
        }]
      });

      console.log(`✅ Created next Shu-Ha-Ri event for schedule ${scheduleId} at ${new Date(nextTestDate * 1000).toISOString()}`);
    }

  } catch (error) {
    console.error(`❌ Failed to create next event for schedule ${scheduleId}:`, error);
  }
}

async function executeEventLogic(hasyx: Hasyx, event: EventRecord): Promise<void> {
  const eventType = event.meta?.type;

  if (eventType === 'shu_ha_ri_test') {
    // Логика выполнения Shu-Ha-Ri теста
    console.log(`🧠 Executing Shu-Ha-Ri test for user ${event.user_id}`);

    // Здесь будет логика создания и выполнения теста
    // Пока просто логируем
    console.log('✅ Shu-Ha-Ri test execution placeholder');

  } else if (eventType === 'system_archiving') {
    // Логика архивации данных
    console.log('📦 Executing system archiving');

    try {
      // Импортируем ArchivingService
      const { ArchivingService } = await import('../lesson-snapshots/archiving-service');

      const archivingService = new ArchivingService(hasyx);
      const result = await archivingService.archiveAllUsersData();

      console.log(`✅ System archiving completed: ${result.totalUsers} users, ${result.totalSnapshotsArchived} snapshots, ${result.totalActiveRecallArchived} active recall sessions`);

      if (result.errors.length > 0) {
        console.warn(`⚠️ Archiving completed with ${result.errors.length} errors:`, result.errors);
      }

    } catch (error) {
      console.error('❌ System archiving failed:', error);
      throw error;
    }

  } else {
    console.log(`⚡ Executing generic event logic for type: ${eventType}`);
  }
}
