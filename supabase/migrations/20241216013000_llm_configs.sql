-- LLM configuration for Category of One
CREATE TABLE IF NOT EXISTS public.llm_configs (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  model text NOT NULL,
  chat_system_prompt text NOT NULL,
  synthesis_system_prompt text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.llm_config_audit (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  llm_name text NOT NULL,
  model text NOT NULL,
  chat_system_prompt text NOT NULL,
  synthesis_system_prompt text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.llm_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_config_audit ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read config (for edge functions via anon key if needed)
CREATE POLICY llm_configs_read_auth ON public.llm_configs
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY llm_config_audit_read_auth ON public.llm_config_audit
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can write llm_configs
CREATE POLICY llm_configs_admin_insert ON public.llm_configs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY llm_configs_admin_update ON public.llm_configs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert audit rows
CREATE POLICY llm_config_audit_admin_insert ON public.llm_config_audit
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Seed initial config if not present
INSERT INTO public.llm_configs (name, model, chat_system_prompt, synthesis_system_prompt)
VALUES (
  'category_of_one',
  'claude-sonnet-4-20250514',
  '-- chat system prompt placeholder, update via admin UI',
  '-- synthesis system prompt placeholder, update via admin UI'
)
ON CONFLICT (name) DO NOTHING;


