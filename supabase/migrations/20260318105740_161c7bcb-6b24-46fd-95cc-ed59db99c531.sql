
-- Add user_id column to submissions (nullable for migration, then we'll handle it)
ALTER TABLE public.submissions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to appeal_letters for direct access
ALTER TABLE public.appeal_letters ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop overly permissive policies on submissions
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.submissions;

-- Drop overly permissive policies on appeal_letters
DROP POLICY IF EXISTS "Anyone can insert appeal letters" ON public.appeal_letters;
DROP POLICY IF EXISTS "Users can view appeal letters" ON public.appeal_letters;

-- Create proper RLS policies for submissions
CREATE POLICY "Users can insert own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create proper RLS policies for appeal_letters
CREATE POLICY "Users can insert own appeal letters"
  ON public.appeal_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own appeal letters"
  ON public.appeal_letters FOR SELECT
  USING (auth.uid() = user_id);
