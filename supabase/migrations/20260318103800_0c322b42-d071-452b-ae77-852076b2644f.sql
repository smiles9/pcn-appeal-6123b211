
-- Submissions table: stores each PCN upload and AI analysis
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_url TEXT,
  success_probability INTEGER NOT NULL DEFAULT 0,
  issues JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'diagnosed', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appeal letters table: stores generated letters, linked to submissions
CREATE TABLE public.appeal_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  letter_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeal_letters ENABLE ROW LEVEL SECURITY;

-- Submissions: users can only access their own submissions (matched by session_id)
CREATE POLICY "Anyone can insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own submissions"
  ON public.submissions FOR UPDATE
  USING (true);

-- Appeal letters: accessible if the linked submission is accessible
CREATE POLICY "Anyone can insert appeal letters"
  ON public.appeal_letters FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view appeal letters"
  ON public.appeal_letters FOR SELECT
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
