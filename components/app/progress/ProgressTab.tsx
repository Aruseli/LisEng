'use client';

interface ProgressPoint {
  week: string;
  words: number;
  tasks: number;
  studyMinutes?: number;
}

interface AchievementView {
  type: string;
  title: string;
  description?: string | null;
}

interface RequirementCheckView {
  requirement: {
    id: string;
    description: string;
    requirement_type: string;
  };
  met: boolean;
  message: string;
}

interface ProgressTabProps {
  loading?: boolean;
  progressData: ProgressPoint[];
  achievements: AchievementView[];
  readiness: boolean;
  requirementChecks: RequirementCheckView[];
}

export function ProgressTab({
  loading,
  progressData,
  achievements,
  readiness,
  requirementChecks,
}: ProgressTabProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Динамика по неделям</h2>
        {loading ? (
          <p className="mt-4 text-sm text-gray-400">Готовим графики...</p>
        ) : progressData.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Пока нет сохранённой статистики. Выполняй задания, и мы покажем прогресс.
          </p>
        ) : (
          <table className="mt-4 w-full table-fixed text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="pb-2 text-left font-medium">Неделя/Дата</th>
                <th className="pb-2 text-right font-medium">Слова</th>
                <th className="pb-2 text-right font-medium">Задания</th>
                <th className="pb-2 text-right font-medium">Минуты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {progressData.map((point) => (
                <tr key={point.week}>
                  <td className="py-2 text-left text-gray-700">{point.week}</td>
                  <td className="py-2 text-right text-gray-700">{point.words}</td>
                  <td className="py-2 text-right text-gray-700">{point.tasks}</td>
                  <td className="py-2 text-right text-gray-700">
                    {point.studyMinutes ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Фокус этапа</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              readiness
                ? 'bg-green-100 text-green-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {readiness ? 'Готов к финальному тесту' : 'Ещё немного усилий'}
          </span>
        </div>

        <ul className="space-y-2">
          {requirementChecks.map((check) => (
            <li
              key={check.requirement.id}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                check.met
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              {check.message}
            </li>
          ))}
        </ul>
      </section>

      {achievements.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Достижения</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <li
                key={`${achievement.type}-${achievement.title}`}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <p className="text-sm font-semibold text-gray-900">{achievement.title}</p>
                {achievement.description && (
                  <p className="mt-1 text-sm text-gray-500">{achievement.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}


