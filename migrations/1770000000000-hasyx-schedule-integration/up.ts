import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql('BEGIN');

  try {
    console.log('🚀 Starting Hasyx Schedule integration migration...');

    // ============================================
    // 1. Создание таблицы schedule
    // ============================================
    console.log('📝 Creating schedule table...');

    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS public.schedule (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NULL,
        object_id UUID NULL,
        cron TEXT NOT NULL,
        start_at BIGINT NOT NULL,
        end_at BIGINT NULL,
        duration_sec BIGINT NULL,
        meta JSONB NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ Created schedule table');

    // ============================================
    // 2. Создание таблицы events
    // ============================================
    console.log('📝 Creating events table...');

    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS public.events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        schedule_id UUID NULL REFERENCES public.schedule(id) ON DELETE SET NULL,
        user_id UUID NULL,
        object_id UUID NULL,
        one_off_start_id TEXT NULL,
        one_off_end_id TEXT NULL,
        plan_start BIGINT NOT NULL,
        plan_end BIGINT NULL,
        start BIGINT NULL,
        end BIGINT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        meta JSONB NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✅ Created events table');

    // ============================================
    // 3. Индексы для производительности
    // ============================================
    console.log('📝 Creating indexes...');

    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_schedule_user_start_end
      ON public.schedule(user_id, start_at, end_at) WHERE user_id IS NOT NULL;
    `);

    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_events_schedule_plan_start
      ON public.events(schedule_id, plan_start) WHERE schedule_id IS NOT NULL;
    `);

    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_events_user_status_plan_start
      ON public.events(user_id, status, plan_start) WHERE user_id IS NOT NULL;
    `);

    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_events_status_plan_start
      ON public.events(status, plan_start) WHERE status = 'pending';
    `);

    console.log('✅ Created indexes');

    // ============================================
    // 4. Добавление комментариев к таблицам
    // ============================================
    console.log('📝 Adding table comments...');

    await hasura.sql(`
      COMMENT ON TABLE public.schedule IS 'Hasyx Schedule: определяет правила повторения для планирования событий';
    `);

    await hasura.sql(`
      COMMENT ON TABLE public.events IS 'Hasyx Events: конкретные запланированные события с жизненным циклом';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.schedule.cron IS 'Cron выражение для расписания (например: "0 10 * * 0" - воскресенье 10:00)';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.schedule.start_at IS 'Unix timestamp начала действия расписания';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.schedule.end_at IS 'Unix timestamp окончания действия расписания (null = бессрочно)';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.events.status IS 'Статус события: pending, in_progress, completed, cancelled';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.events.one_off_start_id IS 'ID Hasura one-off события для начала выполнения';
    `);

    await hasura.sql(`
      COMMENT ON COLUMN public.events.one_off_end_id IS 'ID Hasura one-off события для завершения выполнения';
    `);

    console.log('✅ Added table comments');

    await hasura.sql('COMMIT');
    console.log('✅ Hasyx Schedule integration migration completed successfully');

    // ============================================
    // 5. Отслеживание таблиц в Hasura (с graceful handling)
    // ============================================
    console.log('🔄 Tracking tables in Hasura...');

    const tablesToTrack = ['schedule', 'events'];

    let trackingSuccess = false;
    for (const table of tablesToTrack) {
      try {
        await hasura.defineTable({ schema: 'public', table });
        console.log(`  ✅ Tracked table: ${table}`);
        trackingSuccess = true;
      } catch (error: any) {
        if (error?.message?.includes('already tracked') ||
            error?.message?.includes('already exists')) {
          console.log(`  ⚠️  Table ${table} already tracked`);
          trackingSuccess = true;
        } else if (error?.message?.includes('not reachable') ||
                   error?.message?.includes('502') ||
                   error?.message?.includes('hibernated')) {
          console.warn(`  ⚠️  Hasura Cloud недоступен. Таблицу ${table} можно отследить позже через консоль Hasura.`);
        } else {
          console.warn(`  ⚠️  Could not track table ${table}:`, error?.message || error);
        }
      }
    }

    if (!trackingSuccess) {
      console.warn('⚠️  Не удалось отследить таблицы в Hasura. Это нормально, если Hasura Cloud недоступен.');
      console.warn('   Таблицы можно отследить позже через консоль Hasura Cloud.');
    }

    // ============================================
    // 6. Настройка разрешений (permissions)
    // ============================================
    console.log('🔐 Setting up permissions...');

    try {
      // schedule permissions
      await hasura.definePermission({
        schema: 'public',
        table: 'schedule',
        operation: 'select',
        role: 'user',
        filter: {},
        columns: true,
        aggregate: true,
      });

      await hasura.definePermission({
        schema: 'public',
        table: 'schedule',
        operation: 'insert',
        role: 'user',
        filter: {},
        check: {},
        columns: ['id', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta'],
        set: { user_id: 'X-Hasura-User-Id' },
      });

      const ownerFilter = { user_id: { _eq: 'X-Hasura-User-Id' } };
      await hasura.definePermission({
        schema: 'public',
        table: 'schedule',
        operation: 'update',
        role: 'user',
        filter: ownerFilter,
        columns: ['object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta'],
      });

      await hasura.definePermission({
        schema: 'public',
        table: 'schedule',
        operation: 'delete',
        role: 'user',
        filter: ownerFilter,
      });

      // events permissions
      await hasura.definePermission({
        schema: 'public',
        table: 'events',
        operation: 'select',
        role: 'user',
        filter: {},
        columns: true,
        aggregate: true,
      });

      await hasura.definePermission({
        schema: 'public',
        table: 'events',
        operation: 'insert',
        role: 'user',
        filter: {},
        check: {},
        columns: ['id', 'schedule_id', 'object_id', 'plan_start', 'plan_end', 'start', 'end', 'status', 'meta'],
        set: { user_id: 'X-Hasura-User-Id' },
      });

      await hasura.definePermission({
        schema: 'public',
        table: 'events',
        operation: 'update',
        role: 'user',
        filter: ownerFilter,
        columns: ['schedule_id', 'object_id', 'plan_start', 'plan_end', 'start', 'end', 'status', 'meta'],
      });

      await hasura.definePermission({
        schema: 'public',
        table: 'events',
        operation: 'delete',
        role: 'user',
        filter: ownerFilter,
      });

      console.log('✅ Permissions configured');
    } catch (error: any) {
      if (error?.message?.includes('not reachable') ||
          error?.message?.includes('502') ||
          error?.message?.includes('hibernated')) {
        console.warn('⚠️  Hasura Cloud недоступен. Разрешения можно настроить позже через консоль Hasura.');
      } else {
        console.warn('⚠️  Could not configure permissions:', error?.message || error);
      }
    }

  } catch (error) {
    await hasura.sql('ROLLBACK').catch(() => {});
    console.error('❌ Hasyx Schedule integration migration failed:', error);
    throw error;
  }
}

up();
