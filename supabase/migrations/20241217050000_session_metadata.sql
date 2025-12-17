-- Add session metadata columns for dashboard functionality
-- This migration adds title, archived, deleted_at, and last_message_at columns to interview_sessions

-- Add title column (auto-generated from created_at, user-editable)
ALTER TABLE public.interview_sessions
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add archived column for soft deletes (default false)
ALTER TABLE public.interview_sessions
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

-- Add deleted_at column for 30-day soft delete recovery
ALTER TABLE public.interview_sessions
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add last_message_at for session activity tracking
ALTER TABLE public.interview_sessions
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_interview_sessions_client_archived 
ON public.interview_sessions(client_id, archived) 
WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_deleted_at 
ON public.interview_sessions(deleted_at) 
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_last_message 
ON public.interview_sessions(client_id, last_message_at DESC);

-- Update existing sessions with auto-generated titles based on created_at
UPDATE public.interview_sessions
SET title = 'Interview - ' || TO_CHAR(created_at, 'Mon DD, YYYY')
WHERE title IS NULL;

-- Set last_message_at to created_at for existing sessions
UPDATE public.interview_sessions
SET last_message_at = created_at
WHERE last_message_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.interview_sessions.title IS 'User-editable session title, auto-generated from created_at on creation';
COMMENT ON COLUMN public.interview_sessions.archived IS 'Marks session as archived, separate from deleted_at';
COMMENT ON COLUMN public.interview_sessions.deleted_at IS 'Soft delete timestamp, sessions can be recovered within 30 days';
COMMENT ON COLUMN public.interview_sessions.last_message_at IS 'Tracks last activity in session for sorting';

