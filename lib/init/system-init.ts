import { Hasyx, createApolloClient, Generator } from 'hasyx';
import hasuraSchema from '../../public/hasura-schema.json';
import { ScheduleService } from '@/lib/schedule/schedule-service';
import { ArchivingService } from '@/lib/lesson-snapshots/archiving-service';

/**
 * Инициализация системных компонентов при запуске приложения
 * Вызывается при первом запуске или миграции
 */
export async function initializeSystem(): Promise<void> {
  console.log('🚀 Initializing system components...');

  try {
    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });
    const generate = Generator(hasuraSchema as any);
    const hasyx = new Hasyx(apolloClient, generate);

    // Инициализация расписания архивации
    await initializeArchivingSchedule(hasyx);

    console.log('✅ System initialization completed');

  } catch (error) {
    console.error('❌ System initialization failed:', error);
    // Не бросаем ошибку, чтобы не ломать запуск приложения
  }
}

/**
 * Настройка ежемесячного расписания архивации
 */
async function initializeArchivingSchedule(hasyx: Hasyx): Promise<void> {
  try {
    console.log('📦 Setting up archiving schedule...');

    const archivingService = new ArchivingService(hasyx);
    const scheduleService = new ScheduleService(hasyx);

    // Проверить, есть ли уже расписание архивации
    const schedules = await scheduleService.getUserSchedules('', false);
    const archivingSchedule = schedules.find(s => s.meta?.type === 'system_archiving');

    if (!archivingSchedule) {
      // Создать новое расписание архивации
      await archivingService.setupMonthlyArchivingSchedule();
      console.log('✅ Created monthly archiving schedule');
    } else {
      console.log('✅ Archiving schedule already exists');
    }

  } catch (error) {
    console.error('❌ Failed to setup archiving schedule:', error);
    // Не бросаем ошибку, чтобы не блокировать инициализацию
  }
}

/**
 * Проверка и восстановление системных расписаний
 * Вызывается периодически для восстановления после сбоев
 */
export async function checkAndRestoreSystemSchedules(): Promise<void> {
  console.log('🔍 Checking system schedules...');

  try {
    await initializeSystem();
  } catch (error) {
    console.error('❌ Failed to check/restore system schedules:', error);
  }
}
