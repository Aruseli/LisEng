# AI Service Architecture - Рекомендации

## Текущая реализация

Сейчас используется **Anthropic SDK** напрямую через `@anthropic-ai/sdk`. Это хороший выбор, потому что:
- ✅ Простой и понятный API
- ✅ Прямой контроль над запросами
- ✅ Хорошая документация от Anthropic
- ✅ Нет лишних абстракций

## Альтернативы

### 1. Vercel AI SDK (`ai`)

**Плюсы:**
- Унифицированный API для разных провайдеров (Anthropic, OpenAI, Google)
- Встроенная поддержка streaming
- Удобные React hooks (`useChat`, `useCompletion`)
- Хорошая интеграция с Next.js

**Минусы:**
- Документация может быть неинтуитивной (как вы отметили)
- Дополнительный слой абстракции
- Может быть избыточным для простых случаев

**Когда использовать:**
- Если планируете поддерживать несколько AI-провайдеров
- Если нужен streaming для real-time чатов
- Если используете React Server Components активно

### 2. Остаться на Anthropic SDK (рекомендуется)

**Почему это хороший выбор:**
- У вас уже работает
- Простота и прозрачность
- Меньше зависимостей
- Легче отлаживать

**Рекомендация:** Оставайтесь на Anthropic SDK, но улучшите структуру кода.

## Улучшенная архитектура

### Вариант 1: Обертка над Anthropic SDK (рекомендуется)

Создайте унифицированный интерфейс, который можно будет легко заменить:

```typescript
// lib/ai/base-service.ts
export interface AIService {
  generateText(prompt: string, options?: any): Promise<string>;
  generateJSON(prompt: string, schema?: any): Promise<any>;
  chat(messages: Message[], systemPrompt?: string): Promise<string>;
}

// lib/ai/anthropic-service.ts
export class AnthropicAIService implements AIService {
  // Реализация через Anthropic SDK
}

// lib/ai/claude-service.ts (текущий)
// Использует AnthropicAIService внутри
```

### Вариант 2: Гибридный подход

Используйте Anthropic SDK для основной логики, но добавьте Vercel AI SDK только для streaming в чатах:

```typescript
// Для обычных запросов - Anthropic SDK
// Для real-time чатов - Vercel AI SDK с useChat hook
```

## Рекомендация для вашего проекта

**Оставайтесь на Anthropic SDK**, но:

1. **Улучшите структуру** - создайте базовый интерфейс для будущей миграции
2. **Добавьте кэширование** - для часто генерируемого контента
3. **Добавьте retry логику** - для надежности
4. **Добавьте rate limiting** - для контроля расходов

Если в будущем понадобится поддержка других провайдеров или streaming - можно будет легко добавить Vercel AI SDK только для нужных частей.

