-- Drop the restrictive authenticated-only insert policy
DROP POLICY "Users can insert own submissions" ON public.submissions;

-- Create a unified insert policy that allows both authenticated users (matching user_id) and anonymous inserts (null user_id)
CREATE POLICY "Anyone can insert submissions"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  (auth.uid() IS NULL AND user_id IS NULL)
);