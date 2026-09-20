-- Defesa em profundidade: o banco também rejeita valores fora do domínio da aplicação.
ALTER TABLE public.products
  ADD CONSTRAINT products_price_nonnegative CHECK (price >= 0),
  ADD CONSTRAINT products_sort_order_nonnegative CHECK (sort_order >= 0),
  ADD CONSTRAINT products_name_not_blank CHECK (length(btrim(name)) >= 2),
  ADD CONSTRAINT products_category_valid CHECK (
    category IN ('Burgers', 'Xis', 'Combos', 'Porções', 'Molhos', 'Bebidas')
  );

ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_name_not_blank CHECK (length(btrim(customer_name)) >= 2),
  ADD CONSTRAINT orders_customer_phone_not_blank CHECK (length(btrim(customer_phone)) >= 8),
  ADD CONSTRAINT orders_mode_valid CHECK (mode IN ('Entrega', 'Retirada')),
  ADD CONSTRAINT orders_payment_valid CHECK (payment IN ('Pix', 'Cartão', 'Dinheiro')),
  ADD CONSTRAINT orders_status_valid CHECK (
    status IN ('novo', 'em produção', 'pronto', 'entregue', 'cancelado')
  ),
  ADD CONSTRAINT orders_subtotal_nonnegative CHECK (subtotal >= 0),
  ADD CONSTRAINT orders_items_array CHECK (jsonb_typeof(items) = 'array');
