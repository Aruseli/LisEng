'use client';

import { IconButton } from "./Buttons/IconButton";
import { Calendar, Book, Sparkles, ChartLine, CheckCircle, LogOut } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Buttons/Button";

const tabs = [
  { id: 'dashboard', label: 'План на день', icon: Calendar },
  { id: 'vocabulary', label: 'Словарь', icon: Book },
  { id: 'ai', label: 'AI практика', icon: Sparkles },
  { id: 'progress', label: 'Прогресс', icon: ChartLine },
  { id: 'level-test', label: 'Тест уровня', icon: CheckCircle },
] as const;

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  onLevelTest?: () => void;
  isLoading?: boolean;
}

export function Navigation({ activeTab, onTabChange, onRefresh, onLevelTest, isLoading }: NavigationProps) {
  const handleTabClick = (tabId: string) => {
    if (tabId === 'level-test' && onLevelTest) {
      onLevelTest();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Tooltip key={tab.id} message={tab.label}>
                <IconButton
                  key={tab.id}
                  icon={<IconComponent className="size-6" strokeWidth={1} />}
                  ariaLabel={tab.label}
                  variant={isActive ? "outline" : "ghost"}
                  className={isActive ? "bg-accent/10 border-accent text-accent" : ""}
                  onClick={() => handleTabClick(tab.id)}
                />
              </Tooltip>
            );
          })}
        </div>

        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Обновляем...' : 'Задачи на сегодня'}
        </Button>
      </div>
    </nav>
  );
}


