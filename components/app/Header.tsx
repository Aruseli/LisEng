'use client';

interface HeaderProps {
  userName: string;
  streak: number;
}

export function Header({ userName, streak }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Привет, {userName}!</h1>
          <p className="text-sm text-gray-500">
            Продолжаем путь по методике Кумон — шаг за шагом к уверенности в английском.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 px-4 py-2 text-center">
          <p className="text-xs uppercase tracking-wide text-blue-500">Стрик</p>
          <p className="text-lg font-semibold text-blue-600">{streak} дней</p>
        </div>
      </div>
    </header>
  );
}


