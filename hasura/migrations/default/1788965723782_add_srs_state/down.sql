COMMENT ON COLUMN public.vocabulary_cards.next_review_date IS NULL;
COMMENT ON COLUMN public.vocabulary_cards.difficulty IS NULL;

DROP INDEX IF EXISTS public.srs_state_difficulty_idx;
DROP INDEX IF EXISTS public.srs_state_due_idx;
DROP TABLE IF EXISTS public.srs_state;
