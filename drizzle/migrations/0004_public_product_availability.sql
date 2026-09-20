-- Permite sinalizar itens em falta no cardápio sem permitir que sejam vendidos.
DROP POLICY IF EXISTS "anyone reads available products" ON public.products;
CREATE POLICY "anyone reads products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (true);
