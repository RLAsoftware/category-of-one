-- Migration: Comprehensive Profile Schema
-- Add new columns to category_of_one_profiles table to support full Category of One framework

-- Step 1: Add new columns
ALTER TABLE public.category_of_one_profiles
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS positioning_statement_new JSONB, -- {who, what, how, full_statement}
ADD COLUMN IF NOT EXISTS confluence JSONB, -- {megatrends[], named_phenomenon, why_now_summary}
ADD COLUMN IF NOT EXISTS contrarian_approach JSONB, -- {conventional_frustration, where_they_break_convention, contrarian_beliefs[], mind_share_word}
ADD COLUMN IF NOT EXISTS all_roads_story JSONB, -- {mercenary_story, missionary_story, critical_combo[]}
ADD COLUMN IF NOT EXISTS transformation_new JSONB, -- {before: {frustrations[], failed_alternatives[]}, after: {outcomes[], what_becomes_possible}, client_example}
ADD COLUMN IF NOT EXISTS proof_points JSONB, -- {client_results[], testimonials[], credentials[], media_and_publications[], awards_and_recognition[], experience_metrics}
ADD COLUMN IF NOT EXISTS voice_and_language JSONB, -- {distinctive_phrases[], tone_notes}
ADD COLUMN IF NOT EXISTS business_profile_md TEXT,
ADD COLUMN IF NOT EXISTS category_of_one_md TEXT;

-- Step 2: Migrate existing positioning_statement (TEXT) to new JSONB structure
-- Only for rows where positioning_statement_new is NULL and positioning_statement is NOT NULL
UPDATE public.category_of_one_profiles
SET positioning_statement_new = jsonb_build_object(
  'who', 'Not specified',
  'what', 'Not specified',
  'how', 'Not specified',
  'full_statement', positioning_statement
)
WHERE positioning_statement IS NOT NULL 
  AND positioning_statement_new IS NULL
  AND positioning_statement != '';

-- Step 3: Migrate existing transformation (simple structure) to new detailed structure
-- Only for rows where transformation_new is NULL and transformation is NOT NULL
UPDATE public.category_of_one_profiles
SET transformation_new = jsonb_build_object(
  'before', jsonb_build_object(
    'frustrations', ARRAY[]::text[],
    'failed_alternatives', ARRAY[]::text[]
  ),
  'after', jsonb_build_object(
    'outcomes', ARRAY[]::text[],
    'what_becomes_possible', COALESCE(transformation->>'after', '')
  ),
  'client_example', NULL
)
WHERE transformation IS NOT NULL 
  AND transformation_new IS NULL;

-- Step 4: Rename columns (drop old, rename new)
-- Drop old positioning_statement column
ALTER TABLE public.category_of_one_profiles
DROP COLUMN IF EXISTS positioning_statement;

-- Rename new positioning_statement_new to positioning_statement
ALTER TABLE public.category_of_one_profiles
RENAME COLUMN positioning_statement_new TO positioning_statement;

-- Drop old transformation column
ALTER TABLE public.category_of_one_profiles
DROP COLUMN IF EXISTS transformation;

-- Rename transformation_new to transformation
ALTER TABLE public.category_of_one_profiles
RENAME COLUMN transformation_new TO transformation;

-- Step 5: Drop old contrarian_position column (replaced by contrarian_approach)
ALTER TABLE public.category_of_one_profiles
DROP COLUMN IF EXISTS contrarian_position;

-- Step 6: Make raw_profile nullable (since we now have multiple markdown outputs)
ALTER TABLE public.category_of_one_profiles
ALTER COLUMN raw_profile DROP NOT NULL;

-- Step 7: Add comments for documentation
COMMENT ON COLUMN public.category_of_one_profiles.client_name IS 'Client full name';
COMMENT ON COLUMN public.category_of_one_profiles.business_name IS 'Business or company name';
COMMENT ON COLUMN public.category_of_one_profiles.positioning_statement IS 'JSONB: {who, what, how, full_statement}';
COMMENT ON COLUMN public.category_of_one_profiles.confluence IS 'JSONB: {megatrends[], named_phenomenon, why_now_summary} - Why Now';
COMMENT ON COLUMN public.category_of_one_profiles.contrarian_approach IS 'JSONB: {conventional_frustration, where_they_break_convention, contrarian_beliefs[], mind_share_word} - Why This';
COMMENT ON COLUMN public.category_of_one_profiles.all_roads_story IS 'JSONB: {mercenary_story, missionary_story, critical_combo[]} - Why You';
COMMENT ON COLUMN public.category_of_one_profiles.transformation IS 'JSONB: {before: {frustrations[], failed_alternatives[]}, after: {outcomes[], what_becomes_possible}, client_example}';
COMMENT ON COLUMN public.category_of_one_profiles.proof_points IS 'JSONB: {client_results[], testimonials[], credentials[], media_and_publications[], awards_and_recognition[], experience_metrics}';
COMMENT ON COLUMN public.category_of_one_profiles.voice_and_language IS 'JSONB: {distinctive_phrases[], tone_notes}';
COMMENT ON COLUMN public.category_of_one_profiles.business_profile_md IS 'Simplified business-focused markdown export';
COMMENT ON COLUMN public.category_of_one_profiles.category_of_one_md IS 'Full comprehensive positioning markdown export';

