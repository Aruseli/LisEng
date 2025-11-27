'use client';

import { Sparkles } from "lucide-react";
import { Button } from "../Buttons/Button";
import { useModalStore } from '@/store/modalStore';
import { TaskPreviewModal } from './TaskPreviewModal';

interface RequirementCheckView {
  requirement: {
    id: string;
    description: string;
    requirement_type: string;
  };
  met: boolean;
  message: string;
}

export interface TaskView {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  duration_minutes?: number | null;
  status: string;
  ai_enabled?: boolean | null;
  ai_context?: { context?: string } | Record<string, unknown> | null;
  suggested_prompt?: string | null;
  type_specific_payload?: Record<string, unknown> | null;
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
  onStartAITask: (task?: TaskView) => void;
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

export const DashboardTab = ({
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
}: DashboardTabProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleOpenTaskModal = (task: TaskView, e: React.MouseEvent<HTMLButtonElement>) => {
    let modalId = '';
    const clickPosition = { x: e.clientX, y: e.clientY };
    modalId = openModal({
      clickPosition: clickPosition,
      closeOnOverlayClick: true,
      component: (
        <TaskPreviewModal
          task={task}
          onRequestClose={() => closeModal(modalId)}
          onComplete={() => {
            onCompleteTask(task.id);
            closeModal(modalId);
          }}
          onStartLesson={() => {
            window.open(`/lesson/${task.id}`, '_blank', 'noopener,noreferrer');
          }}
        />
      ),
    });
  };

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
            onClick={() => onStartAITask()}
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
              const payload = (task.type_specific_payload ?? {}) as Record<string, any>;
              const insightLabelMap: Record<string, string> = {
                sm2_due: 'Active Recall',
                problem_area: 'Кайдзен',
                shu_focus: 'Shu',
                ha_focus: 'Ha',
                ri_focus: 'Ri',
              };
              const insightLabel =
                typeof payload.insight_type === 'string'
                  ? insightLabelMap[payload.insight_type] ?? payload.insight_type
                  : null;
              const methodologyFocus = Array.isArray(payload.methodology_focus)
                ? (payload.methodology_focus as string[])
                : [];
              const snapshotSummary =
                typeof payload.snapshot_summary === 'string'
                  ? payload.snapshot_summary
                  : task.description;
              const aiContextText =
                task.ai_context && typeof task.ai_context === 'object' && 'context' in task.ai_context
                  ? String((task.ai_context as { context?: unknown }).context ?? '')
                  : null;
              return (
                <li
                  key={task.id}
                  className={`flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition ${
                    isCompleted ? 'bg-green-50 border-green-100' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {taskLabel}: {task.title}
                      </p>
                      {insightLabel && (
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
                          {insightLabel}
                        </span>
                      )}
                    </div>
                    {snapshotSummary && (
                      <p className="mt-2 text-sm text-gray-600">{snapshotSummary}</p>
                    )}
                    {aiContextText && (
                      <div className="mt-2 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-700">
                        {aiContextText}
                      </div>
                    )}
                    {task.suggested_prompt && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Промпт:</span>{' '}
                        {task.suggested_prompt}
                      </div>
                    )}
                    {methodologyFocus.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {methodologyFocus.map((focusTag) => (
                          <span
                            key={focusTag}
                            className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                          >
                            {focusTag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{task.duration_minutes ?? 10} мин</span>
                      {task.ai_enabled && (
                        <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-600">
                          AI поддержка
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCompleted && (
                      <Button
                        variant="default"
                        onClick={(e) => {
                          if (task.ai_enabled) {
                            onStartAITask(task);
                          } else {
                            handleOpenTaskModal(task, e);
                          }
                        }}
                      >
                        {task.ai_enabled ? 'Начать' : 'Выполнить'}
                      </Button>
                    )}
                    <Button
                      variant={isCompleted ? "default" : "secondary"}
                      onClick={() => onCompleteTask(task.id)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? '✓ Выполнено' : 'Отметить'}
                    </Button>
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


