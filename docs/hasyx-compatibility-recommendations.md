# Рекомендации по обеспечению совместимости hasyx с обновлениями Next.js

## Проблема

При обновлении Next.js в проекте возникает конфликт типов, потому что:
1. **hasyx** использует Next.js как прямую зависимость (`"next": "15.3.1"` в dependencies)
2. Проект использует обновленную версию Next.js (`"next": "^15.5.7"`)
3. Типы `NextRequest` и `NextResponse` из разных версий Next.js несовместимы
4. Функция `hasyxEvent` типизирована для конкретной версии Next.js

## Решение для hasyx

### 1. Переместить Next.js в peerDependencies

**Файл**: `hasyx/package.json`

**Изменения**:
```json
{
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0",
    "next": "^15.0.0 || ^16.0.0",  // Добавить Next.js как peer dependency
    "zod": "^4.0.15"
  },
  "dependencies": {
    // Убрать "next": "15.3.1" из dependencies
    // Оставить только devDependencies для тестирования
  },
  "devDependencies": {
    "next": "^15.5.7"  // Использовать последнюю безопасную версию для разработки
  }
}
```

**Преимущества**:
- Проект может использовать любую совместимую версию Next.js
- Нет конфликтов версий в node_modules
- Типы берутся из версии Next.js проекта, а не из hasyx

### 2. Обновить типизацию hasyxEvent для гибкости

**Файл**: `hasyx/lib/events/index.ts` (предполагаемый путь)

**Проблема**: `hasyxEvent` использует строгие типы Next.js, которые могут конфликтовать

**Решение**: Использовать более гибкие типы или type parameters

```typescript
// Вместо жесткой типизации:
export function hasyxEvent<T>(
  handler: (payload: HasuraEventPayload) => Promise<T> | T
): (request: NextRequest, context?: any) => Promise<Response> {
  // ...
}

// Использовать более гибкий подход:
export function hasyxEvent<T>(
  handler: (payload: HasuraEventPayload) => Promise<T> | T
): RouteHandler {
  // ...
}

// Или использовать type parameters для совместимости:
export function hasyxEvent<
  TRequest extends { json: () => Promise<any> },
  TResponse extends Response
>(
  handler: (payload: HasuraEventPayload) => Promise<any> | any
): (request: TRequest, context?: any) => Promise<TResponse> {
  // ...
}
```

### 3. Использовать type imports для Next.js типов

**Файл**: `hasyx/lib/events/index.ts`

**Изменения**:
```typescript
// Вместо:
import { NextRequest, NextResponse } from 'next/server';

// Использовать type-only imports:
import type { NextRequest, NextResponse } from 'next/server';

// Это гарантирует, что типы берутся из версии Next.js проекта
```

### 4. Обновить минимальную версию Next.js

**Файл**: `hasyx/package.json`

**Изменения**:
```json
{
  "peerDependencies": {
    "next": "^15.3.6 || ^15.4.8 || ^15.5.7 || ^16.0.7"
  }
}
```

Это гарантирует, что поддерживаются только безопасные версии Next.js после CVE-2025-66478.

### 5. Добавить overrides для тестирования

**Файл**: `hasyx/package.json`

**Изменения**:
```json
{
  "overrides": {
    "zod": "^4.0.15",
    "next": "^15.5.7"  // Для devDependencies и тестов
  }
}
```

## Временное решение в проекте (уже реализовано)

Пока hasyx не обновлен, в проекте используется:

```json
{
  "overrides": {
    "hasyx": {
      "next": "15.5.7"
    }
  }
}
```

Это принудительно использует Next.js 15.5.7 для всех зависимостей hasyx.

## Проверка совместимости

После обновления hasyx проверить:

1. **Типы совместимы**:
   ```bash
   npm run build
   # Не должно быть ошибок типов
   ```

2. **Все функции работают**:
   - `hasyxEvent` работает с обновленными типами Next.js
   - API routes компилируются без ошибок
   - Runtime работает корректно

3. **Нет дублирования Next.js**:
   ```bash
   npm list next
   # Должна быть только одна версия Next.js
   ```

## Рекомендации для будущих обновлений

1. **Всегда использовать peerDependencies** для фреймворков (Next.js, React)
2. **Использовать type-only imports** для типов из peer dependencies
3. **Тестировать с несколькими версиями** Next.js в CI/CD
4. **Документировать поддерживаемые версии** в README hasyx

