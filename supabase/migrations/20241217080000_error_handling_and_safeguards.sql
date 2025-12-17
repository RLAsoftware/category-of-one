-- Migration: Error Handling and Session Safeguards
-- Add columns for synthesis error tracking and session turn limits

-- Add error tracking columns to category_of_one_profiles
ALTER TABLE public.category_of_one_profiles
ADD COLUMN IF NOT EXISTS synthesis_attempts INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS synthesis_error TEXT,
ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT FALSE;

-- Add session safeguard columns to interview_sessions
ALTER TABLE public.interview_sessions
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS flagged_for_review BOOLEAN DEFAULT FALSE;

-- Create index for flagged sessions (for admin review queries)
CREATE INDEX IF NOT EXISTS idx_interview_sessions_flagged ON public.interview_sessions(flagged_for_review) WHERE flagged_for_review = TRUE;

-- Create index for profiles needing review
CREATE INDEX IF NOT EXISTS idx_category_of_one_profiles_needs_review ON public.category_of_one_profiles(needs_review) WHERE needs_review = TRUE;

-- Add comments
COMMENT ON COLUMN public.category_of_one_profiles.synthesis_attempts IS 'Number of synthesis attempts (for retry tracking)';
COMMENT ON COLUMN public.category_of_one_profiles.synthesis_error IS 'Error message if synthesis failed';
COMMENT ON COLUMN public.category_of_one_profiles.needs_review IS 'Flag for admin review if synthesis had issues';
COMMENT ON COLUMN public.interview_sessions.message_count IS 'Total number of messages in session (for turn limit tracking)';
COMMENT ON COLUMN public.interview_sessions.flagged_for_review IS 'Flag for admin review if session exceeded turn limits or has issues';

