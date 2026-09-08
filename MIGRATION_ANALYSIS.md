# Отчет по миграции: Замена hasyx на TanStack Query и переход с Next.js

## Дата: 2 мая 2026 года
## Архитектор: Senior Fullstack

---

## Введение

Проект **LisEng** в настоящее время использует самописную библиотеку **hasyx** для взаимодействия с Hasura GraphQL. Эта библиотека **больше не поддерживается**, что несет риски безопасности, совместимости и отсутствия исправлений багов.

Цель данного отчета — оценить:
1. Возможность использования **TanStack Query (React Query)** для кэширования и управления серверным состоянием.
2. Сложность и объем работ по вырезанию механик hasyx вместе с **Next.js** и заменой их на **TanStack Start** или **Vite** (SPA-режим).
3. Стратегию миграции с минимальными затратами и рисками.

---

## 1. Анализ текущего использования hasyx

### 1.1. Что делает hasyx?

Библиотека `hasyx` — это TypeScript-клиент поверх Hasura GraphQL Engine, предоставляющий:

- **CRUD-методы**: `select`, `insert`, `update`, `delete` (работа с таблицами и представлениями).
- **Подписки (Subscriptions)**: В текущем коде не замечено активного использования `subscribe`, но инфраструктура есть.
- **Управление аутентификацией**: Интеграция с JWT и сессиями (через `useSession` из hasyx).
- **Генерация типов**: На основе `hasura-schema.json` генерируются валидаторы (Zod) и мутаторы.

### 1.2. Где используется?

**Список файлов, импортирующих `hasyx` или использующих его хуки:**

```text
lib/hasura-queries.ts     — Ядро: CRUD-операции для бизнес-сущностей
lib/stage-progression.ts  — Сервисы проверки этапов
lib/lesson-snapshots/...  — Все сервисы (ShuHaRi, Snapshot, Kaizen, Kumon)
lib/ask.ts                — Интеграция с LLM
hooks/useDashboardData.ts — Хук агрегации данных для главной
hooks/useAISession.ts     — Управление сессией ИИ
hooks/useIrregularVerbs*.ts — Учебные модули
components/AppPage.tsx    — Использует useSession (hasyx)
app/api/*/route.ts        — Серверные роуты (Next.js) для CRON и фоновых задач
```

**Объем:** ~30+ точек интеграции (сервисы, хуки, API-роуты).

---

## 2. Подходит ли TanStack Query для замены hasyx?

### 2.1. Да, идеально для клиента.

**TanStack Query (React Query)** — это не замена GraphQL-клиенту, это **менеджер серверного состояния**. Он отлично работает поверх любого транспорта (REST, GraphQL, RPC).

**Что даст миграция на TanStack Query:**

| Возможность | hasyx | TanStack Query |
|-------------|-------|----------------|
| Кэширование | ❌ (нет) | ✅ (In-memory, автоматическое) |
| Инвалидация | ❌ (ручное) | ✅ (зависимости, мутации) |
| Оптимистичные обновления | ❌ | ✅ (`onMutate`, `rollback`) |
| Фоновый рефреш | ❌ | ✅ (`staleTime`, `refetchInterval`) |
| Пагинация/бесконечный скролл | ❌ | ✅ (`useInfiniteQuery`) |
| SSR (Next.js) | ⚠️ (ручное) | ✅ (из коробки) |
| Дедупликация запросов | ❌ | ✅ (автоматическая) |
| TypeScript | ✅ | ✅ (первоклассная поддержка) |

**Как это будет выглядеть:**

Вместо:
```typescript
// Старый подход (hasyx)
const { data: tasks, loading } = useSelect({
  table: 'daily_tasks',
  where: { user_id: { _eq: userId } }
});
```

Будет:
```typescript
// Новый подход (TanStack Query + GraphQL клиент)
const { data: tasks, isLoading, error } = useQuery({
  queryKey: ['daily_tasks', userId],
  queryFn: () => graphqlClient.request(GET_TASKS, { userId }),
  staleTime: 5 * 60 * 1000, // 5 минут
  refetchOnWindowFocus: true,
});
```

**ГрафQL-клиент для TanStack**:
- **Apollo Client** (классический, тяжелый, но с кэшем нормализованных данных)
- **urql** (легковесный, современный)
- **GraphQL Request** (простой, минималистичный, идеально для Hasura)

**Рекомендация:** `graphql-request` + `TanStack Query` — минимум зависимостей, максимум контроля.

---

### 2.2. А что с сервером (CRON, фоновые задачи)?

Здесь TanStack Query **не подойдет**, так как он клиентский. Для серверных задач (шедулеры, генерация отчетов, очистка старых данных) нужно другое решение:

**Варианты для замены hasyx на сервере:**
1. **tRPC** (если остаетесь в экосистеме TypeScript/Next.js) — типобезопасные RPC-вызовы.
2. **NestJS** (с модулями Hasura/PostgreSQL) — для тяжелых фоновых задач.
3. **Прямые вызовы Hasura API** (через `fetch` с admin-secret) — для CRON-задач (как сейчас и есть в `schedule/`, `events/`).

**Реальность:** В текущем коде (папки `lib/schedule/`, `lib/events/`, `app/api/events/*`) уже используется **прямой вызов REST/GraphQL** Hasura. Это **не требует замены**. Только клиентская часть (хуки, компоненты) нуждается в миграции.

---

## 3. Вырезание Next.js: Стоит ли оно того?

### 3.1. Зачем уходить с Next.js?

**Аргументы «за» (если они есть у заказчика):**
- Упрощение архитектуры (убрать SSR, ISR, App Router vs Pages Router).
- Полный контроль над бандлом (Vite быстрее собирает).
- SPA/PWA фокус (приложение уже работает как PWA, есть `capacitor.config.ts`).

**Но (очень важно):**
Уход с Next.js означает **потерю**:
- SSR (Server-Side Rendering) — важного для SEO и первого экрана.
- ISR (Incremental Static Regeneration).
- API Routes (миддлвары, edge-функции).
- Автоматического code-splitting'а по роутам.
- Оптимизации изображений, шрифтов, скриптов.

**LisEng — это закрытое приложение (языковое обучение) с авторизацией.**
Для таких приложений (dashboards, SaaS, LMS) **Next.js — это огромный плюс**, так как:
- Первый экран грузится быстро (SSR).
- Безопасность (часть логики скрыта на сервере).
- Масштабируемость (edge-функции, кэширование на уровне CDN).

### 3.2. Альтернатива: Остаться на Next.js, но заменить hasyx

Это **самый разумный путь**. Next.js поддерживает TanStack Query из коробки:

```typescript
// app/page.tsx (Next.js 14+)
export default async function Dashboard() {
  // SSR: данные получены на сервере, закэшированы в RSC
  const initialData = await queryClient.getQueryData(['tasks', userId]);

  return <Dashboard initialData={initialData} />;
}

// components/Dashboard.tsx (Клиент)
'use client';
export function Dashboard({ initialData }) {
  const { data } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: fetchTasks,
    initialData,
  });
}
```

**Hydrate TanStack Query на клиенте:**
```typescript
// app/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### 3.3. Сценарий перехода на TanStack Start / Vite (если очень хочется)

Если решение **жесткое** — уйти от Next.js, то:

**Шаг 1. Создать Vite + React + TypeScript проект**
```bash
npm create vite@latest liseng -- --template react-ts
```

**Шаг 2. Установить TanStack Start (или TanStack Query + React Router)**
- TanStack Start — это full-stack фреймворк (аналог Next.js, но от создателей TanStack Query). Он использует Remix-совместимый роутинг.
- Или классика: `Vite + React Router + TanStack Query`.

**Шаг 3. Настроить GraphQL клиент (urql или graphql-request)**
```typescript
// lib/graphql.ts
import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
);
```

**Шаг 4. Миграция хуков (пример для `useDashboardData`)**

```typescript
// Старое (hasyx)
export function useDashboardData(userId: string) {
  const { data, isLoading } = useSelect({ table: 'daily_tasks', where: {...} });
  return { dashboard: data, isLoading };
}

// Новое (TanStack Query)
export function useDashboardData(userId: string) {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const data = await client.request(GET_DASHBOARD_QUERY, { userId });
      return data;
    },
    enabled: !!userId,
  });
}
```

**Шаг 5. Перенести роутинг**
- Из `app/` (Next.js App Router) → в `src/routes` (TanStack Start) или `src/pages` (Vite + React Router).
- Компоненты (`.tsx`) переносятся почти 1 в 1.

**Шаг 6. Убрать Next.js-специфичные вещи**
- `getServerSideProps` → заменить на TanStack Start `loader`.
- `Image` компонент → заменить на обычный `<img>` или `vite-plugin-imagetools`.
- `next/link` → заменить на `@tanstack/react-router` или `react-router Link`.

---

## 4. Оценка сложности и объема работ

| Задача | Оценка (Story Points) | Описание |
|--------|----------------------|----------|
| Анализ и выбор GraphQL клиента (urql/graphql-request) | 2 | Подключение, настройка, TypeScript типы. |
| Создание фасада над GraphQL (замена методов hasyx) | 5 | `select`, `insert`, `update`, `delete` с таким же API. |
| Миграция 20+ хуков (useDashboardData, useAISession и др.) | 8 | Замена вызовов hasyx на TanStack Query. |
| Обновление компонентов (AppPage и др.) | 5 | Исправление багов из-за отсутствия SSR (если уходим с Next.js). |
| Настройка TanStack Query (кэш, инвалидация, retry) | 3 | Глобальный QueryClient, дефолтные настройки. |
| Тестирование (e2e) мигрированных фич | 5 | Cypress/Playwright для проверки, что ничего не сломалось. |
| **Итого (только клиент)** | **~28 SP** | ~2-3 недели для 1 разработчика. |

**Если ПЛЮС переход с Next.js на Vite/TanStack Start:**
| Задача | Оценка |
|--------|--------|
| Настройка Vite, сборка, environment-variables | 2 SP |
| Перенос роутинга и layout'ов | 5 SP |
| Решение проблем с SSR (SEO, первый рендер, мета-теги) | 5 SP |
| Настройка PWA (workbox, offline) | 2 SP |
| **Итого (переход фреймворка)** | **~14 SP** |
| **ОБЩАЯ СЛОЖНОСТЬ (полная миграция)** | **~42 SP (~6 недель)** |

---

## 5. Стратегия миграции (Low-Risk Approach)

Рекомендуется **пошаговая миграция (Strangler Fig Pattern)**, чтобы не сломать работающее приложение.

### Этап 1: Внедрение TanStack Query в текущий Next.js (Без разрыва)
1. Установить `@tanstack/react-query`, `graphql-request`.
2. Создать `QueryClientProvider` в `app/providers.tsx`.
3. **Не трогать старый hasyx**. Начать писать **новые** фичи с использованием TanStack Query.
4. Постепенно рефакторить старые компоненты (хук за хуком).

### Этап 2: Декомиссия hasyx
1. Как только все хуки переписаны — удалить `hasyx` из `package.json`.
2. Удалить `lib/hasura-queries.ts` (заменено на GraphQL-запросы).
3. Убрать `hasyx`-специфичные проверки (middleware, если есть).

### Этап 3: (Опционально) Переход на Vite/TanStack Start
1. Создать параллельное Vite-приложение в подпапке `/new-app`.
2. Постепенно переносить модули туда.
3. Переключить деплой на новый бандл.

**Почему не надо спешить с этапом 3?**
Next.js решает проблему SSR и API Routes. LisEng **уже использует**:
- `app/api/*` (Next.js API Routes) для CRON-задач.
- `getServerSession` для серверной авторизации.
- Оптимизацию бандла (code-splitting по роутам).

Уходя на чистый Vite, вам придется **переписать все `app/api/*` роуты** на:
- Express.js + сервер,
- Либо на TanStack Start (который по сути — переизобретение Next.js).

**Вывод по архитектуре:**
Лучший вариант — **остаться на Next.js, вырезать hasyx, внедрить TanStack Query + GraphQL Code Generator (или graphql-request)**. Это даст 90% пользы (кэш, мутации, типобезопасность) без 42 сп (недель работы) на переписывание фреймворка.

---

## 6. Пример: как выглядела бы новая архитектура

### 6.1. API Layer (GraphQL)

```typescript
// lib/graphql/schema.generated.ts (сгенерировано)
// Можно использовать GraphQL Code Generator для типобезопасности

// lib/graphql/client.ts
import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_URL!,
  {
    headers: () => ({
      Authorization: `Bearer ${getToken()}`,
    }),
  }
);
```

### 6.2. Хуки (Новое поколение)

```typescript
// hooks/useDashboardData.ts (Новый)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/graphql/client';

const GET_DASHBOARD = `
  query GetDashboard($userId: uuid!) {
    daily_tasks(where: { user_id: { _eq: $userId } }) {
      id
      title
      status
    }
    vocabulary_cards(where: { user_id: { _eq: $userId } }) {
      id
      word
    }
  }
`;

export function useDashboardData(userId: string | null) {
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => client.request(GET_DASHBOARD, { userId }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
}

// Мутации
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) =>
      client.request(COMPLETE_TASK_MUTATION, { taskId }),
    onMutate: async (taskId) => {
      // Оптимистичное обновление
      await queryClient.cancelQueries(['dashboard', userId]);
      const previous = queryClient.getQueryData(['dashboard', userId]);
      queryClient.setQueryData(['dashboard', userId], (old) => ({
        ...old,
        daily_tasks: old.daily_tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed' } : t
        ),
      }));
      return { previous };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(['dashboard', userId], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['dashboard', userId]);
    },
  });
}
```

**Преимущества:**
- Автоматический рефреш при фокусе окна.
- Оптимистичные обновления (UI не лагает).
- Кэш живет в памяти (мгновенные переходы между вкладками).
- Retry-политика при ошибках сети.

---

## 7. Финансовая и Временная Оценка

| Сценарий | Время (рабочих дней) | Риски | Ожидаемая выгода |
|----------|----------------------|-------|------------------|
| **Статус-кво** (оставить как есть) | 0 | hasyx мертв, дыры в безопасности, нет кэша | 0 |
| **Внедрить TanStack Query в Next.js** (Рекомендуется) | 14 дней | Низкие (постепенная миграция) | ⭐⭐⭐⭐⭐ (Кэш, SSR, современный стек) |
| **Перейти на Vite + TanStack Start** | 28 дней | Средние (потеря SSR, баги с SEO) | ⭐⭐ (Только если нужно SPA/PWA) |
| **Переписать на чистый REST + Vite** | 40+ дней | Высокие (потеря Hasura, ручные запросы) | ❌ (Нецелесообразно) |

**Рекомендация:** Утвердить вариант **№2 (TanStack Query внутри Next.js)**.
Это:
- Минимизирует риски (приложение остается работоспособным).
- Максимизирует выгоду (полноценное клиентское кэширование).
- Не требует переучивания команды (Next.js остается).
- Позволяет постепенно удалить мертвый код (hasyx).

---

## Резюме

1. **TanStack Query — идеальная замена** для клиентского кэширования вместо самописного hasyx.
2. **Next.js лучше оставить** — он дает SSR, API Routes и масштабируемость, которые критичны для EdTech-продукта.
3. **Полная миграция на Vite/TanStack Start возможна**, но займет **~6 недель** и может сломать фичи, зависящие от серверного рендеринга или API-роутов Next.js.
4. **Оптимальный путь:** постепенная замена hasyx на TanStack Query + `graphql-request` внутри существующей архитектуры Next.js. Это займет ~2 недели и даст прирост производительности и стабильности без рисков большой переписывания.

---

**С уважением,**  
Senior Fullstack Архитектор