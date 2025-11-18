'use client';

import { Button } from '../Buttons/Button';
import { type TaskView } from './DashboardTab';
import { type ReactNode } from 'react';

const typeLabels: Record<string, string> = {
  grammar: 'Грамматика',
  vocabulary: 'Словарь',
  reading: 'Чтение',
  listening: 'Аудирование',
  writing: 'Письмо',
  speaking: 'Говорение',
  ai_practice: 'AI практика',
};

interface TaskPreviewModalProps {
  task: TaskView;
  onRequestClose: () => void;
  onComplete: () => void;
  onStartLesson?: () => void;
  footer?: ReactNode;
}

export function TaskPreviewModal({
  task,
  onRequestClose,
  onComplete,
  onStartLesson,
  footer,
}: TaskPreviewModalProps) {
  const payload = (task.type_specific_payload ?? {}) as Record<string, any>;
  const methodologyFocus = Array.isArray(payload.methodology_focus)
    ? (payload.methodology_focus as string[])
    : [];
  const snapshotSummary =
    (typeof payload.snapshot_summary === 'string' && payload.snapshot_summary) ||
    task.description ||
    'Можно приступить в удобном темпе.';
  const recommendedPrompt =
    typeof payload.recommended_prompt === 'string'
      ? payload.recommended_prompt
      : typeof task.suggested_prompt === 'string'
        ? task.suggested_prompt
        : null;

  const taskLabel = typeLabels[task.type] ?? task.type;

  return (
    <div className="w-full max-w-xl space-y-6 p-2 sm:p-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-gray-500">{taskLabel}</p>
        <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
      </header>

      <section className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
        <p>{snapshotSummary}</p>
        {recommendedPrompt && (
          <div className="rounded-xl bg-white/80 p-3 text-xs text-gray-600">
            <span className="font-semibold text-gray-800">Рекомендация:</span> {recommendedPrompt}
          </div>
        )}
      </section>

      {methodologyFocus.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Методики</p>
          <div className="flex flex-wrap gap-2">
            {methodologyFocus.map((focus) => (
              <span
                key={focus}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {focus}
              </span>
            ))}
          </div>
        </section>
      )}

      {footer}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          onClick={() => {
            onStartLesson?.();
            onRequestClose();
          }}
        >
          Начать урок
        </Button>
        <Button
          variant="outline"
          onClick={onComplete}
          disabled={task.status === 'completed'}
        >
          {task.status === 'completed' ? '✓ Выполнено' : 'Отметить выполненным'}
        </Button>
      </div>
    </div>
  );
}


