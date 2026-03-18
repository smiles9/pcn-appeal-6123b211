-- Allow admins to read all submissions for analytics
CREATE POLICY "Admins can view all submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all appeal letters for analytics
CREATE POLICY "Admins can view all appeal letters"
ON public.appeal_letters
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
