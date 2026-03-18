-- Drop both insert policies and create a simpler one
DROP POLICY IF EXISTS "Anon users can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;

-- Allow any insert where user_id matches auth.uid() OR user_id is null
CREATE POLICY "Allow insert submissions"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);