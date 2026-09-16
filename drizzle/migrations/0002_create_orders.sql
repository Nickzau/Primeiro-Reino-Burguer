CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL DEFAULT to_char(now(), 'YYMMDDHH24MISS'),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Entrega',
  payment TEXT NOT NULL DEFAULT 'Pix',
  address TEXT NOT NULL DEFAULT '',
  complement TEXT NOT NULL DEFAULT '',
  reference TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read orders" ON public.orders
  FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER orders_touch_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);
