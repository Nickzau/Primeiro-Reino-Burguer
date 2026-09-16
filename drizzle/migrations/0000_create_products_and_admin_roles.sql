CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  category text NOT NULL,
  tag text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads available products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_available = true);

CREATE POLICY "admins read all products" ON public.products
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_touch_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.products (id, name, description, price, image, category, tag, sort_order) VALUES
  ('derretudo', 'Derretudo', '2 hambúrgueres de 150g, queijo cheddar, muito molho cheddar, cebola crispy, bacon em tiras e maionese da casa no pão brioche. Acompanha piscina de cheddar e bacon.', 59, 'https://images.brendi.com.br/optimized/5738d6952c6e3ccbb31a58a76b35d710', 'Burgers', 'Pra quem tem fome', 0),
  ('baconudo', 'Baconudo', 'Hambúrguer de 150g, queijo cheddar, bacon em tiras, molho cheddar e maionese da casa. Servido em pão brioche tostado na manteiga de bacon.', 37, 'https://images.brendi.com.br/optimized/844295da2ae808e32a059e6f71e7c541', 'Burgers', 'Clássico da casa', 10),
  ('gorgostoso', 'Gorgostoso', '2 hambúrgueres de 150g, duplo cheddar, gorgonzola, cebola caramelizada, bacon empanado crocante e maionese da casa no pão brioche.', 59, 'https://images.brendi.com.br/optimized/229efb829ade57122b5e79fc95e99064', 'Burgers', NULL, 20),
  ('provoloso', 'Provoloso', 'Hambúrguer de 150g, cheddar, cebola caramelizada, bacon em tiras e provolone empanado, no pão de gergelim tostado na manteiga de bacon.', 53, 'https://images.brendi.com.br/optimized/366429dfbaa17c4d0b44c297dbc2e219', 'Burgers', NULL, 30),
  ('queijudo', 'Queijudo', 'Hambúrguer de 150g, cheddar, bacon em tiras, muito barbecue artesanal, maionese da casa e blend de cheddar empanado.', 48, 'https://images.brendi.com.br/optimized/3660097bf322e7503c35e2f8bfbe21a1', 'Burgers', NULL, 40),
  ('costeloso', 'Costeloso', 'Hambúrguer de 150g, provolone, costela desfiada, rúcula, cebola roxa, barbecue artesanal e maionese da casa no pão brioche.', 43, 'https://images.brendi.com.br/optimized/59781ff1ad07caacc6e9ee6f6fb80369', 'Burgers', NULL, 50),
  ('crocantissimo', 'Crocantíssimo', 'Hambúrguer de 150g com cheddar derretido, bacon crocante, picles, alface, tomate, cebola roxa e maionese medieval no pão francês artesanal.', 40, 'https://images.brendi.com.br/optimized/85275a6887abb8464f21ce4583e0b9bf', 'Burgers', NULL, 60),
  ('grelhoso', 'Grelhoso', 'Hambúrguer de costela 150g, cheddar, bacon em tiras, alface, tomate, cebola crispy e maionese da casa no pão de gergelim.', 38, 'https://images.brendi.com.br/optimized/bd4381f0654a177e6253c5cf0ac7e953', 'Burgers', NULL, 70),
  ('vegetilha', 'Vegetilha', 'Hambúrguer vegetariano de lentilha e cenoura, mussarela, cebola roxa, alface, tomate, picles e maionese real no pão brioche.', 38, 'https://images.brendi.com.br/optimized/5f5604492b8348d841df01ae4eac3596', 'Burgers', 'Vegetariano', 80),
  ('francastico', 'Francástico', 'Peito de frango empanado, cheddar derretido, maionese medieval, molho cheddar, bacon em tiras, tomate e alface americana.', 35, 'https://images.brendi.com.br/optimized/2a0cd64a46cf7e8a6807fa245a08ceab', 'Burgers', NULL, 90),
  ('saladelico', 'Saladélico', 'Hambúrguer de 150g, cheddar, alface americana, tomate, cebola roxa e maionese da casa no pão brioche tostado na manteiga de bacon.', 34, 'https://images.brendi.com.br/optimized/982f6a6a4bc990abe0b68ea7c2369bc4', 'Burgers', NULL, 100),
  ('carameloso', 'Carameloso', 'Hambúrguer de 150g, cheddar, bacon em tiras, alface, tomate, cebola caramelizada e maionese tradicional no pão brioche.', 31, 'https://images.brendi.com.br/optimized/225b7da8622dca1f5d8542cea2c34e71', 'Burgers', NULL, 110),
  ('originalzao', 'Originalzão', 'Hambúrguer de 150g, cheddar, cebola roxa, picles, alface, tomate, ketchup, mostarda e maionese no pão com gergelim.', 31, 'https://images.brendi.com.br/optimized/1bc59e1c1ce02c168a5b128b5bfd60ce', 'Burgers', NULL, 120),
  ('simplaco', 'Simplaço', 'Hambúrguer de 150g, queijo cheddar bem derretido e maionese da casa no pão brioche tostado na manteiga de bacon.', 28, 'https://images.brendi.com.br/optimized/f37f0c80e39bee4f38a745b9b22cdeca', 'Burgers', NULL, 130),
  ('ousadesimo', 'Ousadésimo', 'Hambúrguer de 150g, abacaxi caramelizado na chapa, queijo coalho no mel, bacon em tiras, rúcula e maionese tradicional.', 52, 'https://images.brendi.com.br/optimized/261b78df1584355e6669771f1f6e5d9d', 'Burgers', NULL, 140),
  ('xis-caramelizado', 'Xis Caramelizado', 'Carne de panela desfiada com requeijão, mussarela, gorgonzola, cebola caramelizada, alface, tomate e maionese da casa, finalizado na prensa.', 53, 'https://images.brendi.com.br/optimized/45766e53589f86fe2334bb39f57f7ddf', 'Xis', 'Recomendado', 150),
  ('xis-coracao', 'Xis Coração', 'Coração bem temperadinho, mussarela derretida, ovo, alface, tomate, milho, ervilha e maionese da casa, finalizado na prensa.', 45, 'https://images.brendi.com.br/optimized/082aea7d9d9d2fd51b1e81e98206163c', 'Xis', NULL, 160),
  ('xis-carne-de-panela', 'Xis Carne de Panela', 'Carne de panela desfiada com requeijão, mussarela, ovo, alface americana, tomate, milho e ervilha, com casquinha crocante da prensa.', 44, 'https://images.brendi.com.br/optimized/fbb2eb99eba59f0cf6bc4d9d3add6c38', 'Xis', NULL, 170),
  ('xis-bacon', 'Xis Bacon', 'Hambúrguer bovino de 150g, mussarela, bacon em cubos, ovo, alface, tomate, milho, ervilha e maionese da casa.', 42, 'https://images.brendi.com.br/optimized/3888a5a68769296c25248ae8593e2223', 'Xis', NULL, 180),
  ('xis-salada', 'Xis Salada', 'Hambúrguer bovino de 150g, mussarela, alface americana, tomate, milho, ervilha, ovo e maionese da casa na prensa.', 33, 'https://images.brendi.com.br/optimized/28271beabeba2905be3d520fa8400fa9', 'Xis', NULL, 190),
  ('castelo-inbox', 'Castelo Inbox', '5 mini smash burgers, nuggets, dadinho de mussarela com bacon, rib balls e fritas crocantes com dois potinhos de molho. Serve 2 pessoas.', 155, 'https://images.brendi.com.br/optimized/7f05caf49cccb04b0308fd8d78117f30', 'Combos', 'Jantar para dois', 200),
  ('imperio-inbox', 'Império Inbox', '5 mini smash burgers, almofadinhas de mussarela e bacon, batatas com cheddar e bacon, nuggets artesanais e dois molhos. Serve 2 pessoas.', 138, 'https://images.brendi.com.br/optimized/3f30a3b2043be25660ff8bdcb0b456aa', 'Combos', NULL, 210),
  ('box-quarteto', 'Box Quarteto', '4 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 4 pessoas.', 163, 'https://images.brendi.com.br/optimized/7d8bd45dcd8ba9e19b66cbb9016ec0c5', 'Combos', NULL, 220),
  ('box-trinca', 'Box Trinca', '3 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 3 pessoas.', 131, 'https://images.brendi.com.br/optimized/72e7761b7ea163167340473772ab7edc', 'Combos', NULL, 230),
  ('box-dueto', 'Box Dueto', '2 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 2 pessoas.', 99, 'https://images.brendi.com.br/optimized/8d8aecebdd477dd826d14122f92e9dca', 'Combos', NULL, 240),
  ('box-solo', 'Box Solo', 'A box individual do reino: hambúrguer, acompanhamentos e molho para curtir sozinho.', 55, 'https://images.brendi.com.br/optimized/96a0dbef422dba9b00b72edf5fae24c6', 'Combos', 'O favorito', 250),
  ('mini-box', 'Mini Box', 'Mini smash burgers com maionese tradicional e tirinhas de bacon + batatas com cheddar cremoso e bacon crocante. Serve 1 pessoa.', 47, 'https://images.brendi.com.br/optimized/b2c77a8707340f59c40766c8b69ff673', 'Combos', NULL, 260),
  ('combo-kids', 'Combo Kids', 'O combo pensado para os pequenos do reino.', 38, 'https://images.brendi.com.br/optimized/cc48545a11506db9782f3d693954a09f', 'Combos', NULL, 270),
  ('rib-ball', 'Rib Ball', '6 bolinhos de costela desfiada recheados com mussarela, provolone e Catupiry®. Acompanha molho sweet chilli. Serve 2 pessoas.', 45, 'https://images.brendi.com.br/optimized/fa77d7d38aa2ac0713bcbab49f396400', 'Porções', NULL, 280),
  ('nuggets', 'Nuggets', '6 unidades de nuggets de peito de frango, crocantes por fora e suculentos por dentro. Acompanha potinho de molho.', 30, 'https://images.brendi.com.br/optimized/fc9860197eea5865ec2b2a6aa33f61c8', 'Porções', NULL, 290),
  ('aneis-de-cebola', 'Anéis de Cebola Premium', 'Porções P (8 un.), M (12 un.) e G (18 un.), crocantes na medida.', 18, 'https://images.brendi.com.br/optimized/27d165fbb7f527ee86447d86f85a3ed5', 'Porções', NULL, 300),
  ('batata-frita', 'Batata Frita Tradicional', 'Batatas sequinhas e crocantes, já temperadas com sal para realçar o sabor.', 15, 'https://images.brendi.com.br/optimized/85c6a5438e8ece1c2a4e629edf3743ec', 'Porções', 'Crocante', 310),
  ('cookie', 'Cookie Tradicional', 'Cookie artesanal feito na cozinha da casa, com gotas de chocolate nobre e recheio cremoso de chocolate.', 16, 'https://images.brendi.com.br/optimized/7cf5429a14f59560e0fa7f1739acd843', 'Porções', NULL, 320),
  ('piscina-cheddar-bacon', 'Piscina de Cheddar e Bacon', 'Aquele extra de cheddar cremoso com bacon crocante para mergulhar as fritas.', 22, 'https://images.brendi.com.br/optimized/39a48ff43abdfd21e085b660e238f9cf', 'Molhos', NULL, 330),
  ('maionese-real', 'Potinho de Maionese Real', 'Maionese da casa, cremosa e temperada.', 5, 'https://images.brendi.com.br/optimized/86e004ec11e536dacae92fd0c0d7cf82', 'Molhos', NULL, 340),
  ('maionese-medieval', 'Potinho de Maionese Medieval', 'A versão mais marcante da maionese do reino.', 5, 'https://images.brendi.com.br/optimized/e44122da45926e5fcb266ec629490803', 'Molhos', NULL, 350),
  ('molho-barbecue', 'Potinho de Molho Barbecue', 'Barbecue 100% artesanal, defumado na medida certa.', 5, 'https://images.brendi.com.br/optimized/d0d8782d5d3870198f5090e6be6e20e0', 'Molhos', NULL, 360),
  ('molho-sweet-chilli', 'Molho Sweet Chilli', 'Agridoce com um toque leve de pimenta.', 5, 'https://images.brendi.com.br/optimized/b54906cad961aaf8ff25a085c785c724', 'Molhos', NULL, 370),
  ('coca-2l', 'Coca-Cola 2L', 'Garrafa de 2 litros gelada.', 17, 'https://images.brendi.com.br/optimized/1230ec871896195815717c67ae0a7b56', 'Bebidas', NULL, 380),
  ('coca-zero-2l', 'Coca-Cola Zero 2L', 'Garrafa de 2 litros gelada.', 17, 'https://images.brendi.com.br/optimized/0748661bd1c39c27ec11cdfd8a8fe224', 'Bebidas', NULL, 390),
  ('fanta-guarana-2l', 'Fanta Guaraná 2L', 'Garrafa de 2 litros gelada.', 17, 'https://images.brendi.com.br/optimized/08ad07282a6d13285f0a1225ecd62bda', 'Bebidas', NULL, 400),
  ('coca-350', 'Coca-Cola 350ml', 'Lata bem gelada.', 8, 'https://images.brendi.com.br/optimized/5a948a7df4f004212c0cbc620e94b170', 'Bebidas', NULL, 410),
  ('coca-zero-350', 'Coca-Cola Zero 350ml', 'Lata bem gelada.', 8, 'https://images.brendi.com.br/optimized/2af2ddd8a32f9de5b02d4335a8b93658', 'Bebidas', NULL, 420),
  ('fanta-guarana-350', 'Fanta Guaraná 350ml', 'Lata bem gelada.', 8, 'https://images.brendi.com.br/optimized/996c365aab0e413c94e4abf948d6c144', 'Bebidas', NULL, 430);
