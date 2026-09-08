import { useNavigate, useRouterState } from '@tanstack/react-router'

import { IconButton } from './Buttons/IconButton'
import { Tooltip } from './Tooltip'
import { Button } from './Buttons/Button'
import { Dictionary } from '../icons/Dictionary'
import { Calendar } from '../icons/Calendar'
import { AIPractice } from '../icons/AIPractice'
import { Verbs } from '../icons/Verbs'
import { LevelTest } from '../icons/LevelTest'
import { Progress } from '../icons/Progress'

const tabs = [
  { id: 'dashboard', label: 'План на день', icon: Calendar, to: '/' as const },
  { id: 'vocabulary', label: 'Словарь', icon: Dictionary, to: '/vocabulary' as const },
  { id: 'verbs', label: 'Неправильные глаголы', icon: Verbs, to: '/verbs' as const },
  { id: 'ai', label: 'AI практика', icon: AIPractice, to: '/ai' as const },
  { id: 'progress', label: 'Прогресс', icon: Progress, to: '/progress' as const },
  { id: 'level-test', label: 'Тест уровня', icon: LevelTest, to: '/level-test' as const },
]

function activeIdFromPath(pathname: string) {
  if (pathname.startsWith('/vocabulary')) return 'vocabulary'
  if (pathname.startsWith('/verbs')) return 'verbs'
  if (pathname.startsWith('/ai')) return 'ai'
  if (pathname.startsWith('/progress')) return 'progress'
  if (pathname.startsWith('/level-test')) return 'level-test'
  return 'dashboard'
}

interface NavigationProps {
  onRefresh: () => void
  isLoading?: boolean
}

export const Navigation = ({ onRefresh, isLoading }: NavigationProps) => {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const activeTab = activeIdFromPath(pathname)

  return (
    <nav className="border-b border-gray-200 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between px-4 py-2 sm:flex-row sm:space-y-0">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Tooltip key={tab.id} message={tab.label}>
                <IconButton
                  icon={<IconComponent className="size-10" />}
                  ariaLabel={tab.label}
                  variant={isActive ? 'outline' : 'ghost'}
                  className={isActive ? 'border-accent bg-accent/10 text-accent' : ''}
                  onClick={() => navigate({ to: tab.to })}
                />
              </Tooltip>
            )
          })}
        </div>

        <Button onClick={onRefresh} disabled={isLoading} variant="outline" className="mb-6 w-full sm:mb-0 sm:w-auto">
          {isLoading ? 'Обновляем...' : 'Задачи на сегодня'}
        </Button>
      </div>
    </nav>
  )
}
