-- Vincula pedidos a contas de clientes sem alterar pedidos antigos.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders (customer_id, created_at DESC);

DROP POLICY IF EXISTS "customers read own orders" ON public.orders;
CREATE POLICY "customers read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "customers create own orders" ON public.orders;
CREATE POLICY "customers create own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());
