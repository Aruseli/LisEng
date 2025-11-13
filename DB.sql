-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  current_level VARCHAR(10) DEFAULT 'A2',
  target_level VARCHAR(10) DEFAULT 'B2',
  exam_date DATE,
  start_date DATE DEFAULT CURRENT_DATE,
  study_time TIME DEFAULT '16:00:00',
  study_place VARCHAR(255),
  daily_goal_minutes INTEGER DEFAULT 40,
  reminder_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STUDY STAGES (этапы обучения)
-- ============================================
CREATE TABLE study_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  level_from VARCHAR(10) NOT NULL,
  level_to VARCHAR(10) NOT NULL,
  start_month INTEGER NOT NULL,
  end_month INTEGER NOT NULL,
  focus TEXT,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- WEEKLY STRUCTURE (расписание по дням недели)
-- ============================================
CREATE TABLE weekly_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES study_stages(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday
  activity_type VARCHAR(50) NOT NULL, -- 'grammar', 'reading', 'listening', 'writing', 'speaking'
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DAILY TASKS (ежедневные задания)
-- ============================================
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  stage_id UUID REFERENCES study_stages(id),
  type VARCHAR(50) NOT NULL, -- 'grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking', 'ai_practice'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ai_context JSONB,
  suggested_prompt TEXT,
  type_specific_payload JSONB,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
  ai_enabled BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_date, type)
);

-- ============================================
-- VOCABULARY CARDS (карточки со словами)
-- ============================================
CREATE TABLE vocabulary_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  word VARCHAR(100) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  example_sentence TEXT,
  part_of_speech VARCHAR(20), -- 'noun', 'verb', 'adjective', etc.
  topic VARCHAR(100), -- 'hobbies', 'school', 'technology', etc.
  added_date DATE DEFAULT CURRENT_DATE,
  next_review_date DATE NOT NULL,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'new', -- 'new', 'learning', 'review', 'mastered'
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REVIEW HISTORY (история повторений слов)
-- ============================================
CREATE TABLE review_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES vocabulary_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewed_at TIMESTAMP DEFAULT NOW(),
  was_correct BOOLEAN NOT NULL,
  response_time_seconds INTEGER
);

-- ============================================
-- ERROR LOG (книга ошибок)
-- ============================================
CREATE TABLE error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(50) NOT NULL, -- 'grammar', 'vocabulary', 'pronunciation', 'writing'
  subcategory VARCHAR(100), -- 'present_perfect', 'articles', 'word_order', etc.
  mistake TEXT NOT NULL,
  correction TEXT NOT NULL,
  notes TEXT,
  reviewed BOOLEAN DEFAULT false,
  next_review_date DATE,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AI SESSIONS (сессии с нейросетью)
-- ============================================
CREATE TABLE ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  type VARCHAR(50) NOT NULL, -- 'speaking', 'writing', 'grammar_drill', 'vocabulary', 'reading'
  topic VARCHAR(255),
  duration_minutes INTEGER,
  conversation JSONB, -- [{role: 'ai'|'user', message: '...', timestamp: '...'}]
  feedback JSONB, -- {strengths: [], improvements: [], score: 8.5}
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- ============================================
-- PROGRESS METRICS (метрики прогресса)
-- ============================================
CREATE TABLE progress_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  words_learned INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  study_minutes INTEGER DEFAULT 0,
  accuracy_grammar DECIMAL(3,2), -- 0.00 to 1.00
  accuracy_vocabulary DECIMAL(3,2),
  accuracy_listening DECIMAL(3,2),
  accuracy_reading DECIMAL(3,2),
  accuracy_writing DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- STREAK TRACKING (отслеживание стрика)
-- ============================================
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- ACHIEVEMENTS (достижения)
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'streak_7', 'words_100', 'tasks_50', 'level_up'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STAGE PROGRESS (прогресс по этапам)
-- ============================================
CREATE TABLE stage_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES study_stages(id) ON DELETE CASCADE,
  started_at DATE DEFAULT CURRENT_DATE,
  completed_at DATE,
  tasks_completed INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  errors_pending INTEGER DEFAULT 0, -- количество неповторенных ошибок
  average_accuracy DECIMAL(3,2), -- средняя точность за этап
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'ready_for_test', 'test_passed', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

-- ============================================
-- STAGE TESTS (тесты для перехода между этапами)
-- ============================================
CREATE TABLE stage_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES study_stages(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL, -- 'grammar', 'writing', 'speaking', 'comprehensive'
  questions JSONB, -- [{question: '...', type: '...', correct_answer: '...'}]
  user_answers JSONB, -- [{question_id: '...', answer: '...', is_correct: true/false}]
  score DECIMAL(5,2), -- 0.00 to 100.00
  passed BOOLEAN DEFAULT false,
  feedback JSONB, -- {strengths: [], improvements: [], detailed_feedback: '...'}
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STAGE REQUIREMENTS (требования для перехода)
-- ============================================
CREATE TABLE stage_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES study_stages(id) ON DELETE CASCADE,
  requirement_type VARCHAR(50) NOT NULL, -- 'tasks_completed', 'words_learned', 'errors_reviewed', 'accuracy_threshold', 'test_passed'
  requirement_value INTEGER, -- для числовых требований
  requirement_threshold DECIMAL(5,2), -- для пороговых значений (например, точность 0.85)
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES для производительности
-- ============================================
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);
CREATE INDEX idx_vocabulary_next_review ON vocabulary_cards(user_id, next_review_date);
CREATE INDEX idx_error_log_user_review ON error_log(user_id, next_review_date);
CREATE INDEX idx_progress_metrics_user_date ON progress_metrics(user_id, date);
CREATE INDEX idx_ai_sessions_user_date ON ai_sessions(user_id, session_date);
CREATE INDEX idx_stage_progress_user_stage ON stage_progress(user_id, stage_id);
CREATE INDEX idx_stage_tests_user_stage ON stage_tests(user_id, stage_id);
CREATE INDEX idx_stage_requirements_stage ON stage_requirements(stage_id);

-- ============================================
-- TRIGGERS для автоматического обновления
-- ============================================

-- Обновление updated_at при изменении записи
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stage_progress_updated_at BEFORE UPDATE ON stage_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (начальные данные)
-- ============================================

-- Этапы обучения
INSERT INTO study_stages (name, level_from, level_to, start_month, end_month, focus, order_index) VALUES
('A2 → A2+', 'A2', 'A2+', 1, 4, 'Укрепление базы + введение ритуалов', 1),
('A2+ → B1', 'A2+', 'B1', 5, 8, 'Расширение словарного запаса + усложнение грамматики', 2),
('B1 → B1+', 'B1', 'B1+', 9, 12, 'Подготовка к формату ОГЭ + автоматизация навыков', 3),
('B1+ → B2', 'B1+', 'B2', 13, 18, 'Шлифовка + уверенность + финальная подготовка', 4);

-- Требования для этапов (пример для A2 → A2+)
DO $$
DECLARE
  stage1_id UUID;
BEGIN
  SELECT id INTO stage1_id FROM study_stages WHERE name = 'A2 → A2+';
  
  -- Требования для перехода с этапа A2 → A2+
  INSERT INTO stage_requirements (stage_id, requirement_type, requirement_value, requirement_threshold, description, order_index) VALUES
  (stage1_id, 'tasks_completed', 80, NULL, 'Выполнено минимум 80% заданий этапа', 1),
  (stage1_id, 'words_learned', 100, NULL, 'Выучено минимум 100 новых слов', 2),
  (stage1_id, 'errors_reviewed', 0, NULL, 'Все ошибки из книги ошибок повторены', 3),
  (stage1_id, 'accuracy_threshold', NULL, 0.75, 'Средняя точность по всем навыкам не менее 75%', 4),
  (stage1_id, 'test_passed', NULL, 0.80, 'Пройден финальный тест этапа с результатом не менее 80%', 5);
END $$;

-- Расписание для первого этапа (A2 → A2+)
DO $$
DECLARE
  stage1_id UUID;
BEGIN
  SELECT id INTO stage1_id FROM study_stages WHERE name = 'A2 → A2+';
  
  -- Понедельник
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 1, 'grammar', 15, 'Новая грамматическая структура (микро-урок)', 1),
  (stage1_id, 1, 'vocabulary', 10, 'Active Recall — карточки со вчерашними словами', 2),
  (stage1_id, 1, 'writing', 10, 'Письменное упражнение (5-7 предложений)', 3);
  
  -- Вторник
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 2, 'reading', 20, 'Адаптированный текст A2-B1 (150-200 слов)', 1),
  (stage1_id, 2, 'listening', 10, 'Аудирование короткого диалога', 2);
  
  -- Среда
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 3, 'grammar', 15, 'Новая грамматическая структура (микро-урок)', 1),
  (stage1_id, 3, 'vocabulary', 10, 'Active Recall — карточки со вчерашними словами', 2),
  (stage1_id, 3, 'writing', 10, 'Письменное упражнение (5-7 предложений)', 3);
  
  -- Четверг
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 4, 'reading', 20, 'Адаптированный текст A2-B1 (150-200 слов)', 1),
  (stage1_id, 4, 'listening', 10, 'Аудирование короткого диалога', 2);
  
  -- Пятница
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 5, 'grammar', 15, 'Новая грамматическая структура (микро-урок)', 1),
  (stage1_id, 5, 'vocabulary', 10, 'Active Recall — карточки со вчерашними словами', 2),
  (stage1_id, 5, 'writing', 10, 'Письменное упражнение (5-7 предложений)', 3);
  
  -- Суббота
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 6, 'vocabulary', 30, 'Повторение недельного материала методом Spaced Repetition', 1);
  
  -- Воскресенье
  INSERT INTO weekly_structure (stage_id, day_of_week, activity_type, duration_minutes, description, order_index) VALUES
  (stage1_id, 7, 'speaking', 20, 'Ролевая игра по сценарию недели', 1),
  (stage1_id, 7, 'ai_practice', 15, 'Запись голосовых сообщений / практика с AI', 2);
END $$;