-- FSRS: единая таблица состояния повторений (замена SM-2 в active_recall_sessions
-- и verb_learning_progress, которые остаются историей).
CREATE TABLE IF NOT EXISTS public.srs_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type text NOT NULL, -- 'vocabulary_card' | 'verb'
  item_id uuid NOT NULL,
  difficulty double precision NOT NULL,      -- FSRS D (1-10)
  stability double precision NOT NULL,       -- FSRS S (дни)
  retrievability double precision NOT NULL,  -- R на момент последнего пересчёта (0-1)
  state text NOT NULL,                       -- 'New' | 'Learning' | 'Review' | 'Relearning'
  due date NOT NULL,
  last_review_at timestamptz,
  elapsed_days integer NOT NULL DEFAULT 0,
  scheduled_days integer NOT NULL DEFAULT 0,
  learning_steps integer NOT NULL DEFAULT 0,
  reps integer NOT NULL DEFAULT 0,
  lapses integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT srs_state_user_item_key UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS srs_state_due_idx
  ON public.srs_state (user_id, item_type, due);
CREATE INDEX IF NOT EXISTS srs_state_difficulty_idx
  ON public.srs_state (user_id, item_type, difficulty);

COMMENT ON TABLE public.srs_state IS
  'FSRS-состояние карточек (D/S/R, due). Единый источник истины для scheduling, mastery и difficulty.';
COMMENT ON COLUMN public.vocabulary_cards.next_review_date IS
  'LEGACY (SM-2): новая логика не пишет и не читает; источник истины — srs_state.due';
COMMENT ON COLUMN public.vocabulary_cards.difficulty IS
  'LEGACY: сложность теперь в srs_state.difficulty (FSRS D)';
