'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Radar, PolarArea } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

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
  const radarChartData = useMemo(() => {
    if (progressData.length === 0) return null;

    const colors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ];

    const borderColors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ];

    return {
      labels: ['Слова', 'Задания', 'Минуты'],
      datasets: progressData.map((point, index) => ({
        label: point.week,
        data: [
          point.words,
          point.tasks,
          point.studyMinutes ?? 0,
        ],
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 2,
        pointBackgroundColor: borderColors[index % borderColors.length],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColors[index % borderColors.length],
      })),
    };
  }, [progressData]);

  const polarAreaChartData = useMemo(() => {
    if (progressData.length === 0) return null;

    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];

    // Суммируем все метрики для каждой недели
    return {
      labels: progressData.map((point) => point.week),
      datasets: [
        {
          label: 'Общий прогресс',
          data: progressData.map((point) => 
            point.words + point.tasks + (point.studyMinutes ?? 0)
          ),
          backgroundColor: colors.slice(0, progressData.length),
        },
      ],
    };
  }, [progressData]);

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
          <div className="mt-4 space-y-6">
            {/* Radar Chart - показывает все метрики для каждой недели */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Сравнение метрик по неделям
              </h3>
              <div className="flex justify-center">
                <div className="h-96 w-full max-w-2xl">
                  <Radar
                    data={radarChartData!}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.r;
                              const metric = context.label;
                              return `${label}: ${metric} - ${value}`;
                            },
                          },
                        },
                      },
                      scales: {
                        r: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Polar Area Chart - показывает общий прогресс по неделям */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Общий прогресс по неделям
              </h3>
              <div className="flex justify-center">
                <div className="h-96 w-full max-w-md">
                  <PolarArea
                    data={polarAreaChartData!}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                              const value = context.parsed;
                              return `${label}: ${value}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Таблица для детального просмотра */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700">Детальная статистика</h3>
              <table className="w-full table-fixed text-sm">
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
            </div>
          </div>
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


