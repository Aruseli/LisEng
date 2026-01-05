import { NextRequest, NextResponse } from 'next/server';
import { initializeSystem } from '@/lib/init/system-init';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Initializing system components...');

    await initializeSystem();

    return NextResponse.json({
      success: true,
      message: 'System initialization completed successfully'
    });

  } catch (error) {
    console.error('❌ System initialization failed:', error);
    return NextResponse.json(
      { error: 'System initialization failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking system schedules...');

    // Импортируем и проверяем расписания
    const { checkAndRestoreSystemSchedules } = await import('@/lib/init/system-init');
    await checkAndRestoreSystemSchedules();

    return NextResponse.json({
      success: true,
      message: 'System schedules checked and restored if needed'
    });

  } catch (error) {
    console.error('❌ System check failed:', error);
    return NextResponse.json(
      { error: 'System check failed' },
      { status: 500 }
    );
  }
}
