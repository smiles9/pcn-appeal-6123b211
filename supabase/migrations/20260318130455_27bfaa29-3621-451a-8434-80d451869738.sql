
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 100,
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read active promo codes" ON public.promo_codes
  FOR SELECT TO anon, authenticated
  USING (active = true);

INSERT INTO public.promo_codes (code, discount_percent, max_uses) VALUES
  ('FREE100', 100, 100),
  ('LAUNCH', 100, 50);
