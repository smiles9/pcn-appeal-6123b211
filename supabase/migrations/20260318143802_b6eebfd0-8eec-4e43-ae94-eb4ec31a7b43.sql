
-- Allow anon users to update submissions they created (where user_id IS NULL) to claim them
-- Also keep existing policy for authenticated users updating their own submissions
DROP POLICY IF EXISTS "Users can update own submissions" ON public.submissions;

CREATE POLICY "Users can update own submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR user_id IS NULL
)
WITH CHECK (
  user_id = auth.uid()
);
