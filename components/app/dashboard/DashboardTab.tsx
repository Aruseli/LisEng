'use client';

import { Sparkles } from "lucide-react";
import { Button } from "../Buttons/Button";

interface RequirementCheckView {
  requirement: {
    id: string;
    description: string;
    requirement_type: string;
  };
  met: boolean;
  message: string;
}

interface TaskView {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  duration_minutes?: number | null;
  status: string;
  ai_enabled?: boolean | null;
}

interface DashboardTabProps {
  loading?: boolean;
  userName: string;
  currentLevel: string;
  targetLevel: string;
  todayMinutes: number;
  goalMinutes: number;
  tasks: TaskView[];
  onCompleteTask: (taskId: string | number) => void;
  onStartAITask: () => void;
  planSummary: string;
  planFocus: string[];
  requirementChecks: RequirementCheckView[];
}

const typeLabels: Record<string, string> = {
  grammar: 'Грамматика',
  vocabulary: 'Словарь',
  reading: 'Чтение',
  listening: 'Аудирование',
  writing: 'Письмо',
  speaking: 'Говорение',
  ai_practice: 'AI практика',
};

export function DashboardTab({
  loading,
  userName,
  currentLevel,
  targetLevel,
  todayMinutes,
  goalMinutes,
  tasks,
  onCompleteTask,
  onStartAITask,
  planSummary,
  planFocus,
  requirementChecks,
}: DashboardTabProps) {
  const progressPercent = Math.min(
    100,
    Math.round((todayMinutes / Math.max(goalMinutes, 1)) * 100)
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              План для {userName}: уровень {currentLevel} → цель {targetLevel}
            </h2>
            <p className="text-sm text-gray-500">
              {planSummary || 'Выполни задания по расписанию и отмечай продвижение'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">Сегодня</p>
              <p className="text-lg font-semibold text-gray-900">{todayMinutes} мин</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">Цель</p>
              <p className="text-lg font-semibold text-gray-900">{goalMinutes} мин</p>
            </div>
          </div>
        </div>

        {planFocus.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {planFocus.map((focus) => (
              <span
                key={focus}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {focus}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Задания на сегодня</h3>
          <Button
            onClick={onStartAITask}
            variant="default"
            leftIcon={<Sparkles className="size-5" strokeWidth={1} />}
          >
            AI коуч
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Загружаем задания...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-500">На сегодня заданий нет — можно повторить изученный материал.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const taskLabel = typeLabels[task.type] ?? task.type;
              return (
                <li
                  key={task.id}
                  className={`flex items-start justify-between rounded-2xl border border-gray-100 p-4 transition ${
                    isCompleted ? 'bg-green-50 border-green-100' : 'bg-white'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {taskLabel}: {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{task.duration_minutes ?? 10} мин</span>
                      {task.ai_enabled && (
                        <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-600">
                          AI поддержка
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          // Для AI заданий открываем AI практику
                          if (task.ai_enabled) {
                            onStartAITask();
                          } else {
                            // Для других заданий можно добавить логику открытия задания
                            // Пока просто отмечаем как выполненное
                            onCompleteTask(task.id);
                          }
                        }}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                      >
                        {task.ai_enabled ? 'Начать' : 'Выполнить'}
                      </button>
                    )}
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    disabled={isCompleted}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isCompleted
                        ? 'cursor-default bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                      {isCompleted ? '✓ Выполнено' : 'Отметить'}
                  </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {requirementChecks.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Требования этапа
          </h3>
          <ul className="space-y-2">
            {requirementChecks.map((check) => (
              <li
                key={check.requirement.id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-2 text-sm ${
                  check.met
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <span>{check.message}</span>
                <span className="text-xs uppercase">
                  {check.met ? 'готово' : 'в процессе'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}


