import type { Hasyx } from '@/lib/hasura/compat';

// Типы для работы с расписаниями
export interface ScheduleRecord {
  id: string;
  user_id?: string;
  object_id?: string;
  cron: string;
  start_at: number;
  end_at?: number;
  duration_sec?: number;
  meta?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface EventRecord {
  id: string;
  schedule_id?: string;
  user_id?: string;
  object_id?: string;
  one_off_start_id?: string;
  one_off_end_id?: string;
  plan_start: number;
  plan_end?: number;
  start?: number;
  end?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  meta?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ShuHaRiScheduleMeta {
  type: 'shu_ha_ri_weekly';
  min_sessions_completed: number;
  last_test_date?: number;
  next_test_date?: number;
}

export class ScheduleService {
  private hasyx: Hasyx;

  constructor(hasyx: Hasyx) {
    this.hasyx = hasyx;
  }

  /**
   * Создает новое расписание
   */
  async createSchedule(params: {
    userId?: string;
    cron: string;
    startAt: number;
    endAt?: number;
    durationSec?: number;
    meta?: Record<string, any>;
    objectId?: string;
  }): Promise<ScheduleRecord> {
    const { userId, cron, startAt, endAt, durationSec, meta, objectId } = params;

    const schedule = await this.hasyx.insert({
      table: 'schedule',
      objects: [{
        user_id: userId,
        object_id: objectId,
        cron,
        start_at: startAt,
        end_at: endAt,
        duration_sec: durationSec,
        meta: meta || {},
      }],
      returning: ['id', 'user_id', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta']
    });

    console.log('✅ Created schedule:', schedule[0]);
    return schedule[0] as ScheduleRecord;
  }

  /**
   * Обновляет существующее расписание
   */
  async updateSchedule(scheduleId: string, updates: Partial<Omit<ScheduleRecord, 'id' | 'created_at'>>): Promise<ScheduleRecord> {
    const schedule = await this.hasyx.update({
      table: 'schedule',
      where: { id: { _eq: scheduleId } },
      _set: updates,
      returning: ['id', 'user_id', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta']
    });

    if (!schedule.length) {
      throw new Error(`Schedule ${scheduleId} not found`);
    }

    console.log('✅ Updated schedule:', scheduleId);
    return schedule[0] as ScheduleRecord;
  }

  /**
   * Отменяет расписание и связанные события
   */
  async cancelSchedule(scheduleId: string): Promise<void> {
    // Получить все pending/future события расписания
    const events = await this.hasyx.select({
      table: 'events',
      where: {
        schedule_id: { _eq: scheduleId },
        status: { _in: ['pending', 'in_progress'] },
        plan_start: { _gt: Math.floor(Date.now() / 1000) }
      },
      returning: ['id', 'one_off_start_id', 'one_off_end_id']
    });

    // NOTE: Hasura не имеет API для удаления scheduled events
    // События автоматически очищаются cron job'ами
    console.log(`🗑️ Cancelling ${events.length} scheduled events for schedule ${scheduleId}`);

    // Просто обновить статус событий на cancelled
    for (const event of events) {
      await this.hasyx.update({
        table: 'events',
        where: { id: { _eq: event.id } },
        _set: { status: 'cancelled' }
      });
    }

    // Отменить события в базе
    await this.hasyx.update({
      table: 'events',
      where: {
        schedule_id: { _eq: scheduleId },
        status: { _in: ['pending', 'in_progress'] }
      },
      _set: { status: 'cancelled' }
    });

    // Удалить само расписание
    await this.hasyx.delete({
      table: 'schedule',
      where: { id: { _eq: scheduleId } }
    });

    console.log('✅ Cancelled schedule:', scheduleId);
  }

  /**
   * Получает все расписания пользователя
   */
  async getUserSchedules(userId: string, activeOnly: boolean = true): Promise<ScheduleRecord[]> {
    const where: any = { user_id: { _eq: userId } };

    if (activeOnly) {
      where.end_at = { _gt: Math.floor(Date.now() / 1000) };
    }

    const schedules = await this.hasyx.select({
      table: 'schedule',
      where,
      returning: ['id', 'user_id', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta', 'created_at', 'updated_at'],
      order_by: [{ created_at: 'desc' }]
    });

    return schedules as ScheduleRecord[];
  }

  /**
   * Получает события расписания
   */
  async getScheduleEvents(scheduleId: string, status?: string[], limit?: number): Promise<EventRecord[]> {
    const where: any = { schedule_id: { _eq: scheduleId } };

    if (status && status.length > 0) {
      where.status = { _in: status };
    }

    const events = await this.hasyx.select({
      table: 'events',
      where,
      returning: ['id', 'schedule_id', 'user_id', 'object_id', 'one_off_start_id', 'one_off_end_id', 'plan_start', 'plan_end', 'start', 'end', 'status', 'meta', 'created_at', 'updated_at'],
      order_by: [{ plan_start: 'desc' }],
      limit
    });

    return events as EventRecord[];
  }

  /**
   * Создает еженедельное расписание для Shu-Ha-Ri тестов
   */
  async createShuHaRiWeeklySchedule(userId: string, minSessionsCompleted: number = 5): Promise<ScheduleRecord> {
    const now = Math.floor(Date.now() / 1000);

    const meta: ShuHaRiScheduleMeta = {
      type: 'shu_ha_ri_weekly',
      min_sessions_completed: minSessionsCompleted,
      next_test_date: this.calculateNextSunday(now)
    };

    return this.createSchedule({
      userId,
      cron: '0 10 * * 0', // Каждое воскресенье в 10:00
      startAt: now,
      meta
    });
  }

  /**
   * Вычисляет следующий воскресенье в 10:00
   */
  private calculateNextSunday(fromTimestamp: number): number {
    const date = new Date(fromTimestamp * 1000);
    const dayOfWeek = date.getUTCDay(); // 0 = воскресенье
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;

    const nextSunday = new Date(date);
    nextSunday.setUTCDate(date.getUTCDate() + daysUntilSunday);
    nextSunday.setUTCHours(10, 0, 0, 0);

    return Math.floor(nextSunday.getTime() / 1000);
  }

  /**
   * Проверяет, готово ли расписание к созданию теста
   */
  async isScheduleReadyForTest(scheduleId: string, userId: string): Promise<boolean> {
    const schedule = await this.hasyx.select({
      table: 'schedule',
      where: { id: { _eq: scheduleId }, user_id: { _eq: userId } },
      returning: ['meta']
    });

    if (!schedule.length) return false;

    const meta = schedule[0].meta as ShuHaRiScheduleMeta;
    if (meta.type !== 'shu_ha_ri_weekly') return false;

    // Проверить количество завершенных сессий за неделю
    const weekStart = this.getWeekStart();
    const sessionsCompleted = await this.hasyx.select({
      table: 'ai_sessions',
      where: {
        user_id: { _eq: userId },
        session_date: { _gte: new Date(weekStart * 1000).toISOString() }
      },
      returning: ['id']
    });

    return sessionsCompleted.length >= meta.min_sessions_completed;
  }

  /**
   * Получает начало текущей недели (понедельник 00:00)
   */
  private getWeekStart(): number {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 = воскресенье, 1 = понедельник
    const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday

    const monday = new Date(now.setUTCDate(diff));
    monday.setUTCHours(0, 0, 0, 0);

    return Math.floor(monday.getTime() / 1000);
  }

  /**
   * Создает глобальное расписание для архивации
   */
  async createArchivingSchedule(): Promise<ScheduleRecord> {
    const now = Math.floor(Date.now() / 1000);

    return this.createSchedule({
      cron: '0 2 1 * *', // 1-е число каждого месяца в 2:00
      startAt: now,
      meta: {
        type: 'system_archiving',
        description: 'Monthly archiving of old lesson data'
      }
    });
  }
}
