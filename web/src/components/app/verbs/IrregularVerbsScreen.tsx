
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useIrregularVerbsData } from '@/hooks/useIrregularVerbsData';
import { useVerbProgress } from '@/hooks/useVerbProgress';
import { VerbCard } from './VerbCard';
import { VerbTrainer } from './VerbTrainer';
import { Button } from '../Buttons/Button';
import { useModalStore } from '@/store/modalStore';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';
import { invalidateVerbQueries } from '@/lib/query-keys';
import { useSession } from '@/lib/compat/hasyx';

type ViewMode = 'list' | 'practice';

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

function isDue(verb: VerbWithProgress) {
  if (!verb.progress || verb.progress.mastered) return false;
  return verb.progress.next_review_date <= todayIso();
}

function isWeak(verb: VerbWithProgress) {
  const progress = verb.progress;
  if (!progress || progress.mastered) return false;
  return progress.incorrect_count > 0 && progress.repetitions < 5;
}

export function IrregularVerbsScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [packBusy, setPackBusy] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { verbs, groups, isLoading, error, refresh } = useIrregularVerbsData({
    includeProgress: true,
    includeExamples: true,
  });

  const { progress, weakVerbs } = useVerbProgress();

  const filteredVerbs = useMemo(() => {
    if (selectedGroup) {
      return verbs.filter((v) => v.group_number === selectedGroup);
    }
    return verbs;
  }, [verbs, selectedGroup]);

  const verbsForReview = useMemo(() => {
    const due = verbs.filter(isDue);
    const weakDue = due.filter(isWeak);
    const restDue = due.filter((verb) => !isWeak(verb));
    return [...weakDue, ...restDue];
  }, [verbs]);

  const handleRefresh = async () => {
    await invalidateVerbQueries(queryClient, userId);
    refresh();
  };

  const handleOpenVerbCard = (verb: VerbWithProgress, e: React.MouseEvent<HTMLDivElement>) => {
    const clickPosition = { x: e.clientX, y: e.clientY };
    const modalId = openModal({
      clickPosition,
      closeOnOverlayClick: true,
      component: (
        <VerbCard
          verb={verb}
          onRequestClose={() => closeModal(modalId)}
          onAddToQueue={async () => {
            await handleRefresh();
          }}
        />
      ),
    });
  };

  const addDailyPack = async () => {
    setPackBusy(true);
    try {
      await fetch('/api/verbs/daily-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 4 }),
      });
      await handleRefresh();
    } finally {
      setPackBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Загрузка глаголов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Ошибка: {error}</p>
      </div>
    );
  }

  if (viewMode === 'practice' && verbsForReview.length > 0) {
    return (
      <VerbTrainer
        verbs={verbsForReview}
        onComplete={() => {
          setViewMode('list');
          void handleRefresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Прогресс по группам</h2>
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.group_number} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Группа {group.group_number}
                </span>
                <span className="text-gray-500">
                  {group.learned} / {group.total} ({group.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${group.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {progress && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Общая статистика</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{progress.learnedVerbs}</p>
              <p className="text-sm text-gray-500">В изучении</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600" title="5 верных подряд и интервал ≥ 30 дней">
                {progress.masteredVerbs}
              </p>
              <p className="text-sm text-gray-500">Освоено</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{progress.weakVerbs}</p>
              <p className="text-sm text-gray-500">Слабые места</p>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => setViewMode('practice')}
          disabled={verbsForReview.length === 0}
          variant="default"
          className="flex-1"
        >
          {verbsForReview.length > 0
            ? `Тренировка (${verbsForReview.length} на сегодня)`
            : 'Нет глаголов на сегодня'}
        </Button>
        <Button
          onClick={() => void addDailyPack()}
          disabled={packBusy}
          variant="outline"
          className="flex-1"
        >
          {packBusy ? 'Добавляем…' : 'На сегодня: 3–5 глаголов'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedGroup(undefined)}
          variant={selectedGroup === undefined ? 'default' : 'outline'}
          size="sm"
        >
          Все группы
        </Button>
        {[1, 2, 3, 4, 5, 6].map((groupNum) => {
          const group = groups.find((g) => g.group_number === groupNum);
          return (
            <Button
              key={groupNum}
              onClick={() => setSelectedGroup(groupNum)}
              variant={selectedGroup === groupNum ? 'default' : 'outline'}
              size="sm"
            >
              Группа {groupNum} {group ? `(${group.learned}/${group.total})` : ''}
            </Button>
          );
        })}
      </div>

      {weakVerbs.length > 0 && (
        <p className="text-sm text-amber-700">
          Слабые сейчас: {weakVerbs.map((verb) => verb.infinitive).join(', ')}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Список глаголов
          <span className="ml-2 text-sm font-normal text-gray-500">
            {filteredVerbs.length} из {verbs.length}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVerbs.map((verb) => (
            <div
              key={verb.id}
              onClick={(e) => handleOpenVerbCard(verb, e)}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{verb.infinitive}</h3>
                  {verb.group_number && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Группа {verb.group_number}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {verb.past_simple} — {verb.past_participle}
                </p>
                {verb.meaning_ru && (
                  <p className="text-xs text-gray-500 mb-1">{verb.meaning_ru}</p>
                )}
                {verb.progress && (
                  <div className="mt-2 text-xs text-gray-500">
                    {verb.progress.mastered ? (
                      <span className="text-green-600">✓ Освоено</span>
                    ) : (
                      <span>
                        В изучении · верно {verb.progress.correct_count} / ошибок {verb.progress.incorrect_count}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
