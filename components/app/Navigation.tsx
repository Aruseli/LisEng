'use client';

const tabs = [
  { id: 'dashboard', label: 'План на день' },
  { id: 'vocabulary', label: 'Словарь' },
  { id: 'ai', label: 'AI практика' },
  { id: 'progress', label: 'Прогресс' },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function Navigation({ activeTab, onTabChange, onRefresh, isLoading }: NavigationProps) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Обновляем...' : 'Задачи на сегодня'}
        </button>
      </div>
    </nav>
  );
}


