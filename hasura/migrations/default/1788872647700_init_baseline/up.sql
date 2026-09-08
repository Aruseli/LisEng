\restrict hasura
SET transaction_timeout = 0;
SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      DECLARE
        _new RECORD;
      BEGIN
        _new := NEW;
        _new."updated_at" = EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000;
        RETURN _new;
      END;
      $$;
CREATE FUNCTION public.set_user_id_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE
      session_vars json;
      user_id text;
    BEGIN
      -- Get session variables from hasura.user
      session_vars := current_setting('hasura.user', true)::json;
      -- Extract user_id from session variables
      user_id := session_vars ->> 'x-hasura-user-id';
      -- If operation is performed by a user (has session variables), set _user_id
      IF user_id IS NOT NULL AND user_id != '' THEN
        NEW._user_id = user_id::uuid;
      ELSE
        -- If operation is performed by system (no user context), clear _user_id
        NEW._user_id = NULL;
      END IF;
      RETURN NEW;
    END;
    $$;
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
CREATE FUNCTION public.users_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW."updated_at" := (EXTRACT(EPOCH FROM NOW())*1000)::bigint;
  RETURN NEW;
END;$$;
CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at bigint DEFAULT (EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric) NOT NULL,
    updated_at bigint DEFAULT (EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric) NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    provider_data jsonb,
    credential_hash text
);
COMMENT ON COLUMN public.accounts.user_id IS 'Reference to users table';
COMMENT ON COLUMN public.accounts.type IS 'Account type';
COMMENT ON COLUMN public.accounts.provider IS 'OAuth provider';
COMMENT ON COLUMN public.accounts.provider_account_id IS 'Provider account ID';
COMMENT ON COLUMN public.accounts.refresh_token IS 'OAuth refresh token';
COMMENT ON COLUMN public.accounts.access_token IS 'OAuth access token';
COMMENT ON COLUMN public.accounts.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN public.accounts.token_type IS 'Token type';
COMMENT ON COLUMN public.accounts.scope IS 'OAuth scope';
COMMENT ON COLUMN public.accounts.id_token IS 'OAuth ID token';
COMMENT ON COLUMN public.accounts.session_state IS 'OAuth session state';
COMMENT ON COLUMN public.accounts.oauth_token_secret IS 'OAuth token secret';
COMMENT ON COLUMN public.accounts.oauth_token IS 'OAuth token';
COMMENT ON COLUMN public.accounts.provider_data IS 'Additional provider-specific data (e.g., Telegram username, photo_url)';
COMMENT ON COLUMN public.accounts.credential_hash IS 'Password hash for credentials providers (email/phone)';
CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    icon character varying(50),
    unlocked_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.active_recall_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    lesson_snapshot_id uuid,
    recall_type character varying(50) NOT NULL,
    recall_item_id uuid,
    recall_item_type character varying(50),
    quality integer,
    ease_factor numeric(5,2) DEFAULT 2.5,
    interval_days integer DEFAULT 1,
    repetitions integer DEFAULT 0,
    next_review_date date,
    recall_attempts integer DEFAULT 1,
    recall_success boolean,
    recall_time_seconds integer,
    hint_used boolean DEFAULT false,
    context_prompt text,
    user_response text,
    correct_response text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT active_recall_sessions_quality_check CHECK (((quality >= 0) AND (quality <= 5)))
);
CREATE TABLE public.ai_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_date date DEFAULT CURRENT_DATE,
    type character varying(50) NOT NULL,
    topic character varying(255),
    duration_minutes integer,
    conversation jsonb,
    feedback jsonb,
    started_at timestamp without time zone DEFAULT now(),
    ended_at timestamp without time zone,
    session_type character varying(20) DEFAULT 'ai'::character varying,
    section_type character varying(50),
    tasks_completed uuid[],
    tasks_total integer
);
CREATE TABLE public.auth_accounts (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
CREATE TABLE public.auth_sessions (
    id text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);
CREATE TABLE public.auth_users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE public.auth_verifications (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE public.daily_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    task_date date NOT NULL,
    stage_id uuid,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    duration_minutes integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    ai_enabled boolean DEFAULT false,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    ai_context jsonb,
    suggested_prompt text,
    type_specific_payload jsonb
);
CREATE TABLE public.irregular_verbs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    infinitive character varying(100) NOT NULL,
    past_simple character varying(100) NOT NULL,
    past_participle character varying(100) NOT NULL,
    group_number integer,
    frequency character varying(20),
    difficulty character varying(20),
    mnemonic_tip text,
    related_verbs text[],
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT irregular_verbs_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying])::text[]))),
    CONSTRAINT irregular_verbs_frequency_check CHECK (((frequency)::text = ANY ((ARRAY['must_know'::character varying, 'high'::character varying, 'medium'::character varying, 'low'::character varying])::text[]))),
    CONSTRAINT irregular_verbs_group_number_check CHECK (((group_number >= 1) AND (group_number <= 6)))
);
CREATE TABLE public.kumon_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    skill_category character varying(50) NOT NULL,
    skill_subcategory character varying(100),
    current_level integer DEFAULT 1,
    target_level integer,
    consecutive_correct integer DEFAULT 0,
    accuracy_rate numeric(3,2),
    completion_time_avg integer,
    last_practiced_snapshot_id uuid,
    last_practiced_at timestamp without time zone,
    status character varying(20) DEFAULT 'practicing'::character varying,
    session_id uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT kumon_progress_current_level_check CHECK (((current_level >= 1) AND (current_level <= 7))),
    CONSTRAINT kumon_progress_target_level_check CHECK (((target_level >= 1) AND (target_level <= 7)))
);
CREATE TABLE public.lesson_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_id uuid,
    task_id uuid,
    version integer DEFAULT 1,
    parent_snapshot_id uuid,
    is_improvement boolean DEFAULT false,
    lesson_type character varying(50) NOT NULL,
    lesson_date timestamp without time zone DEFAULT now(),
    duration_seconds integer,
    kaizen_metrics jsonb,
    content_snapshot jsonb,
    problem_areas jsonb DEFAULT '[]'::jsonb,
    performance_score numeric(3,2),
    mastery_level character varying(20),
    methodology_tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.lesson_vocabulary_extractions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_snapshot_id uuid,
    vocabulary_card_id uuid,
    word character varying(100) NOT NULL,
    word_form character varying(50),
    context_sentence text,
    context_paragraph text,
    context_position integer,
    frequency_in_lesson integer DEFAULT 1,
    user_action character varying(20),
    user_confidence character varying(20),
    active_recall_context text,
    suggested_hint text,
    extracted_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.progress_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    date date DEFAULT CURRENT_DATE,
    words_learned integer DEFAULT 0,
    tasks_completed integer DEFAULT 0,
    study_minutes integer DEFAULT 0,
    accuracy_grammar numeric(3,2),
    accuracy_vocabulary numeric(3,2),
    accuracy_listening numeric(3,2),
    accuracy_reading numeric(3,2),
    accuracy_writing numeric(3,2),
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.review_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    card_id uuid,
    user_id uuid,
    reviewed_at timestamp without time zone DEFAULT now(),
    was_correct boolean NOT NULL,
    response_time_seconds integer
);
CREATE TABLE public.shu_ha_ri_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    skill_id uuid,
    skill_type character varying(50) NOT NULL,
    stage character varying(10) DEFAULT 'shu'::character varying,
    shu_mastery_count integer DEFAULT 0,
    shu_accuracy numeric(3,2),
    shu_test_passed boolean DEFAULT false,
    ha_understanding_score numeric(3,2),
    ha_creative_applications integer DEFAULT 0,
    ha_test_passed boolean DEFAULT false,
    ri_fluency_score numeric(3,2),
    ri_natural_usage_count integer DEFAULT 0,
    ri_test_passed boolean DEFAULT false,
    ai_analysis jsonb,
    shu_completed_at timestamp without time zone,
    ha_started_at timestamp without time zone,
    ri_achieved_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.shu_ha_ri_tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    week_start_date date NOT NULL,
    test_type character varying(50) NOT NULL,
    questions jsonb NOT NULL,
    user_answers jsonb,
    score numeric(5,2),
    passed boolean DEFAULT false,
    feedback jsonb,
    skills_progress jsonb,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.stage_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    stage_id uuid,
    started_at date DEFAULT CURRENT_DATE,
    completed_at date,
    tasks_completed integer DEFAULT 0,
    tasks_total integer DEFAULT 0,
    words_learned integer DEFAULT 0,
    errors_pending integer DEFAULT 0,
    average_accuracy numeric(3,2),
    status character varying(20) DEFAULT 'in_progress'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.stage_requirements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stage_id uuid,
    requirement_type character varying(50) NOT NULL,
    requirement_value integer,
    requirement_threshold numeric(5,2),
    description text,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.stage_tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    stage_id uuid,
    test_type character varying(50) NOT NULL,
    questions jsonb,
    user_answers jsonb,
    score numeric(5,2),
    passed boolean DEFAULT false,
    feedback jsonb,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.streaks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.study_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    level_from character varying(10) NOT NULL,
    level_to character varying(10) NOT NULL,
    start_month integer NOT NULL,
    end_month integer NOT NULL,
    focus text,
    description text,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at bigint DEFAULT ((EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric))::bigint NOT NULL,
    updated_at bigint DEFAULT ((EXTRACT(epoch FROM CURRENT_TIMESTAMP) * (1000)::numeric))::bigint NOT NULL,
    name text,
    email text,
    email_verified bigint,
    image text,
    is_admin boolean DEFAULT false,
    hasura_role text DEFAULT 'user'::text,
    current_level character varying(10) DEFAULT 'A2'::character varying,
    target_level character varying(10) DEFAULT 'B2'::character varying,
    exam_date date,
    start_date date DEFAULT CURRENT_DATE,
    study_time time without time zone DEFAULT '16:00:00'::time without time zone,
    study_place character varying(255),
    daily_goal_minutes integer DEFAULT 40,
    reminder_enabled boolean DEFAULT true,
    instruction_language character varying(10) DEFAULT 'ru'::character varying
);
COMMENT ON COLUMN public.users.name IS 'User display name';
COMMENT ON COLUMN public.users.email IS 'User email address';
COMMENT ON COLUMN public.users.email_verified IS 'Email verification timestamp';
COMMENT ON COLUMN public.users.image IS 'User profile image URL';
COMMENT ON COLUMN public.users.is_admin IS 'Admin flag';
COMMENT ON COLUMN public.users.hasura_role IS 'Hasura role for permissions';
CREATE TABLE public.verb_examples (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    verb_id uuid,
    form_type character varying(20) NOT NULL,
    sentence_en text NOT NULL,
    sentence_ru text NOT NULL,
    context character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT verb_examples_form_type_check CHECK (((form_type)::text = ANY ((ARRAY['base'::character varying, 'past'::character varying, 'participle'::character varying])::text[])))
);
CREATE TABLE public.verb_learning_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    verb_id uuid,
    next_review_date date NOT NULL,
    correct_count integer DEFAULT 0,
    incorrect_count integer DEFAULT 0,
    last_reviewed_at timestamp without time zone,
    mastered boolean DEFAULT false,
    ease_factor numeric(4,2) DEFAULT 2.5,
    interval_days integer DEFAULT 1,
    repetitions integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.verb_practice_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_date date DEFAULT CURRENT_DATE,
    verbs_practiced integer DEFAULT 0,
    accuracy numeric(3,2),
    duration_minutes integer,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.verb_review_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    verb_id uuid,
    user_id uuid,
    reviewed_at timestamp without time zone DEFAULT now(),
    was_correct boolean NOT NULL,
    response_time_seconds integer,
    practice_mode character varying(50),
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.vocabulary_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    word character varying(100) NOT NULL,
    translation character varying(255) NOT NULL,
    example_sentence text,
    part_of_speech character varying(20),
    topic character varying(100),
    added_date date DEFAULT CURRENT_DATE,
    next_review_date date NOT NULL,
    correct_count integer DEFAULT 0,
    incorrect_count integer DEFAULT 0,
    difficulty character varying(20) DEFAULT 'new'::character varying,
    last_reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);
CREATE TABLE public.weekly_structure (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stage_id uuid,
    day_of_week integer NOT NULL,
    activity_type character varying(50) NOT NULL,
    duration_minutes integer NOT NULL,
    description text,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT weekly_structure_day_of_week_check CHECK (((day_of_week >= 1) AND (day_of_week <= 7)))
);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_provider_provider_account_id_unique UNIQUE (provider, provider_account_id);
ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.active_recall_sessions
    ADD CONSTRAINT active_recall_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.ai_sessions
    ADD CONSTRAINT ai_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_accounts
    ADD CONSTRAINT auth_accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_token_key UNIQUE (token);
ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_email_key UNIQUE (email);
ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_verifications
    ADD CONSTRAINT auth_verifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_tasks
    ADD CONSTRAINT daily_tasks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.daily_tasks
    ADD CONSTRAINT daily_tasks_user_id_task_date_type_key UNIQUE (user_id, task_date, type);
ALTER TABLE ONLY public.irregular_verbs
    ADD CONSTRAINT irregular_verbs_infinitive_key UNIQUE (infinitive);
ALTER TABLE ONLY public.irregular_verbs
    ADD CONSTRAINT irregular_verbs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.kumon_progress
    ADD CONSTRAINT kumon_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.kumon_progress
    ADD CONSTRAINT kumon_progress_user_id_skill_category_skill_subcategory_key UNIQUE (user_id, skill_category, skill_subcategory);
ALTER TABLE ONLY public.lesson_snapshots
    ADD CONSTRAINT lesson_snapshots_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_vocabulary_extractions
    ADD CONSTRAINT lesson_vocabulary_extractions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.progress_metrics
    ADD CONSTRAINT progress_metrics_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.progress_metrics
    ADD CONSTRAINT progress_metrics_user_id_date_key UNIQUE (user_id, date);
ALTER TABLE ONLY public.review_history
    ADD CONSTRAINT review_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shu_ha_ri_progress
    ADD CONSTRAINT shu_ha_ri_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shu_ha_ri_progress
    ADD CONSTRAINT shu_ha_ri_progress_user_id_skill_id_skill_type_key UNIQUE (user_id, skill_id, skill_type);
ALTER TABLE ONLY public.shu_ha_ri_tests
    ADD CONSTRAINT shu_ha_ri_tests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.shu_ha_ri_tests
    ADD CONSTRAINT shu_ha_ri_tests_user_id_week_start_date_test_type_key UNIQUE (user_id, week_start_date, test_type);
ALTER TABLE ONLY public.stage_progress
    ADD CONSTRAINT stage_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stage_progress
    ADD CONSTRAINT stage_progress_user_id_stage_id_key UNIQUE (user_id, stage_id);
ALTER TABLE ONLY public.stage_requirements
    ADD CONSTRAINT stage_requirements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stage_tests
    ADD CONSTRAINT stage_tests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.study_stages
    ADD CONSTRAINT study_stages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verb_examples
    ADD CONSTRAINT verb_examples_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verb_learning_progress
    ADD CONSTRAINT verb_learning_progress_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verb_learning_progress
    ADD CONSTRAINT verb_learning_progress_user_id_verb_id_key UNIQUE (user_id, verb_id);
ALTER TABLE ONLY public.verb_practice_sessions
    ADD CONSTRAINT verb_practice_sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verb_review_history
    ADD CONSTRAINT verb_review_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.vocabulary_cards
    ADD CONSTRAINT vocabulary_cards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.weekly_structure
    ADD CONSTRAINT weekly_structure_pkey PRIMARY KEY (id);
CREATE INDEX "auth_accounts_userId_idx" ON public.auth_accounts USING btree ("userId");
CREATE INDEX "auth_sessions_userId_idx" ON public.auth_sessions USING btree ("userId");
CREATE INDEX auth_verifications_identifier_idx ON public.auth_verifications USING btree (identifier);
CREATE INDEX idx_active_recall_item ON public.active_recall_sessions USING btree (recall_item_id, recall_item_type);
CREATE INDEX idx_active_recall_next_review ON public.active_recall_sessions USING btree (user_id, next_review_date) WHERE (next_review_date IS NOT NULL);
CREATE INDEX idx_ai_sessions_type ON public.ai_sessions USING btree (user_id, session_type, session_date DESC);
CREATE INDEX idx_ai_sessions_user_date ON public.ai_sessions USING btree (user_id, session_date);
CREATE INDEX idx_daily_tasks_user_date ON public.daily_tasks USING btree (user_id, task_date);
CREATE INDEX idx_irregular_verbs_frequency ON public.irregular_verbs USING btree (frequency);
CREATE INDEX idx_irregular_verbs_group ON public.irregular_verbs USING btree (group_number);
CREATE INDEX idx_kumon_progress_session ON public.kumon_progress USING btree (session_id);
CREATE INDEX idx_kumon_progress_user_skill ON public.kumon_progress USING btree (user_id, skill_category, skill_subcategory);
CREATE INDEX idx_lesson_snapshots_latest ON public.lesson_snapshots USING btree (user_id, task_id, version DESC);
CREATE INDEX idx_lesson_snapshots_session ON public.lesson_snapshots USING btree (session_id);
CREATE INDEX idx_lesson_snapshots_user_date ON public.lesson_snapshots USING btree (user_id, lesson_date DESC);
CREATE INDEX idx_progress_metrics_user_date ON public.progress_metrics USING btree (user_id, date);
CREATE INDEX idx_shu_ha_ri_progress_user_skill ON public.shu_ha_ri_progress USING btree (user_id, skill_id, skill_type);
CREATE INDEX idx_shu_ha_ri_tests_user_week ON public.shu_ha_ri_tests USING btree (user_id, week_start_date DESC);
CREATE INDEX idx_stage_progress_user_stage ON public.stage_progress USING btree (user_id, stage_id);
CREATE INDEX idx_stage_requirements_stage ON public.stage_requirements USING btree (stage_id);
CREATE INDEX idx_stage_tests_user_stage ON public.stage_tests USING btree (user_id, stage_id);
CREATE INDEX idx_verb_examples_verb_id ON public.verb_examples USING btree (verb_id);
CREATE INDEX idx_verb_learning_progress_review ON public.verb_learning_progress USING btree (user_id, next_review_date);
CREATE INDEX idx_verb_learning_progress_user ON public.verb_learning_progress USING btree (user_id);
CREATE INDEX idx_verb_practice_sessions_user ON public.verb_practice_sessions USING btree (user_id, session_date);
CREATE INDEX idx_verb_review_history_user ON public.verb_review_history USING btree (user_id, reviewed_at);
CREATE INDEX idx_vocabulary_extractions_snapshot ON public.lesson_vocabulary_extractions USING btree (lesson_snapshot_id);
CREATE INDEX idx_vocabulary_next_review ON public.vocabulary_cards USING btree (user_id, next_review_date);
CREATE TRIGGER update_active_recall_updated_at BEFORE UPDATE ON public.active_recall_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kumon_progress_updated_at BEFORE UPDATE ON public.kumon_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shu_ha_ri_progress_updated_at BEFORE UPDATE ON public.shu_ha_ri_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stage_progress_updated_at BEFORE UPDATE ON public.stage_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON public.streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.users_set_updated_at();
ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.active_recall_sessions
    ADD CONSTRAINT active_recall_sessions_lesson_snapshot_id_fkey FOREIGN KEY (lesson_snapshot_id) REFERENCES public.lesson_snapshots(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.active_recall_sessions
    ADD CONSTRAINT active_recall_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.ai_sessions
    ADD CONSTRAINT ai_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.auth_accounts
    ADD CONSTRAINT "auth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.auth_users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.daily_tasks
    ADD CONSTRAINT daily_tasks_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.study_stages(id);
ALTER TABLE ONLY public.daily_tasks
    ADD CONSTRAINT daily_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fk_accounts_user_id_users_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.kumon_progress
    ADD CONSTRAINT kumon_progress_last_practiced_snapshot_id_fkey FOREIGN KEY (last_practiced_snapshot_id) REFERENCES public.lesson_snapshots(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.kumon_progress
    ADD CONSTRAINT kumon_progress_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.ai_sessions(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.kumon_progress
    ADD CONSTRAINT kumon_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_snapshots
    ADD CONSTRAINT lesson_snapshots_parent_snapshot_id_fkey FOREIGN KEY (parent_snapshot_id) REFERENCES public.lesson_snapshots(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_snapshots
    ADD CONSTRAINT lesson_snapshots_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.ai_sessions(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_snapshots
    ADD CONSTRAINT lesson_snapshots_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.daily_tasks(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_snapshots
    ADD CONSTRAINT lesson_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_vocabulary_extractions
    ADD CONSTRAINT lesson_vocabulary_extractions_lesson_snapshot_id_fkey FOREIGN KEY (lesson_snapshot_id) REFERENCES public.lesson_snapshots(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_vocabulary_extractions
    ADD CONSTRAINT lesson_vocabulary_extractions_vocabulary_card_id_fkey FOREIGN KEY (vocabulary_card_id) REFERENCES public.vocabulary_cards(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.progress_metrics
    ADD CONSTRAINT progress_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.review_history
    ADD CONSTRAINT review_history_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.vocabulary_cards(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.review_history
    ADD CONSTRAINT review_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.shu_ha_ri_progress
    ADD CONSTRAINT shu_ha_ri_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.shu_ha_ri_tests
    ADD CONSTRAINT shu_ha_ri_tests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.stage_progress
    ADD CONSTRAINT stage_progress_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.study_stages(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.stage_progress
    ADD CONSTRAINT stage_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.stage_requirements
    ADD CONSTRAINT stage_requirements_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.study_stages(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.stage_tests
    ADD CONSTRAINT stage_tests_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.study_stages(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.stage_tests
    ADD CONSTRAINT stage_tests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_examples
    ADD CONSTRAINT verb_examples_verb_id_fkey FOREIGN KEY (verb_id) REFERENCES public.irregular_verbs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_learning_progress
    ADD CONSTRAINT verb_learning_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_learning_progress
    ADD CONSTRAINT verb_learning_progress_verb_id_fkey FOREIGN KEY (verb_id) REFERENCES public.irregular_verbs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_practice_sessions
    ADD CONSTRAINT verb_practice_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_review_history
    ADD CONSTRAINT verb_review_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.verb_review_history
    ADD CONSTRAINT verb_review_history_verb_id_fkey FOREIGN KEY (verb_id) REFERENCES public.irregular_verbs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.vocabulary_cards
    ADD CONSTRAINT vocabulary_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.weekly_structure
    ADD CONSTRAINT weekly_structure_stage_id_fkey FOREIGN KEY (stage_id) REFERENCES public.study_stages(id) ON DELETE CASCADE;
\unrestrict hasura
