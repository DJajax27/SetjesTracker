-- ============================================================
-- Fase 7 — User accounts Supabase schema
-- Run this in the Supabase SQL editor for your project.
-- All tables use a composite primary key (user_id, id) so
-- each user's local Dexie integer IDs are preserved in the cloud.
-- ============================================================

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  updated_at text,Success. No rows returned
  PRIMARY KEY (user_id, id)
);
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "templates_own" ON templates FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Exercises (template exercises)
CREATE TABLE IF NOT EXISTS exercises (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id bigint NOT NULL,
  name text NOT NULL,
  "order" int NOT NULL DEFAULT 0,
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_own" ON exercises FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id bigint NOT NULL,
  date text NOT NULL,
  completed_at text,
  custom_name text,
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_own" ON sessions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sets
CREATE TABLE IF NOT EXISTS sets (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id bigint NOT NULL,
  exercise_id bigint,
  session_exercise_id bigint,
  reps int NOT NULL,
  weight numeric NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sets_own" ON sets FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Session exercises (ad-hoc exercises added during a session)
CREATE TABLE IF NOT EXISTS session_exercises (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id bigint NOT NULL,
  name text NOT NULL,
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session_exercises_own" ON session_exercises FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL,
  target_date text,
  weekly_target int,
  target_value numeric,
  current_value numeric,
  unit text,
  completed_dates jsonb NOT NULL DEFAULT '[]',
  notify_enabled boolean,
  notify_time text,
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals_own" ON goals FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Exercise library (custom exercises)
CREATE TABLE IF NOT EXISTS exercise_library (
  id bigint NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  muscle_group text NOT NULL,
  created_at text,
  updated_at text,
  PRIMARY KEY (user_id, id)
);
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercise_library_own" ON exercise_library FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Optional: allow users to delete their own account
-- ============================================================
CREATE OR REPLACE FUNCTION delete_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
