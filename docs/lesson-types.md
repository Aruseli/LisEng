# Типы уроков и задания

Система генерирует задания в несколько этапов:

1. **MethodologyAdvisor** (в `lib/lesson-snapshots/methodology-advisor.ts`) анализирует снэпшоты, SM-2 и Shu-Ha-Ri и возвращает «blueprints» с базовой информацией: тип (`grammar`, `listening`, `vocabulary` и т.д.), название, описание, длительность, `aiEnabled`, теги методик и подсказки.
2. Эти blueprints попадают в `daily_tasks`.
3. Когда пользователь открывает урок, `LessonContentService` (`lib/lesson/lesson-content-service.ts`) формирует структуру урока через `generateJSON` (overview, explanation, keyPoints, examples, exercise, readingPassages и т.д.).
4. `LessonScreen` отображает эту структуру и запускает специализированные компоненты (AI-сессия, флэш-карточки, listening, pronunciation и т.д.).

Ниже перечислены основные типы уроков, которые уже поддерживаются (либо готовы к подключению через UI).

## Grammar
- **Источник**: MethodologyAdvisor (problem areas, Shu/Ha/Ri), blueprint тип `grammar`.
- **Что генерится**: 
  - `overview` (описание темы),
  - `explanation` (пошаговое правило),
  - `keyPoints`,
  - `examples` (примеры предложений),
  - `exercise` (шаги и вопросы для закрепления).
- **UI**: текстовые блоки + задания на написание/переписывание правил.

## Vocabulary / Active Recall
- **Источник**: SM-2 (dueToday), problem areas `unknown_word`.
- **Что генерится**:
  - `targetWords`,
  - `exercise` с вопросами на перевод/контекст,
  - `pronunciationScript` для слов (опционально).
- **UI**: FlashcardPractice (флэш-карточки) + PronunciationPractice (если требуется проговаривание). После урока результаты идут в `active_recall_sessions`.

## Listening
- **Источник**: blueprint тип `listening` (например, «Café Order Listening Practice»).
- **Что генерится**:
  - `readingPassages[0].text` – транскрипция диалога,
  - `exercise.steps` – инструкции по прослушиванию,
  - `exercise.questions` – comprehension questions,
  - `pronunciationScript` – IPA для ключевых слов.
- **UI**: общий компонент `ListeningPlayer` (проигрывание аудио/TTS + показ транскрипта) и `PronunciationPractice` для проверки произношения.

## Reading
- **Источник**: blueprint тип `reading`.
- **Что генерится**:
  - `readingPassages` – текст/история,
  - `keyPoints` (сканирование, поиск деталей),
  - `exercise` – comprehension questions.
- **UI**: отдельный блок с текстом и вопросами. Можно использовать TTS для озвучки.

## Writing
- **Источник**: problem areas `writing`, стадию Ha/Ri.
- **Что генерится**:
  - `exercise` – задание (например, «Напиши 5–7 предложений»),
  - критерии оценивания,
  - иногда `examples` с шаблонами.
- **UI**: форма/textarea + отправка в AI-проверку (`/api/ai/check-writing`).

## Speaking (Ролевая игра с голосовым диалогом)
- **Источник**: blueprint тип `speaking`.
- **Что генерируется**:
  - `lesson.overview`, `examples`, `exercise` с подсказками для устной практики,
  - `pronunciationScript` / `targetWords`.
- **UI**: компонент `SpeakingRolePlayTab` с:
  - Голосовым вводом через `useSpeechRecognition`
  - Автоматической транскрипцией через `/api/listening/transcribe`
  - Отправкой транскрипции в AI через `/api/ai/speaking`
  - Автоматическим озвучиванием ответов AI через `useSpeechSynthesis`
  - Отображением и проверкой использования `targetWords`
  - Кнопкой "Завершить урок" с вызовом `/api/lesson/complete`
- **AI Контекст**: AI играет роль друга, отвечает короткими репликами, мягко направляет диалог к использованию целевых слов.
- **Завершение урока**: Сохраняет `conversationData` (messages, targetWordsUsed, sessionDuration) в `lesson_snapshots.content_snapshot.conversation` и обновляет `ai_sessions`.

## AI Practice: Запись голосовых сообщений
- **Источник**: blueprint тип `ai_practice` с названием, содержащим "Запись голосовых сообщений" или "голос".
- **Что генерируется**:
  - `lesson.overview`, `examples`, `exercise` с подсказками для записи голосовых сообщений,
  - `targetWords` для использования в сообщениях.
- **UI**: компонент `VoiceMessagesTab` с:
  - Записью голосовых сообщений через `useSpeechRecognition`
  - Транскрипцией через `/api/listening/transcribe`
  - Анализом через `/api/ai/analyze-voice` с проверкой:
    - Произношения (score, feedback, issues)
    - Использования целевых слов (targetWordsUsed, missingWords, suggestions)
    - Грамматических ошибок
    - Общей оценки и рекомендаций
  - Отображением фидбека для каждого сообщения
  - Визуальной индикацией использованных/неиспользованных targetWords
  - Кнопкой "Завершить урок" с вызовом `/api/lesson/complete`
- **AI Контекст**: AI анализирует голосовые сообщения, проверяет использование каждого целевого слова, дает конструктивный фидбек.
- **Завершение урока**: Сохраняет `voiceMessagesData` (messages с транскрипциями и фидбеком, targetWordsUsed, targetWordsMissing) в `lesson_snapshots.content_snapshot.voiceMessages` и создает `vocabulary_cards` для проблемных слов.

## Pronunciation
- **Источник**: `requiresPronunciation = true` в lesson материалах (targetWords, pronunciationScript).
- **Что генерится**: список слов + IPA/ударение.
- **UI**: компонент `PronunciationPractice` (speech recognition + анализ точности).

## AI Practice (общие задания)
- **Источник**: blueprint тип `ai_practice` или `speaking`.
- **Что генерится**: `exercise.steps`, `examples`, `suggested_prompt`.
- **UI**: `AIPracticeTab` автоматически открывается и использует `useAISession`.

## Дополнительные варианты
- **Problem area review**: MethodologyAdvisor создаёт задания «Разбор ошибки...» по журналу ошибок.
- **Shu/Ha/Ri**: специальные задания «Shu-практика», «Ha-переосмысление», «Ri-творчество».
- **Vocabulary cards generation**: сервис `VocabularyGenerationService` создаёт карточки через AI и SM-2 (для слов из тестов/уроков).

## Выводы
- Все типы уроков используют единую структуру `LessonMaterials`. Для полноценных заданий необходимо отображать:
  - `readingPassages` (текст/диалоги),
  - аудио-плеер (будет вынесен из Level Test),
  - флэш-карточки и AI-практику,
  - поля для ввода/ответа.
- После выполнения урока данные идут в `LessonCompletionService` (snapshot, active recall, kumon progress и т.д.). 

