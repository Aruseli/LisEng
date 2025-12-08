'use client';

import { useEffect, useState } from 'react';

interface KumonSkill {
  id: string;
  skill_category: string;
  skill_subcategory: string | null;
  current_level: number;
  target_level: number | null;
  consecutive_correct: number | null;
  accuracy_rate: number | null;
  completion_time_avg: number | null;
  status: 'practicing' | 'ready_for_next' | 'mastered';
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}

interface KumonSkillsListProps {
  userId?: string;
}

const categoryLabels: Record<string, string> = {
  grammar: 'Грамматика',
  vocabulary: 'Словарь',
  reading: 'Чтение',
  listening: 'Аудирование',
  writing: 'Письмо',
  speaking: 'Говорение',
};

const statusLabels: Record<string, string> = {
  practicing: 'В процессе',
  ready_for_next: 'Готов к следующему уровню',
  mastered: 'Освоено',
};

const statusColors: Record<string, string> = {
  practicing: 'bg-blue-100 text-blue-700 border-blue-200',
  ready_for_next: 'bg-green-100 text-green-700 border-green-200',
  mastered: 'bg-purple-100 text-purple-700 border-purple-200',
};

export function KumonSkillsList({ userId }: KumonSkillsListProps) {
  const [skills, setSkills] = useState<KumonSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        const response = await fetch('/api/progress/kumon');
        if (!response.ok) {
          throw new Error('Failed to load skills');
        }
        const data = await response.json();
        setSkills(data.skills || []);
        setError(null);
      } catch (err: any) {
        console.error('[KumonSkillsList] Error:', err);
        setError(err.message || 'Не удалось загрузить навыки');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [userId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getProgressPercent = (skill: KumonSkill) => {
    // Прогресс к следующему уровню: consecutive_correct / 3 * 100
    const consecutive = skill.consecutive_correct || 0;
    return Math.min((consecutive / 3) * 100, 100);
  };

  const getLevelColor = (level: number) => {
    if (level >= 6) return 'bg-purple-500';
    if (level >= 4) return 'bg-green-500';
    if (level >= 2) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Прогресс по навыкам (Кумон)</h2>
        <p className="text-sm text-gray-400">Загрузка навыков...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Прогресс по навыкам (Кумон)</h2>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Прогресс по навыкам (Кумон)</h2>
        <p className="text-sm text-gray-500">
          Пока нет данных о навыках. Выполняй задания, и мы покажем твой прогресс по методике Кумон.
        </p>
      </div>
    );
  }

  // Группируем навыки по категориям
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.skill_category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, KumonSkill[]>);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Прогресс по навыкам (Кумон)</h2>
      <p className="mb-6 text-sm text-gray-500">
        Отслеживание прогресса по конкретным навыкам с уровнями мастерства от 1 до 7
      </p>

      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              {categoryLabels[category] || category}
            </h3>
            <div className="space-y-3">
              {categorySkills.map((skill) => {
                const progressPercent = getProgressPercent(skill);
                const levelColor = getLevelColor(skill.current_level);
                const accuracyPercent = skill.accuracy_rate
                  ? Math.round(Number(skill.accuracy_rate) * 100)
                  : null;

                return (
                  <div
                    key={skill.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {skill.skill_subcategory || 'Общая практика'}
                          </h4>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[skill.status]}`}
                          >
                            {statusLabels[skill.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Уровень: {skill.current_level}/7</span>
                          {accuracyPercent !== null && (
                            <span>Точность: {accuracyPercent}%</span>
                          )}
                          {skill.consecutive_correct !== null && (
                            <span>
                              Правильных подряд: {skill.consecutive_correct}/3
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${levelColor}`}
                      >
                        {skill.current_level}
                      </div>
                    </div>

                    {/* Прогресс-бар к следующему уровню */}
                    {skill.current_level < 7 && (
                      <div className="mb-2">
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                          <span>Прогресс к уровню {skill.current_level + 1}</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Дата последней практики */}
                    <div className="mt-2 text-xs text-gray-500">
                      Последняя практика: {formatDate(skill.last_practiced_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

