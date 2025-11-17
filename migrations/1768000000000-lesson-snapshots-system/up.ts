import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql('BEGIN');

  try {
    // ============================================
    // 1. Расширение ai_sessions
    // ============================================
    console.log('📝 Extending ai_sessions table...');
    
    await hasura.sql(`
      ALTER TABLE ai_sessions 
      ADD COLUMN IF NOT EXISTS session_type VARCHAR(20) DEFAULT 'ai';
      -- 'ai' | 'daily' | 'section'
    `);
    
    await hasura.sql(`
      ALTER TABLE ai_sessions 
      ADD COLUMN IF NOT EXISTS section_type VARCHAR(50);
      -- NULL для daily/ai, 'reading'|'writing'|'listening'|'speaking'|'grammar' для section
    `);
    
    await hasura.sql(`
      ALTER TABLE ai_sessions 
      ADD COLUMN IF NOT EXISTS tasks_completed UUID[];
      -- массив task_id из daily_tasks
    `);
    
    await hasura.sql(`
      ALTER TABLE ai_sessions 
      ADD COLUMN IF NOT EXISTS tasks_total INTEGER;
    `);
    
    console.log('✅ Extended ai_sessions table');

    // ============================================
    // 2. lesson_snapshots - слепки уроков
    // ============================================
    console.log('📝 Creating lesson_snapshots table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS lesson_snapshots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_id UUID REFERENCES ai_sessions(id) ON DELETE SET NULL,
        task_id UUID REFERENCES daily_tasks(id) ON DELETE SET NULL,
        
        -- Версионность (для переделывания)
        version INTEGER DEFAULT 1,
        parent_snapshot_id UUID REFERENCES lesson_snapshots(id) ON DELETE SET NULL,
        is_improvement BOOLEAN DEFAULT false,
        
        -- Контекст урока
        lesson_type VARCHAR(50) NOT NULL,
        -- все типы: 'grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking', 'ai_practice'
        lesson_date TIMESTAMP DEFAULT NOW(),
        duration_seconds INTEGER,
        
        -- Кайдзен метрики
        kaizen_metrics JSONB,
        -- {
        --   accuracy_delta: 0.05,
        --   speed_delta: -10,
        --   confidence_delta: 0.1,
        --   mistakes_reduced: 2
        -- }
        
        -- Полный слепок контента
        content_snapshot JSONB,
        -- {
        --   original_content: {...},
        --   user_responses: [...],
        --   ai_feedback: {...},
        --   interaction_log: [...]
        -- }
        
        -- Проблемные места (только проблемные!)
        problem_areas JSONB DEFAULT '[]'::jsonb,
        -- [
        --   {
        --     type: 'error' | 'struggle' | 'hesitation' | 'unknown_word',
        --     content: '...',
        --     context: '...',
        --     severity: 'low' | 'medium' | 'high',
        --     timestamp: '...'
        --   }
        -- ]
        
        -- Результаты
        performance_score DECIMAL(3,2),
        -- 0.00 to 1.00
        mastery_level VARCHAR(20),
        -- 'beginner' | 'developing' | 'proficient' | 'mastered'
        
        -- Методики
        methodology_tags JSONB DEFAULT '[]'::jsonb,
        -- ['kaizen_improvement', 'kumon_level_up', 'active_recall_triggered', 'shu_stage_completed']
        
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Created lesson_snapshots table');

    // ============================================
    // 3. kumon_progress - прогресс по методике Кумон
    // ============================================
    console.log('📝 Creating kumon_progress table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS kumon_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        skill_category VARCHAR(50) NOT NULL,
        -- 'present_perfect', 'articles', 'vocabulary_topic_X'
        skill_subcategory VARCHAR(100),
        
        -- Кумон уровни (1-7 для сессии, но прогресс сохраняется)
        current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 7),
        target_level INTEGER CHECK (target_level BETWEEN 1 AND 7),
        -- целевой для сессии
        
        -- Метрики для перехода на следующий уровень
        consecutive_correct INTEGER DEFAULT 0,
        -- подряд правильных ответов
        accuracy_rate DECIMAL(3,2),
        -- точность на текущем уровне
        completion_time_avg INTEGER,
        -- среднее время выполнения (секунды)
        
        -- Связь с уроками
        last_practiced_snapshot_id UUID REFERENCES lesson_snapshots(id) ON DELETE SET NULL,
        last_practiced_at TIMESTAMP,
        
        -- Статус (в рамках сессии)
        status VARCHAR(20) DEFAULT 'practicing',
        -- 'practicing' | 'ready_for_next' | 'mastered' (для сессии)
        
        -- Связь с сессией
        session_id UUID REFERENCES ai_sessions(id) ON DELETE SET NULL,
        -- текущая сессия
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        
        -- Уникальность: один прогресс на навык для пользователя
        UNIQUE(user_id, skill_category, skill_subcategory)
      );
    `);
    
    console.log('✅ Created kumon_progress table');

    // ============================================
    // 4. active_recall_sessions - Active Recall с SM-2
    // ============================================
    console.log('📝 Creating active_recall_sessions table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS active_recall_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_snapshot_id UUID REFERENCES lesson_snapshots(id) ON DELETE SET NULL,
        
        -- Тип активного вспоминания
        recall_type VARCHAR(50) NOT NULL,
        -- 'vocabulary' | 'grammar_rule' | 'conversation_pattern'
        
        -- Что вспоминаем
        recall_item_id UUID,
        -- ID слова/правила/паттерна
        recall_item_type VARCHAR(50),
        -- 'vocabulary_card' | 'grammar_rule' | 'error_pattern'
        
        -- SM-2 алгоритм
        quality INTEGER CHECK (quality BETWEEN 0 AND 5),
        -- 0-5 (SM-2)
        ease_factor DECIMAL(5,2) DEFAULT 2.5,
        -- фактор легкости
        interval_days INTEGER DEFAULT 1,
        -- интервал в днях
        repetitions INTEGER DEFAULT 0,
        -- количество повторений
        next_review_date DATE,
        -- следующая дата повторения
        
        -- Метрики Active Recall
        recall_attempts INTEGER DEFAULT 1,
        recall_success BOOLEAN,
        recall_time_seconds INTEGER,
        hint_used BOOLEAN DEFAULT false,
        
        -- Контекст вспоминания
        context_prompt TEXT,
        user_response TEXT,
        correct_response TEXT,
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Created active_recall_sessions table');

    // ============================================
    // 5. shu_ha_ri_progress - прогресс по методике Shu-Ha-Ri
    // ============================================
    console.log('📝 Creating shu_ha_ri_progress table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS shu_ha_ri_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        skill_id UUID,
        -- ссылка на навык/правило/тему
        skill_type VARCHAR(50) NOT NULL,
        -- 'grammar_rule' | 'vocabulary_topic' | 'language_level'
        
        -- Три стадии Shu-Ha-Ri
        stage VARCHAR(10) DEFAULT 'shu',
        -- 'shu' | 'ha' | 'ri'
        
        -- Shu: строгое следование правилам
        shu_mastery_count INTEGER DEFAULT 0,
        shu_accuracy DECIMAL(3,2),
        shu_test_passed BOOLEAN DEFAULT false,
        -- проверочный тест пройден
        
        -- Ha: отход от формы, понимание сути
        ha_understanding_score DECIMAL(3,2),
        -- оценка понимания (через объяснения)
        ha_creative_applications INTEGER DEFAULT 0,
        ha_test_passed BOOLEAN DEFAULT false,
        
        -- Ri: трансценденция, свободное владение
        ri_fluency_score DECIMAL(3,2),
        ri_natural_usage_count INTEGER DEFAULT 0,
        ri_test_passed BOOLEAN DEFAULT false,
        
        -- AI анализ для перехода
        ai_analysis JSONB,
        -- {
        --   shu_readiness: 0.85,
        --   ha_readiness: 0.70,
        --   ri_readiness: 0.60,
        --   recommendations: [...]
        -- }
        
        -- Переходы между стадиями
        shu_completed_at TIMESTAMP,
        ha_started_at TIMESTAMP,
        ri_achieved_at TIMESTAMP,
        
        updated_at TIMESTAMP DEFAULT NOW(),
        
        -- Уникальность: один прогресс на навык для пользователя
        UNIQUE(user_id, skill_id, skill_type)
      );
    `);
    
    console.log('✅ Created shu_ha_ri_progress table');

    // ============================================
    // 6. shu_ha_ri_tests - еженедельные проверочные тесты
    // ============================================
    console.log('📝 Creating shu_ha_ri_tests table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS shu_ha_ri_tests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        week_start_date DATE NOT NULL,
        -- начало недели для которой тест
        
        -- Тип теста
        test_type VARCHAR(50) NOT NULL,
        -- 'shu' | 'ha' | 'ri' | 'comprehensive'
        
        -- Вопросы и ответы
        questions JSONB NOT NULL,
        -- [{question: '...', type: '...', correct_answer: '...', skill_id: '...'}]
        user_answers JSONB,
        -- [{question_id: '...', answer: '...', is_correct: true/false}]
        
        -- Результаты
        score DECIMAL(5,2),
        -- 0.00 to 100.00
        passed BOOLEAN DEFAULT false,
        
        -- Обратная связь
        feedback JSONB,
        -- {strengths: [], improvements: [], detailed_feedback: '...'}
        
        -- Прогресс по навыкам после теста
        skills_progress JSONB,
        -- [{skill_id: '...', stage: 'shu'|'ha'|'ri', passed: true/false}]
        
        started_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        
        -- Один тест на неделю для пользователя
        UNIQUE(user_id, week_start_date, test_type)
      );
    `);
    
    console.log('✅ Created shu_ha_ri_tests table');

    // ============================================
    // 7. lesson_vocabulary_extractions - незнакомые слова
    // ============================================
    console.log('📝 Creating lesson_vocabulary_extractions table...');
    
    await hasura.sql(`
      CREATE TABLE IF NOT EXISTS lesson_vocabulary_extractions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lesson_snapshot_id UUID REFERENCES lesson_snapshots(id) ON DELETE CASCADE,
        vocabulary_card_id UUID REFERENCES vocabulary_cards(id) ON DELETE SET NULL,
        -- если уже добавлено
        
        word VARCHAR(100) NOT NULL,
        word_form VARCHAR(50),
        -- 'base' | 'past_tense' | 'plural' и т.д.
        
        -- Контекст из урока (для Active Recall)
        context_sentence TEXT,
        -- предложение, где встретилось
        context_paragraph TEXT,
        -- абзац для большего контекста
        context_position INTEGER,
        -- позиция в тексте
        
        -- Метрики
        frequency_in_lesson INTEGER DEFAULT 1,
        user_action VARCHAR(20),
        -- 'looked_up' | 'skipped' | 'added_to_vocab' | 'ignored'
        user_confidence VARCHAR(20),
        -- 'unknown' | 'uncertain' | 'familiar'
        
        -- Для Active Recall
        active_recall_context TEXT,
        -- контекст для будущего вспоминания
        suggested_hint TEXT,
        -- подсказка для Active Recall
        
        extracted_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ Created lesson_vocabulary_extractions table');

    // ============================================
    // 8. Индексы для производительности
    // ============================================
    console.log('📝 Creating indexes...');
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_snapshots_latest 
      ON lesson_snapshots(user_id, task_id, version DESC);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_snapshots_user_date 
      ON lesson_snapshots(user_id, lesson_date DESC);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_snapshots_session 
      ON lesson_snapshots(session_id);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_kumon_progress_user_skill 
      ON kumon_progress(user_id, skill_category, skill_subcategory);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_kumon_progress_session 
      ON kumon_progress(session_id);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_active_recall_next_review 
      ON active_recall_sessions(user_id, next_review_date) 
      WHERE next_review_date IS NOT NULL;
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_active_recall_item 
      ON active_recall_sessions(recall_item_id, recall_item_type);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_shu_ha_ri_progress_user_skill 
      ON shu_ha_ri_progress(user_id, skill_id, skill_type);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_shu_ha_ri_tests_user_week 
      ON shu_ha_ri_tests(user_id, week_start_date DESC);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_vocabulary_extractions_snapshot 
      ON lesson_vocabulary_extractions(lesson_snapshot_id);
    `);
    
    await hasura.sql(`
      CREATE INDEX IF NOT EXISTS idx_ai_sessions_type 
      ON ai_sessions(user_id, session_type, session_date DESC);
    `);
    
    console.log('✅ Created indexes');

    // ============================================
    // 9. Триггеры для обновления updated_at
    // ============================================
    console.log('📝 Creating triggers...');
    
    await hasura.sql(`
      CREATE TRIGGER update_kumon_progress_updated_at 
      BEFORE UPDATE ON kumon_progress
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await hasura.sql(`
      CREATE TRIGGER update_active_recall_updated_at 
      BEFORE UPDATE ON active_recall_sessions
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    await hasura.sql(`
      CREATE TRIGGER update_shu_ha_ri_progress_updated_at 
      BEFORE UPDATE ON shu_ha_ri_progress
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('✅ Created triggers');

    await hasura.sql('COMMIT');
    console.log('✅ Lesson snapshots system migration completed successfully');

    // ============================================
    // 10. Отслеживание таблиц в Hasura
    // ============================================
    // Примечание: отслеживание таблиц может не работать, если Hasura Cloud недоступен
    // Это не критично - таблицы можно отследить позже через консоль Hasura или при следующем запуске
    console.log('🔄 Tracking tables in Hasura...');
    const tablesToTrack = [
      'lesson_snapshots',
      'kumon_progress',
      'active_recall_sessions',
      'shu_ha_ri_progress',
      'shu_ha_ri_tests',
      'lesson_vocabulary_extractions',
    ];

    let trackingSuccess = false;
    for (const table of tablesToTrack) {
      try {
        await hasura.defineTable({ schema: 'public', table });
        console.log(`  ✅ Tracked table: ${table}`);
        trackingSuccess = true;
      } catch (error: any) {
        if (error?.message?.includes('already tracked') || 
            error?.message?.includes('already exists')) {
          console.log(`  ⚠️  Table ${table} already tracked`);
          trackingSuccess = true;
        } else if (error?.message?.includes('not reachable') || 
                   error?.message?.includes('502') ||
                   error?.message?.includes('hibernated')) {
          console.warn(`  ⚠️  Hasura Cloud недоступен. Таблицу ${table} можно отследить позже через консоль Hasura.`);
        } else {
          console.warn(`  ⚠️  Could not track table ${table}:`, error?.message || error);
        }
      }
    }

    // Обновляем отслеживание ai_sessions (добавлены новые колонки)
    try {
      await hasura.defineTable({ schema: 'public', table: 'ai_sessions' });
      console.log('  ✅ Updated tracking for ai_sessions');
      trackingSuccess = true;
    } catch (error: any) {
      if (error?.message?.includes('not reachable') || 
          error?.message?.includes('502') ||
          error?.message?.includes('hibernated')) {
        console.warn(`  ⚠️  Hasura Cloud недоступен. ai_sessions можно обновить позже через консоль Hasura.`);
      } else {
        console.warn(`  ⚠️  Could not update ai_sessions tracking:`, error?.message || error);
      }
    }

    if (!trackingSuccess) {
      console.warn('⚠️  Не удалось отследить таблицы в Hasura. Это нормально, если Hasura Cloud недоступен.');
      console.warn('   Таблицы можно отследить позже через консоль Hasura Cloud или при следующем запуске.');
    }

  } catch (error) {
    await hasura.sql('ROLLBACK').catch(() => {});
    console.error('❌ Lesson snapshots system migration failed:', error);
    throw error;
  }
}

up()