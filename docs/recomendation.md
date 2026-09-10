Для PWA на TanStack Start с оффлайн-режимом на iPhone/iPad я бы рекомендовал такую комбинацию:

- **IndexedDB** как основное хранилище (через библиотеку-обёртку);  
- **Cache Storage API** для статики и API-ответов (через Workbox или ручной service worker);  
- **localStorage** только для совсем мелких вещей (флаги, токены, настройки).

Из библиотек для IndexedDB на iOS/iPadOS сейчас оптимальны:

- **idb-keyval** — если нужно простое ключ-значение хранилище;  
- **Dexie.js** — если нужна полноценная БД с таблицами, индексами, запросами.

Ниже — подробнее, что и когда выбирать.

***

## 1. Особенности iOS/iPadOS для PWA

Важно понимать ограничения Safari / WebKit (на которых работает PWA на iOS/iPad):

- **IndexedDB поддерживается**, но:
  - на старых iOS были баги и ограничения по размеру;  
  - на современных (iOS 15+) всё вполне юзабельно, но всё равно стоит тестировать.  
- **Cache Storage API** поддерживается и используется для оффлайн-кэша service worker’а.  
- **localStorage**:
  - имеет небольшой лимит (~5–10 МБ);  
  - синхронный, не подходит для больших объёмов.  
- **Фоновая синхронизация (Background Sync)** в Safari/PWA **не поддерживается**.  
  - Значит, оффлайн-операции нужно:
    - сохранять локально;  
    - синхронизировать при следующем открытии/онлайне (через обычный fetch с очередью в IndexedDB).

***

## 2. IndexedDB vs localStorage vs другие

### IndexedDB

**Плюсы:**

- Асинхронный, не блокирует UI.  
- Большие лимиты (сотни МБ, на практике для PWA обычно достаточно).  
- Поддерживает:
  - таблицы (object stores);  
  - индексы;  
  - транзакции;  
  - сложные запросы.  

**Минусы:**

- API низкоуровневый и многословный.  
- На iOS в прошлом были баги (сейчас лучше, но всё равно стоит проверять на целевых версиях).

**Когда использовать:**

- Основное оффлайн-хранилище для:
  - словарных карточек;  
  - состояния SRS (FSRS);  
  - прогресса, истории повторений;  
  - кэша уроков, заданий, результатов.

### localStorage

**Плюсы:**

- Очень простой API.  
- Поддерживается везде.

**Минусы:**

- Синхронный, блокирует поток.  
- Маленький лимит.  
- Только строки (нужно сериализовать JSON).

**Когда использовать:**

- Мелкие настройки:
  - `instructionLanguage`;  
  - флаги типа «tutorial completed»;  
  - токены/сессии (если не используешь более безопасное хранилище).  

Не подходит для основного оффлайн-контента.

### Другие варианты

- **sql.js / WASM-SQLite**:
  - Если очень хочется SQL прямо в браузере.  
  - Но для PWA на iOS это обычно оверхед: больше размер, сложнее синхронизация, нет явных преимуществ перед IndexedDB.  
- **OPFS (Origin Private File System)**:
  - Пока поддержка в Safari/PWA ограничена;  
  - Не стоит полагаться на него как на основное хранилище для iOS.  

***

## 3. idb-keyval vs Dexie.js vs «голый» IndexedDB

### «Голый» IndexedDB

- Можно использовать напрямую, но API очень многословный.  
- Для проекта, где ты и так строишь сложную логику (SRS, AI, методология), это лишняя когнитивная нагрузка.  

**Рекомендация:** использовать обёртку.

### idb-keyval

- Очень простая библиотека:  
  - хранилище «ключ → значение».  
  - `set(key, value)`, `get(key)`, `del(key)`, `keys()`.  
- Работает поверх IndexedDB, но скрывает почти всю сложность.  
- Маленький размер, нет зависимостей.

**Плюсы:**

- Идеально для:
  - простых структур: `userId → профиль`, `settings → объект`, `cache:lesson:<id> → JSON урока`.  
  - очередей оффлайн-операций (массив задач на синхронизацию).  

**Минусы:**

- Нет таблиц, индексов, сложных запросов.  
- Если захочешь искать «все due-карточки пользователя», придётся либо:
  - хранить всё в одном большом объекте (неудобно);  
  - либо самому индексировать (фактически писать свою мини-БД).

**Когда выбирать:**

- Если оффлайн-данные — это в основном:
  - кэш уроков/карточек по ID;  
  - очередь действий;  
  - простые ключ-значение структуры.  

### Dexie.js

- Полноценная обёртка над IndexedDB с приятным API.  
- Поддерживает:
  - таблицы (object stores);  
  - индексы;  
  - запросы с фильтрацией, сортировкой;  
  - транзакции.  

**Плюсы:**

- Очень удобный API, похожий на LINQ/Query-стиль.  
- Хорошая документация, активная поддержка.  
- Отлично подходит для:
  - словаря с индексами по `userId`, `due`, `itemType`;  
  - SRS-состояний;  
  - истории повторений;  
  - сложных запросов (например, «все слабые глаголы пользователя»).  

**Минусы:**

- Больше размер, чем у idb-keyval (но для PWA это обычно не критично).  
- Чуть сложнее, но всё равно намного проще, чем «голый» IndexedDB.

**Когда выбирать:**

- Если тебе нужны:
  - таблицы и индексы;  
  - запросы типа:
    - `where('userId').equals(uid).and('due').below(now)`;  
    - `orderBy('difficulty').reverse().limit(20)`;  
  - нормальная схема БД с версионированием и миграциями.

***

## 4. Что я бы использовал в твоём приложении

Учитывая, что у тебя:

- приложение для изучения языка с:
  - словарём, глаголами, карточками;  
  - SRS (FSRS) состоянием;  
  - уроками, заданиями, историей;  
- TanStack Start + PWA;  
- цель — надёжный оффлайн на iPhone/iPad;

я бы сделал так:

### Основное оффлайн-хранилище: **Dexie.js + IndexedDB**

Создать отдельный модуль, например `src/db/offline-db.ts`:

```ts
import Dexie, { Table } from 'dexie';

export interface VocabularyCard {
  id: string;          // UUID
  userId: string;
  word: string;
  translation?: string;
  example?: string;
  pos?: string;
  // FSRS-состояние можно хранить либо здесь, либо в отдельной таблице
  difficulty?: number;
  stability?: number;
  retrievability?: number;
  nextReviewAt?: number; // timestamp
  lastReviewAt?: number;
  reps?: number;
}

export interface SrsState {
  id: string;          // UUID строки состояния
  userId: string;
  itemType: 'vocabulary_card' | 'verb' | 'lesson_flashcard';
  itemId: string;
  difficulty: number;
  stability: number;
  retrievability: number;
  nextReviewAt: number;
  lastReviewAt?: number;
  reps: number;
  lapses?: number;
}

export interface ReviewHistoryItem {
  id: string;
  userId: string;
  itemType: string;
  itemId: string;
  rating: number;
  responseTimeMs?: number;
  createdAt: number;
}

export interface OfflineQueueItem {
  id: string;
  type: 'review' | 'lesson_complete' | 'vocab_add' | string;
  payload: any;
  createdAt: number;
  synced: boolean;
}

class OfflineDatabase extends Dexie {
  vocabularyCards!: Table<VocabularyCard, string>;
  srsStates!: Table<SrsState, string>;
  reviewHistory!: Table<ReviewHistoryItem, string>;
  offlineQueue!: Table<OfflineQueueItem, string>;

  constructor() {
    super('LisEngOfflineDB');
    this.version(1).stores({
      vocabularyCards: 'id, userId, word',
      srsStates: 'id, userId, [userId+itemType+itemId], [userId+nextReviewAt], [userId+itemType+nextReviewAt]',
      reviewHistory: 'id, userId, [userId+createdAt], itemType, itemId',
      offlineQueue: 'id, [userId+synced], createdAt',
    });
  }
}

export const db = new OfflineDatabase();
```

Так ты получишь:

- нормальные индексы под:
  - `userId`;  
  - `nextReviewAt` (для due-карточек);  
  - комбинированные индексы `userId+itemType+nextReviewAt`.  
- Удобные запросы:

  ```ts
  // Все due-карточки пользователя
  const dueCards = await db.srsStates
    .where('[userId+nextReviewAt]')
    .between([userId, Date.now()], [userId, Date.now()], false, true)
    .toArray();

  // Слабые глаголы
  const weakVerbs = await db.srsStates
    .where('userId')
    .equals(userId)
    .filter(s => s.difficulty > 7 || s.retrievability < 0.8)
    .toArray();
  ```

Это идеально ложится на твою FSRS-архитектуру и SRS-слой.

### Кэш статики и API: **Cache Storage + Workbox (или ручной SW)**

Для PWA на TanStack Start:

- Настроить service worker (через Vite PWA plugin / Workbox или вручную).  
- Кэшировать:
  - статику (JS, CSS, шрифты, иконки);  
  - критичные API-ответы (например, план, уроки, словари) с стратегией:
    - `CacheFirst` для статики;  
    - `StaleWhileRevalidate` или `NetworkFirst` для API.  

На iOS это даст:

- быструю загрузку при повторном открытии;  
- базовый оффлайн для статики и закэшированных данных.

### Очередь оффлайн-операций: **Dexie (таблица `offlineQueue`)**

- Все действия, которые нужно отправить на сервер (review, complete lesson, add word):
  - сохранять в `offlineQueue` с флагом `synced: false`;  
  - при появлении онлайна:
    - проходить по очереди и отправлять на сервер;  
    - помечать как `synced: true` или удалять.  

Это компенсирует отсутствие Background Sync на iOS.

### idb-keyval — где может пригодиться

- Для очень простых вещей:
  - кэш последних настроек;  
  - флаг `hasSeenOnboarding`;  
  - временные данные, которые не требуют запросов/индексов.  

Но для основного оффлайн-контента (карточки, SRS, история) я бы использовал Dexie.

***

## 5. Специфика iOS/iPad и PWA

Что стоит учесть:

1. **Тестировать на реальных устройствах**  
   - iOS Safari → «Add to Home Screen» → открыть как PWA.  
   - Проверять:
     - работу IndexedDB (Dexie);  
     - service worker и кэш;  
     - поведение при переключении оффлайн/онлайн.

2. **Очищение данных пользователем**  
   - На iOS пользователь может:
     - удалить сайт из «Настройки → Safari → Данные сайтов»;  
     - удалить PWA с домашнего экрана.  
   - Значит:
     - всё важное должно синхронизироваться с сервером;  
     - локальное хранилище — кэш + буфер, а не единственный источник истины.

3. **Размер хранилища**  
   - IndexedDB на iOS обычно даёт сотни МБ, но:
     - не стоит хранить там огромные объёмы медиа;  
     - для аудио/видео лучше кэшировать через Cache Storage или загружать по требованию.

***

## 6. Итоговая рекомендация

Для твоего приложения:

- **Основное оффлайн-хранилище:**  
  - **Dexie.js + IndexedDB**  
  - Таблицы: `vocabularyCards`, `srsStates`, `reviewHistory`, `offlineQueue` (и другие по необходимости).  

- **Кэш статики/API:**  
  - **Cache Storage API** через service worker (Workbox или вручную).  

- **Простые ключ-значение данные:**  
  - Можно **idb-keyval** или даже `localStorage`, если объём маленький.  

- **Не использовать:**  
  - только localStorage для основного контента;  
  - sql.js/WASM-БД без явной необходимости;  
  - OPFS как основное хранилище на iOS (пока поддержка слабая).
