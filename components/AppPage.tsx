'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, useSubscription, useHasyx } from 'hasyx';
import { useModalStore } from '@/store/modalStore';
import { useRitualStore } from '@/store/ritualStore';
import { ModalContainer } from './app/Modal/Modal';
import { LevelTestModal } from './app/LevelTestModal';

import { OAuthButtons } from 'hasyx/components/auth/oauth-buttons';
import { RitualScreen } from './app/RitualScreen';
import { Header } from './app/Header';
import { Navigation } from './app/Navigation';
import { DashboardTab } from './app/dashboard/DashboardTab';
import type { TaskView as DashboardTask } from './app/dashboard/DashboardTab';
import { VocabularyTab } from './app/vocabulary/VocabularyTab';
import { AIPracticeTab } from './app/ai/AIPracticeTab';
import { SpeakingRolePlayTab } from './app/ai/SpeakingRolePlayTab';
import { VoiceMessagesTab } from './app/ai/VoiceMessagesTab';
import { ProgressTab } from './app/progress/ProgressTab';
import { IrregularVerbsScreen } from './app/verbs/IrregularVerbsScreen';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAISession } from '@/hooks/useAISession';

type VocabularyCardRaw = {
  id: string;
  word: string;
  translation: string;
  example_sentence?: string | null;
  next_review_date?: string | null;
  difficulty?: string | null;
};

type ProgressMetricRaw = {
  date: string;
  words_learned: number;
  tasks_completed: number;
  study_minutes?: number | null;
};

type PlanTask = DashboardTask & {
  stage_id?: string | null;
  task_date?: string | null;
};

type PlanAchievement = {
  id?: string;
  type: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  unlocked_at?: string;
};

export default function EnglishLearningApp() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const [activeTab, setActiveTab] = useState('dashboard');
  const { ritualCompleted, completeRitual } = useRitualStore();

  const { data: dashboard, isLoading, error, completeTask, regeneratePlan, refresh, refreshRequirementChecks, refreshProgressMetrics } = useDashboardData(
    userId,
    { autoRefresh: false }
  );

  // Убрали автоматическое обновление - обновляем только при явных действиях пользователя

  const tasks = useMemo<PlanTask[]>(() => {
    return (dashboard?.plan?.tasks ?? []) as PlanTask[];
  }, [dashboard?.plan?.tasks]);

  const todayMinutes = useMemo(() => {
    return tasks
      .filter((task) => task.status === 'completed')
      .reduce((sum, task) => sum + (task.duration_minutes ?? 0), 0);
  }, [tasks]);

  const goalMinutes = dashboard?.user?.daily_goal_minutes ?? 40;

  const vocabularyCards = useMemo(() => {
    const cards = (dashboard?.vocabularyCards ?? []) as VocabularyCardRaw[];
    return cards.map((card) => ({
      id: card.id,
      word: card.word,
      translation: card.translation,
      exampleSentence: card.example_sentence,
      nextReview: card.next_review_date,
      difficulty: card.difficulty,
    }));
  }, [dashboard?.vocabularyCards]);

  const progressData = useMemo(() => {
    const metrics = (dashboard?.progressMetrics ?? []) as ProgressMetricRaw[];
    return metrics.map((metric) => ({
      week: metric.date,
      words: metric.words_learned,
      tasks: metric.tasks_completed,
      studyMinutes: metric.study_minutes ?? undefined,
    }));
  }, [dashboard?.progressMetrics]);

  const achievements = useMemo<PlanAchievement[]>(() => {
    return (dashboard?.plan?.achievements ?? []) as PlanAchievement[];
  }, [dashboard?.plan?.achievements]);

  const userName = dashboard?.user?.name ?? session?.user?.name ?? 'Ученик';
  const currentLevel = dashboard?.user?.current_level ?? null;
  const targetLevel = dashboard?.user?.target_level ?? 'B2';
  
  // Подписка на стрик через useSubscription для автоматического обновления
  const hasyx = useHasyx();
  const { data: streakData } = useSubscription({
    table: 'streaks',
    where: userId ? { user_id: { _eq: userId } } : undefined,
    returning: ['current_streak', 'longest_streak', 'last_activity_date'],
    limit: 1,
  });
  
  // Получаем стрик из подписки или из dashboard (fallback)
  const streakFromSubscription = Array.isArray(streakData) 
    ? streakData[0]?.current_streak ?? 0 
    : streakData?.current_streak ?? 0;
  const streak = streakFromSubscription || (dashboard?.plan?.streak?.current_streak ?? 0);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [levelTestShown, setLevelTestShown] = useState(false);
  const [selectedAiTaskId, setSelectedAiTaskId] = useState<string | null>(null);
  const [targetWords, setTargetWords] = useState<string[]>([]);

  const primaryAiTask = useMemo<PlanTask | null>(() => {
    if (selectedAiTaskId) {
      const selected = tasks.find((task) => String(task.id) === selectedAiTaskId);
      if (selected) {
        return selected;
      }
    }
    return tasks.find((task) => task.ai_enabled) ?? null;
  }, [selectedAiTaskId, tasks]);

  // Загружаем targetWords из задачи
  useEffect(() => {
    if (!primaryAiTask) {
      setTargetWords([]);
      return;
    }

    const loadTargetWords = async () => {
      try {
        // Сначала проверяем type_specific_payload
        const payload = primaryAiTask.type_specific_payload as Record<string, any> | undefined;
        if (payload?.lesson_materials?.targetWords) {
          setTargetWords(payload.lesson_materials.targetWords);
          return;
        }
        if (payload?.targetWords) {
          setTargetWords(payload.targetWords);
          return;
        }

        // Если нет в payload, загружаем через API
        const response = await fetch(`/api/lesson/task?taskId=${primaryAiTask.id}`);
        if (response.ok) {
          const taskData = await response.json();
          const taskPayload = taskData.type_specific_payload as Record<string, any> | undefined;
          if (taskPayload?.lesson_materials?.targetWords) {
            setTargetWords(taskPayload.lesson_materials.targetWords);
            return;
          }
          if (taskPayload?.targetWords) {
            setTargetWords(taskPayload.targetWords);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to load targetWords:', error);
      }
      setTargetWords([]);
    };

    loadTargetWords();
  }, [primaryAiTask]);

  const aiContextMessage = useMemo(() => {
    const rawContext = primaryAiTask?.ai_context;
    if (
      rawContext &&
      typeof rawContext === 'object' &&
      'context' in rawContext &&
      typeof (rawContext as { context?: unknown }).context === 'string'
    ) {
      return {
        role: 'assistant' as const,
        content: (rawContext as { context: string }).context,
        timestamp: new Date().toISOString(),
      };
    }
    return undefined;
  }, [primaryAiTask?.ai_context]);

  const aiSessionType = useMemo(
    () => (primaryAiTask?.type as 'speaking' | 'writing' | 'ai_practice') ?? 'ai_practice',
    [primaryAiTask?.type]
  );

  const aiSessionTopic = useMemo(
    () => primaryAiTask?.title ?? dashboard?.plan?.focus?.[0] ?? 'Практика',
    [primaryAiTask?.title, dashboard?.plan?.focus]
  );

  const aiInitialMessages = useMemo(
    () => (aiContextMessage ? [aiContextMessage] : []),
    [aiContextMessage]
  );

  const {
    messages: aiMessages,
    isLoading: isAISessionLoading,
    startSession,
    sendMessage,
    hasSession,
  } = useAISession({
    userId,
    type: aiSessionType,
    topic: aiSessionTopic,
    level: currentLevel,
    initialMessages: aiInitialMessages,
    suggestedPrompt: primaryAiTask?.suggested_prompt ?? null,
  });

  useEffect(() => {
    if (primaryAiTask && !hasSession) {
      startSession();
    }
  }, [primaryAiTask, hasSession, startSession]);

  // Обновляем requirementChecks при возврате на dashboard после завершения урока
  useEffect(() => {
    if (activeTab === 'dashboard' && refreshRequirementChecks) {
      // Небольшая задержка, чтобы дать время БД обновиться после завершения урока
      const timer = setTimeout(() => {
        refreshRequirementChecks();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, refreshRequirementChecks]);

  useEffect(() => {
    if (!selectedAiTaskId) {
      return;
    }
    const stillExists = tasks.some((task) => String(task.id) === selectedAiTaskId);
    if (!stillExists) {
      setSelectedAiTaskId(null);
    }
  }, [selectedAiTaskId, tasks]);

  // Предотвращаем обновления при переключении вкладок
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleVisibilityChange = () => {
      // Когда вкладка становится видимой, не обновляем данные автоматически
      // Данные будут обновлены только при явных действиях пользователя
      if (document.hidden) {
        // Вкладка скрыта - ничего не делаем
        return;
      }
      // Вкладка стала видимой - но не обновляем автоматически
      // Это предотвращает ненужные обновления при переключении вкладок
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Показываем модальное окно теста, если уровень не определен
  useEffect(() => {
    // Не показываем модальное окно, если показывается RitualScreen
    if (!ritualCompleted) return;

    // Проверяем условия для показа модального окна
    const shouldShowModal = 
      userId &&
      !levelTestShown &&
      (currentLevel === null || currentLevel === undefined || currentLevel === '') &&
      !isLoading;

    if (shouldShowModal) {
      console.log('[AppPage] Showing level test modal', { userId, currentLevel, isLoading });
      setLevelTestShown(true);
      const modalId = openModal({
        component: (
          <LevelTestModal
            userId={userId}
            onComplete={(level) => {
              // Закрываем модальное окно
              closeModal(modalId);
              // Обновляем данные после сохранения уровня
              void regeneratePlan();
            }}
            onSkip={() => {
              // При пропуске тоже показываем модальное окно для ручного ввода
              // (это уже обрабатывается внутри LevelTestModal)
            }}
          />
        ),
        closeOnOverlayClick: false,
      });
    }
  }, [userId, currentLevel, isLoading, levelTestShown, ritualCompleted, openModal, closeModal, regeneratePlan]);

  const handleCompleteTask = (taskId: string | number) => {
    completeTask(String(taskId));
  };

  const handleStartAITask = (task?: DashboardTask) => {
    if (task?.id) {
      setSelectedAiTaskId(String(task.id));
    }
    setActiveTab('ai');
    startSession();
  };

  const handleSendAIMessage = async (message: string) => {
    await sendMessage(message);
  };


  // Показываем загрузку, пока сессия загружается
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Показываем экран авторизации только если точно не авторизован
  if (status === 'unauthenticated' || !userId) {
    const callbackUrl = '/';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Добро пожаловать!</h1>
            <p className="text-gray-600">
              Пожалуйста, авторизуйтесь, чтобы увидеть персональный план занятий.
            </p>
          </div>
          <OAuthButtons {...({ callbackUrl } as any)} />
        </div>
      </div>
    );
  }

  // Показываем ритуал, если он еще не завершен
  if (!ritualCompleted) {
    return <RitualScreen onComplete={completeRitual} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModalContainer />
      <Header userName={userName} streak={streak} />
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => {
          void regeneratePlan();
        }}
        onLevelTest={() => {
          const modalId = openModal({
            component: (
              <LevelTestModal
                userId={userId!}
                onComplete={(level) => {
                  closeModal(modalId);
                  void regeneratePlan();
                }}
                onSkip={() => {}}
              />
            ),
            closeOnOverlayClick: false,
          });
        }}
        isLoading={isLoading}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            loading={isLoading}
            userName={userName}
            currentLevel={currentLevel ?? 'A2'}
            targetLevel={targetLevel}
            todayMinutes={todayMinutes}
            goalMinutes={goalMinutes}
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onStartAITask={handleStartAITask}
            planSummary={dashboard?.plan?.summary ?? ''}
            planFocus={dashboard?.plan?.focus ?? []}
            requirementChecks={dashboard?.plan?.requirementChecks ?? []}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyTab
            loading={isLoading}
            cards={vocabularyCards}
            dueToday={dashboard?.plan?.vocabulary?.dueToday ?? vocabularyCards.length}
          />
        )}

        {activeTab === 'ai' && (() => {
          const isSpeaking = primaryAiTask?.type === 'speaking';
          const isVoiceMessages = primaryAiTask?.type === 'ai_practice' && 
            (primaryAiTask?.title?.toLowerCase().includes('запись голосовых сообщений') ||
             primaryAiTask?.title?.toLowerCase().includes('голос') ||
             primaryAiTask?.description?.toLowerCase().includes('голос'));

          if (isSpeaking) {
            return (
              <SpeakingRolePlayTab
                topic={primaryAiTask?.title ?? 'Ролевая игра'}
                messages={aiMessages.map(({ role, content }) => ({ role, content }))}
                isLoading={isAISessionLoading}
                suggestedPrompt={
                  primaryAiTask?.suggested_prompt ??
                  ((primaryAiTask?.type_specific_payload as { recommended_prompt?: string } | undefined)
                    ?.recommended_prompt ??
                    null)
                }
                targetWords={targetWords}
                taskId={primaryAiTask?.id ? String(primaryAiTask.id) : undefined}
                userId={userId ?? undefined}
                refreshRequirementChecks={refreshRequirementChecks}
                refreshProgressMetrics={refreshProgressMetrics}
                onSendMessage={handleSendAIMessage}
                onComplete={() => {
                  setActiveTab('dashboard');
                  setSelectedAiTaskId(null);
                }}
              />
            );
          }

          if (isVoiceMessages) {
            return (
              <VoiceMessagesTab
                topic={primaryAiTask?.title ?? 'Запись голосовых сообщений'}
                messages={aiMessages.map(({ role, content }) => ({ role, content }))}
                isLoading={isAISessionLoading}
                suggestedPrompt={
                  primaryAiTask?.suggested_prompt ??
                  ((primaryAiTask?.type_specific_payload as { recommended_prompt?: string } | undefined)
                    ?.recommended_prompt ??
                    null)
                }
                targetWords={targetWords}
                taskId={primaryAiTask?.id ? String(primaryAiTask.id) : undefined}
                userId={userId ?? undefined}
                refreshRequirementChecks={refreshRequirementChecks}
                refreshProgressMetrics={refreshProgressMetrics}
                onSendMessage={handleSendAIMessage}
                onComplete={() => {
                  setActiveTab('dashboard');
                  setSelectedAiTaskId(null);
                }}
              />
            );
          }

          return (
            <AIPracticeTab
              topic={primaryAiTask?.title ?? 'Практика с AI'}
              messages={aiMessages.map(({ role, content }) => ({ role, content }))}
              isLoading={isAISessionLoading}
              suggestedPrompt={
                primaryAiTask?.suggested_prompt ??
                ((primaryAiTask?.type_specific_payload as { recommended_prompt?: string } | undefined)
                  ?.recommended_prompt ??
                  null)
              }
              onSendMessage={handleSendAIMessage}
            />
          );
        })()}

        {activeTab === 'progress' && (
          <ProgressTab
            loading={isLoading}
            progressData={progressData}
            achievements={achievements}
            readiness={dashboard?.plan?.readiness ?? false}
            requirementChecks={dashboard?.plan?.requirementChecks ?? []}
          />
        )}

        {activeTab === 'verbs' && <IrregularVerbsScreen />}
      </main>
    </div>
  );
}
