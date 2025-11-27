import { Hasyx } from 'hasyx';

import { generateJSON } from '@/lib/ai/llm';
import { calculateSM2, initializeSM2 } from '@/lib/lesson-snapshots/sm2-algorithm';
import type { SnapshotInsights } from '@/lib/lesson-snapshots';

interface SnapshotWord {
  word: string;
  context?: string | null;
}

interface GenerateCardsParams {
  userId: string;
  level: string;
  words?: string[];
  snapshotInsights?: SnapshotInsights | null;
  sourceSnapshotId?: string | null;
  context?: string | null;
  contexts?: string[] | null; // Массив контекстов для каждого слова (если передан, используется вместо context)
}

interface ManualWordsParams extends GenerateCardsParams {
  words: string[];
}

interface RawCardSpec {
  word: string;
  translation: string;
  example: string;
  hint?: string;
  partOfSpeech?: string;
}

interface StoredCard {
  id: string;
  word: string;
}

export class VocabularyGenerationService {
  constructor(private readonly hasyx: Hasyx) {}

  /**
   * Основная точка входа — создать карточки по списку слов или на основе последних проблем
   */
  async generateCardsForUser(params: GenerateCardsParams): Promise<StoredCard[]> {
    const normalizedWords = await this.resolveWords(params);
    if (normalizedWords.length === 0) {
      return [];
    }

    // Подготавливаем контексты для каждого слова
    // Если передан массив contexts, используем его; иначе используем один context для всех слов
    const contexts = params.contexts
      ? params.contexts.slice(0, normalizedWords.length)
      : normalizedWords.map(() => params.context ?? null);

    const specs = await this.generateSpecsFromAI(normalizedWords, params.level, contexts);
    return await this.saveCards(specs, {
      userId: params.userId,
      sourceSnapshotId: params.sourceSnapshotId ?? null,
      contexts,
    });
  }

  /**
   * Создание карточек из слов, уже выбранных (например, произношение <95%)
   */
  async generateCardsFromWords(params: ManualWordsParams): Promise<StoredCard[]> {
    if (!params.words.length) {
      return [];
    }
    // Для ManualWordsParams используем один context для всех слов, если передан
    const contexts = params.words.map(() => params.context ?? null);
    const specs = await this.generateSpecsFromAI(params.words, params.level, contexts);
    return await this.saveCards(specs, {
      userId: params.userId,
      sourceSnapshotId: params.sourceSnapshotId ?? null,
      contexts,
    });
  }

  /**
   * Собираем слова из слепков/инсайтов, если не переданы напрямую
   */
  private async resolveWords(params: GenerateCardsParams): Promise<string[]> {
    if (params.words && params.words.length) {
      return Array.from(new Set(params.words.map((word) => word.toLowerCase().trim()).filter(Boolean)));
    }

    const fromInsights =
      params.snapshotInsights?.problemAreas
        ?.filter((area) => area.type === 'unknown_word' || area.type === 'error')
        .map((area) => area.content?.toLowerCase().trim())
        .filter(Boolean) ?? [];

    const recentSnapshotWords = await this.collectWordsFromSnapshots(params.userId);

    const combined = [...fromInsights, ...recentSnapshotWords];
    return Array.from(new Set(combined)).slice(0, 8);
  }

  /**
   * Получаем последние слова из problem_areas lesson_snapshots
   */
  private async collectWordsFromSnapshots(userId: string): Promise<string[]> {
    const rows = await this.hasyx.select({
      table: 'lesson_snapshots',
      where: { user_id: { _eq: userId } },
      order_by: [{ lesson_date: 'desc' }],
      limit: 5,
      returning: ['problem_areas'],
    });

    const normalizedRows = Array.isArray(rows) ? rows : rows ? [rows] : [];
    const words: string[] = [];
    for (const row of normalizedRows) {
      const areas = (row?.problem_areas as any[]) ?? [];
      for (const area of areas) {
        if (
          area &&
          (area.type === 'unknown_word' || area.type === 'error' || area.type === 'struggle') &&
          typeof area.content === 'string'
        ) {
          words.push(area.content.toLowerCase().trim());
        }
      }
    }
    return words.slice(0, 10);
  }

  /**
   * Просим AI подготовить перевод/пример/подсказку для списка слов
   * @param contexts - массив контекстов (предложений) для каждого слова. Если null, контекста нет.
   */
  private async generateSpecsFromAI(
    words: string[],
    level: string,
    contexts?: (string | null)[]
  ): Promise<RawCardSpec[]> {
    const hasContexts = contexts && contexts.some((ctx) => ctx !== null && ctx.trim().length > 0);

    let prompt: string;

    if (hasContexts) {
      // Промпт с контекстом для слов из текста
      const wordsWithContext = words
        .map((word, i) => {
          const context = contexts?.[i];
          if (context && context.trim().length > 0) {
            return `"${word}" в контексте: "${context}"`;
          }
          return `"${word}"`;
        })
        .join(', ');

      prompt = [
        `Ты — преподаватель английского языка.`,
        `Составь карточки для словаря ученика уровня ${level}.`,
        `Слова с контекстом:`,
        wordsWithContext,
        `Учитывай контекст предложения при генерации перевода. Контекст помогает понять значение слова в конкретной ситуации.`,
        `Ответь валидным JSON:`,
        `{
  "cards": [
    {
      "word": "слово",
      "translation": "перевод",
      "example": "пример предложения с переводом",
      "hint": "краткая подсказка произношения или использования",
      "partOfSpeech": "noun|verb|..."
    }
  ]
}`,
        `Сохрани порядок слов. Не добавляй пояснений.`,
      ].join('\n');
    } else {
      // Стандартный промпт без контекста (для слов из практики произношения и т.д.)
      prompt = [
        `Ты — преподаватель английского языка.`,
        `Составь карточки для словаря ученика уровня ${level}.`,
        `Слова: ${words.join(', ')}.`,
        `Ответь валидным JSON:`,
        `{
  "cards": [
    {
      "word": "слово",
      "translation": "перевод",
      "example": "пример предложения с переводом",
      "hint": "краткая подсказка произношения или использования",
      "partOfSpeech": "noun|verb|..."
    }
  ]
}`,
        `Сохрани порядок слов. Не добавляй пояснений.`,
      ].join('\n');
    }

    const response = await generateJSON<{ cards: RawCardSpec[] }>(prompt, {
      maxTokens: 1200,
      systemPrompt: hasContexts
        ? 'Ты создаёшь карточки слов для подростка с учётом контекста: дай точный перевод, пример и краткую подсказку, учитывая значение слова в предложении.'
        : 'Ты создаёшь карточки слов для подростка: дай точный перевод, пример и краткую подсказку.',
    }).catch((error) => {
      console.warn('[VocabularyGenerationService] AI generation failed, using fallback', error);
      return {
        cards: words.map((word) => ({
          word,
          translation: word,
          example: `Use the word "${word}" in a sentence.`,
          hint: `Повтори слово "${word}" несколько раз.`,
        })),
      };
    });

    return response.cards
      .filter((card) => typeof card.word === 'string' && typeof card.translation === 'string')
      .map((card) => {
        // Нормализуем слово сразу после получения от AI
        const normalizedWord = card.word.toLowerCase().trim();
        return {
          ...card,
          word: normalizedWord, // Сохраняем нормализованное слово
          translation: card.translation.trim(),
          example: card.example?.trim() ?? `Use the word "${normalizedWord}" in your own sentence.`,
          hint: card.hint?.trim(),
        };
      });
  }

  /**
   * Нормализует слово: приводит к lowercase и убирает пробелы
   */
  private normalizeWord(word: string): string {
    return word.toLowerCase().trim();
  }

  /**
   * Объединяет примеры предложений, если они отличаются
   */
  private mergeExamples(existingExample: string | null, newExample: string): string {
    if (!existingExample || existingExample.trim() === '') {
      return newExample;
    }
    if (existingExample === newExample) {
      return existingExample;
    }
    // Объединяем примеры через разделитель " | "
    return `${existingExample} | ${newExample}`;
  }

  /**
   * Сохраняем карточки и создаём Active Recall записи
   */
  private async saveCards(
    cards: RawCardSpec[],
    options: {
      userId: string;
      sourceSnapshotId: string | null;
      context?: string | null; // Для обратной совместимости
      contexts?: (string | null)[]; // Массив контекстов для каждого слова
    }
  ): Promise<StoredCard[]> {
    const saved: StoredCard[] = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      // Используем контекст из массива, если передан, иначе используем общий context
      const context = options.contexts?.[i] ?? options.context ?? null;
      // Нормализуем слово перед проверкой и сохранением
      const normalizedWord = this.normalizeWord(card.word);

      // Ищем существующую карточку по нормализованному слову
      const existing = await this.hasyx.select({
        table: 'vocabulary_cards',
        where: {
          user_id: { _eq: options.userId },
          word: { _eq: normalizedWord },
        },
        limit: 1,
        returning: ['id', 'example_sentence', 'translation', 'part_of_speech'],
      });

      const normalizedExisting = Array.isArray(existing) ? existing[0] : existing ?? null;
      
      if (normalizedExisting?.id) {
        // Карточка существует - обновляем её вместо создания новой
        const mergedExample = this.mergeExamples(
          normalizedExisting.example_sentence,
          card.example
        );

        // Обновляем карточку, объединяя примеры и обновляя другие поля если нужно
        await this.hasyx.update({
          table: 'vocabulary_cards',
          pk_columns: { id: normalizedExisting.id },
          _set: {
            example_sentence: mergedExample,
            // Обновляем translation и part_of_speech если они пустые или отличаются
            translation: normalizedExisting.translation || card.translation,
            part_of_speech: (normalizedExisting.part_of_speech || card.partOfSpeech) ?? null,
          },
        });

        saved.push({ id: normalizedExisting.id, word: normalizedWord });
        continue;
      }

      // Карточка не существует - создаём новую
      const sm2Base = initializeSM2();
      const schedule = calculateSM2({ ...sm2Base, quality: 0 });
      const nextReviewDate = schedule.nextReviewDate.toISOString().split('T')[0];

      const inserted = await this.hasyx.insert({
        table: 'vocabulary_cards',
        object: {
          user_id: options.userId,
          word: normalizedWord, // Сохраняем в нормализованном виде
          translation: card.translation.trim(),
          example_sentence: card.example.trim(),
          part_of_speech: card.partOfSpeech ?? null,
          next_review_date: nextReviewDate,
          difficulty: 'new',
          added_date: new Date().toISOString().split('T')[0],
        },
        returning: ['id'],
      });

      const cardId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
      if (!cardId) {
        continue;
      }

      await this.hasyx.insert({
        table: 'active_recall_sessions',
        object: {
          user_id: options.userId,
          lesson_snapshot_id: options.sourceSnapshotId,
          recall_type: 'vocabulary',
          recall_item_id: cardId,
          recall_item_type: 'vocabulary_card',
          quality: 0,
          ease_factor: schedule.easeFactor,
          interval_days: schedule.interval,
          repetitions: schedule.repetitions,
          next_review_date: nextReviewDate,
          recall_attempts: 1,
          recall_success: false,
          context_prompt: card.example,
          correct_response: card.translation,
        },
      });

      if (options.sourceSnapshotId) {
        await this.hasyx.insert({
          table: 'lesson_vocabulary_extractions',
          object: {
            lesson_snapshot_id: options.sourceSnapshotId,
            vocabulary_card_id: cardId,
            word: normalizedWord, // Используем нормализованное слово
            context_sentence: context ?? card.example,
            active_recall_context: card.example,
            user_action: 'pronunciation_flag',
            user_confidence: 'unknown',
          },
        });
      }

      saved.push({ id: cardId, word: normalizedWord });
    }

    return saved;
  }
}


