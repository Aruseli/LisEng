'use client';

import { IconButton } from "./Buttons/IconButton";
import { Tooltip } from "./Tooltip";
import { Button } from "./Buttons/Button";
import { Dictionary } from "../icons/Dictionary";
import { Calendar } from "../icons/Calendar";
import { AIPractice } from "../icons/AIPractice";
import { Verbs } from "../icons/Verbs";
import { LevelTest } from "../icons/LevelTest";
import { Progress } from "../icons/Progress";

const tabs = [
  { id: 'dashboard', label: 'План на день', icon: Calendar },
  { id: 'vocabulary', label: 'Словарь', icon: Dictionary },
  { id: 'verbs', label: 'Неправильные глаголы', icon: Verbs },
  { id: 'ai', label: 'AI практика', icon: AIPractice },
  { id: 'progress', label: 'Прогресс', icon: Progress },
  { id: 'level-test', label: 'Тест уровня', icon: LevelTest },
] as const;

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  onLevelTest?: () => void;
  isLoading?: boolean;
}

export const Navigation = ({ activeTab, onTabChange, onRefresh, onLevelTest, isLoading }: NavigationProps) => {
  const handleTabClick = (tabId: string) => {
    if (tabId === 'level-test' && onLevelTest) {
      onLevelTest();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-background">
      <div className="mx-auto flex flex-col-reverse max-w-6xl items-center justify-between px-4 py-2 sm:flex-row sm:space-y-0">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Tooltip key={tab.id} message={tab.label}>
                <IconButton
                  key={tab.id}
                  icon={<IconComponent className="size-10" />}
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
          className="w-full sm:w-auto mb-6 sm:mb-0"
        >
          {isLoading ? 'Обновляем...' : 'Задачи на сегодня'}
        </Button>
      </div>
    </nav>
  );
}


