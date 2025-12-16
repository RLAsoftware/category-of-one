-- Create chat_messages table to store conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(session_id, created_at);

-- Create category_of_one_profiles table
CREATE TABLE IF NOT EXISTS public.category_of_one_profiles (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    
    -- Structured profile fields
    positioning_statement TEXT,
    unique_differentiation TEXT,
    contrarian_position JSONB, -- { "their_belief": "", "mainstream_belief": "" }
    gap_they_fill JSONB, -- { "frustration": "", "desired_outcome": "" }
    unique_methodology JSONB, -- { "name": "", "description": "", "components": [] }
    transformation JSONB, -- { "before": "", "after": "" }
    competitive_landscape TEXT,
    
    -- Full markdown profile
    raw_profile TEXT NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_category_of_one_profiles_client_id ON public.category_of_one_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_category_of_one_profiles_session_id ON public.category_of_one_profiles(session_id);

-- Add new status values to interview_sessions for chat flow
ALTER TABLE public.interview_sessions 
DROP CONSTRAINT IF EXISTS interview_sessions_status_check;

ALTER TABLE public.interview_sessions 
ADD CONSTRAINT interview_sessions_status_check 
CHECK (status IN ('base_questions', 'analyzing', 'follow_up', 'synthesizing', 'completed', 'chatting', 'generating_profile'));

-- Enable RLS on new tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_of_one_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.interview_sessions s
            JOIN public.clients c ON c.id = s.client_id
            WHERE s.id = chat_messages.session_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interview_sessions s
            JOIN public.clients c ON c.id = s.client_id
            WHERE s.id = chat_messages.session_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all chat messages" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS policies for category_of_one_profiles
CREATE POLICY "Users can view their own profiles" ON public.category_of_one_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clients c
            WHERE c.id = category_of_one_profiles.client_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own profiles" ON public.category_of_one_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.clients c
            WHERE c.id = category_of_one_profiles.client_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all category of one profiles" ON public.category_of_one_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert category of one profiles" ON public.category_of_one_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

