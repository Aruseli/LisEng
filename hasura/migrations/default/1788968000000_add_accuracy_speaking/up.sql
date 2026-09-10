-- П.3 Этапа 1 roadmap: speaking accuracy раньше ошибочно писалась в accuracy_writing.
-- Добавляем отдельную колонку accuracy_speaking (0..1, как остальные accuracy_*).
ALTER TABLE public.progress_metrics
  ADD COLUMN IF NOT EXISTS accuracy_speaking numeric(3,2);

COMMENT ON COLUMN public.progress_metrics.accuracy_speaking IS 'Точность speaking-заданий (pronunciation). Исторически писалась в accuracy_writing — там лежат legacy speaking-данные.';
