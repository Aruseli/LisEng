# Система перехода между этапами обучения

## Обзор

Система автоматически отслеживает прогресс пользователя по этапам и определяет готовность к переходу на следующий этап на основе:
1. Выполненных заданий
2. Выученных слов
3. Повторенных ошибок
4. Средней точности по навыкам
5. Результатов финального теста

## Структура БД

### Новые таблицы

1. **`stage_progress`** - отслеживает прогресс пользователя по каждому этапу
2. **`stage_tests`** - хранит результаты тестов для перехода между этапами
3. **`stage_requirements`** - определяет требования для каждого этапа

### Логика проверки

Используйте `StageProgressionService` из `lib/stage-progression.ts`:

```typescript
import { StageProgressionService } from '@/lib/stage-progression';

// Получить прогресс пользователя по этапу
const progress = await getStageProgress(userId, stageId);

// Получить требования этапа
const requirements = await getStageRequirements(stageId);

// Проверить выполнение требований
const checks = StageProgressionService.checkStageRequirements(
  progress,
  requirements
);

// Проверить готовность к тесту
const readyForTest = StageProgressionService.isReadyForTest(checks);

// Получить процент выполнения
const completion = StageProgressionService.getCompletionPercentage(checks);
```

## Workflow перехода

1. **Пользователь выполняет задания** → обновляется `stage_progress`
2. **Система периодически проверяет требования** → вызывается `checkStageRequirements`
3. **Когда все требования выполнены** → статус меняется на `ready_for_test`
4. **Пользователь проходит финальный тест** → создается запись в `stage_tests`
5. **Если тест пройден** → статус меняется на `test_passed`, пользователь переходит на следующий этап

## Генерация тестов

Используйте API endpoint `/api/stage/generate-test`:

```typescript
const response = await fetch('/api/stage/generate-test', {
  method: 'POST',
  body: JSON.stringify({
    stageId: '...',
    stageName: 'A2 → A2+',
    level: 'A2',
    testType: 'comprehensive' // или 'grammar', 'writing', 'speaking'
  })
});
```

## Настройка требований

Требования настраиваются в таблице `stage_requirements`:

- `tasks_completed` - процент выполненных заданий (например, 80%)
- `words_learned` - минимальное количество выученных слов
- `errors_reviewed` - все ошибки должны быть повторены (0 неповторенных)
- `accuracy_threshold` - минимальная средняя точность (например, 0.75 = 75%)
- `test_passed` - финальный тест должен быть пройден

## Пример использования

```typescript
// В API route или server action
async function checkUserProgress(userId: string, stageId: string) {
  // 1. Получить прогресс
  const progress = await getStageProgressFromDB(userId, stageId);
  
  // 2. Получить требования
  const requirements = await getStageRequirementsFromDB(stageId);
  
  // 3. Проверить
  const checks = StageProgressionService.checkStageRequirements(
    progress,
    requirements
  );
  
  // 4. Обновить статус
  if (StageProgressionService.isReadyForTest(checks)) {
    await updateStageProgressStatus(userId, stageId, 'ready_for_test');
  }
  
  return {
    checks,
    readyForTest: StageProgressionService.isReadyForTest(checks),
    completion: StageProgressionService.getCompletionPercentage(checks),
  };
}
```

