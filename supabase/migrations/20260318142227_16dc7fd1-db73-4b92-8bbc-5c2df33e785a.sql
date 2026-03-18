CREATE POLICY "Anon users can insert submissions"
ON public.submissions
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);