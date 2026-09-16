/**
 * =====================================================================
 * CONTEÚDO EDITÁVEL DO SITE — Primeiro Reino Burger
 * ---------------------------------------------------------------------
 * Itens, preços, descrições e fotos vieram do cardápio oficial da casa
 * (menu.brendi.com.br/primeiro-reino), consultado em 10/09/2026.
 * Os preços são "a partir de" e podem variar conforme adicionais e
 * tamanho escolhidos no fechamento do pedido.
 *
 * Para atualizar: edite PRODUCTS abaixo (nome, descrição, preço, foto).
 * Para trocar o WhatsApp: edite WHATSAPP_NUMBER.
 * =====================================================================
 */

/** Fotos oficiais hospedadas pelo cardápio online da casa. */
const photo = (id: string) => `https://images.brendi.com.br/optimized/${id}`;

/** Número de WhatsApp (somente dígitos, com DDI + DDD). */
export const WHATSAPP_NUMBER = "5551995828342";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const HERO_PHOTO = photo("5738d6952c6e3ccbb31a58a76b35d710");

export const GALLERY = [
  { src: photo("7f05caf49cccb04b0308fd8d78117f30"), alt: "Castelo Inbox com mini smash burgers, nuggets e fritas" },
  { src: photo("844295da2ae808e32a059e6f71e7c541"), alt: "Baconudo com cheddar, bacon em tiras e molho cheddar" },
  { src: photo("72e7761b7ea163167340473772ab7edc"), alt: "Box Trinca com três hambúrgueres, fritas e anéis de cebola" },
  { src: photo("fa77d7d38aa2ac0713bcbab49f396400"), alt: "Rib Balls de costela desfiada recheados com três queijos" },
  { src: photo("45766e53589f86fe2334bb39f57f7ddf"), alt: "Xis Caramelizado com carne de panela e cebola caramelizada" },
];

export const INFO = {
  name: "Primeiro Reino Burger",
  city: "Porto Alegre – RS",
  address: "R. José Luiz Martins Costa, 1006 – Rubem Berta, Porto Alegre – RS, 91250-394",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Primeiro Reino Burger, R. José Luiz Martins Costa, 1006, Porto Alegre RS"),
  mapsEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("R. José Luiz Martins Costa, 1006, Rubem Berta, Porto Alegre - RS, 91250-394") +
    "&output=embed",
  instagram: "https://www.instagram.com/primeiroreinoburger/",
  tiktok: "https://www.tiktok.com/@primeiroreinoburger",
  menuReference: "https://menu.brendi.com.br/primeiro-reino/",
  hoursNote: "Abre às 11h · Consulte os horários de atendimento",
  minOrder: "Pedido mínimo R$ 27,00",
};

export type Category = "Burgers" | "Xis" | "Combos" | "Porções" | "Molhos" | "Bebidas";

export const CATEGORIES: Category[] = ["Burgers", "Xis", "Combos", "Porções", "Molhos", "Bebidas"];

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Preço "a partir de", em reais. */
  price: number;
  image: string;
  category: Category;
  tag?: string;
};

export const PRODUCTS: Product[] = [
  // ---------------- BURGERS ----------------
  {
    id: "derretudo",
    name: "Derretudo",
    description:
      "2 hambúrgueres de 150g, queijo cheddar, muito molho cheddar, cebola crispy, bacon em tiras e maionese da casa no pão brioche. Acompanha piscina de cheddar e bacon.",
    price: 59,
    image: photo("5738d6952c6e3ccbb31a58a76b35d710"),
    category: "Burgers",
    tag: "Pra quem tem fome",
  },
  {
    id: "baconudo",
    name: "Baconudo",
    description:
      "Hambúrguer de 150g, queijo cheddar, bacon em tiras, molho cheddar e maionese da casa. Servido em pão brioche tostado na manteiga de bacon.",
    price: 37,
    image: photo("844295da2ae808e32a059e6f71e7c541"),
    category: "Burgers",
    tag: "Clássico da casa",
  },
  {
    id: "gorgostoso",
    name: "Gorgostoso",
    description:
      "2 hambúrgueres de 150g, duplo cheddar, gorgonzola, cebola caramelizada, bacon empanado crocante e maionese da casa no pão brioche.",
    price: 59,
    image: photo("229efb829ade57122b5e79fc95e99064"),
    category: "Burgers",
  },
  {
    id: "provoloso",
    name: "Provoloso",
    description:
      "Hambúrguer de 150g, cheddar, cebola caramelizada, bacon em tiras e provolone empanado, no pão de gergelim tostado na manteiga de bacon.",
    price: 53,
    image: photo("366429dfbaa17c4d0b44c297dbc2e219"),
    category: "Burgers",
  },
  {
    id: "queijudo",
    name: "Queijudo",
    description:
      "Hambúrguer de 150g, cheddar, bacon em tiras, muito barbecue artesanal, maionese da casa e blend de cheddar empanado.",
    price: 48,
    image: photo("3660097bf322e7503c35e2f8bfbe21a1"),
    category: "Burgers",
  },
  {
    id: "costeloso",
    name: "Costeloso",
    description:
      "Hambúrguer de 150g, provolone, costela desfiada, rúcula, cebola roxa, barbecue artesanal e maionese da casa no pão brioche.",
    price: 43,
    image: photo("59781ff1ad07caacc6e9ee6f6fb80369"),
    category: "Burgers",
  },
  {
    id: "crocantissimo",
    name: "Crocantíssimo",
    description:
      "Hambúrguer de 150g com cheddar derretido, bacon crocante, picles, alface, tomate, cebola roxa e maionese medieval no pão francês artesanal.",
    price: 40,
    image: photo("85275a6887abb8464f21ce4583e0b9bf"),
    category: "Burgers",
  },
  {
    id: "grelhoso",
    name: "Grelhoso",
    description:
      "Hambúrguer de costela 150g, cheddar, bacon em tiras, alface, tomate, cebola crispy e maionese da casa no pão de gergelim.",
    price: 38,
    image: photo("bd4381f0654a177e6253c5cf0ac7e953"),
    category: "Burgers",
  },
  {
    id: "vegetilha",
    name: "Vegetilha",
    description:
      "Hambúrguer vegetariano de lentilha e cenoura, mussarela, cebola roxa, alface, tomate, picles e maionese real no pão brioche.",
    price: 38,
    image: photo("5f5604492b8348d841df01ae4eac3596"),
    category: "Burgers",
    tag: "Vegetariano",
  },
  {
    id: "francastico",
    name: "Francástico",
    description:
      "Peito de frango empanado, cheddar derretido, maionese medieval, molho cheddar, bacon em tiras, tomate e alface americana.",
    price: 35,
    image: photo("2a0cd64a46cf7e8a6807fa245a08ceab"),
    category: "Burgers",
  },
  {
    id: "saladelico",
    name: "Saladélico",
    description:
      "Hambúrguer de 150g, cheddar, alface americana, tomate, cebola roxa e maionese da casa no pão brioche tostado na manteiga de bacon.",
    price: 34,
    image: photo("982f6a6a4bc990abe0b68ea7c2369bc4"),
    category: "Burgers",
  },
  {
    id: "carameloso",
    name: "Carameloso",
    description:
      "Hambúrguer de 150g, cheddar, bacon em tiras, alface, tomate, cebola caramelizada e maionese tradicional no pão brioche.",
    price: 31,
    image: photo("225b7da8622dca1f5d8542cea2c34e71"),
    category: "Burgers",
  },
  {
    id: "originalzao",
    name: "Originalzão",
    description:
      "Hambúrguer de 150g, cheddar, cebola roxa, picles, alface, tomate, ketchup, mostarda e maionese no pão com gergelim.",
    price: 31,
    image: photo("1bc59e1c1ce02c168a5b128b5bfd60ce"),
    category: "Burgers",
  },
  {
    id: "simplaco",
    name: "Simplaço",
    description:
      "Hambúrguer de 150g, queijo cheddar bem derretido e maionese da casa no pão brioche tostado na manteiga de bacon.",
    price: 28,
    image: photo("f37f0c80e39bee4f38a745b9b22cdeca"),
    category: "Burgers",
  },
  {
    id: "ousadesimo",
    name: "Ousadésimo",
    description:
      "Hambúrguer de 150g, abacaxi caramelizado na chapa, queijo coalho no mel, bacon em tiras, rúcula e maionese tradicional.",
    price: 52,
    image: photo("261b78df1584355e6669771f1f6e5d9d"),
    category: "Burgers",
  },

  // ---------------- XIS ----------------
  {
    id: "xis-caramelizado",
    name: "Xis Caramelizado",
    description:
      "Carne de panela desfiada com requeijão, mussarela, gorgonzola, cebola caramelizada, alface, tomate e maionese da casa, finalizado na prensa.",
    price: 53,
    image: photo("45766e53589f86fe2334bb39f57f7ddf"),
    category: "Xis",
    tag: "Recomendado",
  },
  {
    id: "xis-coracao",
    name: "Xis Coração",
    description:
      "Coração bem temperadinho, mussarela derretida, ovo, alface, tomate, milho, ervilha e maionese da casa, finalizado na prensa.",
    price: 45,
    image: photo("082aea7d9d9d2fd51b1e81e98206163c"),
    category: "Xis",
  },
  {
    id: "xis-carne-de-panela",
    name: "Xis Carne de Panela",
    description:
      "Carne de panela desfiada com requeijão, mussarela, ovo, alface americana, tomate, milho e ervilha, com casquinha crocante da prensa.",
    price: 44,
    image: photo("fbb2eb99eba59f0cf6bc4d9d3add6c38"),
    category: "Xis",
  },
  {
    id: "xis-bacon",
    name: "Xis Bacon",
    description:
      "Hambúrguer bovino de 150g, mussarela, bacon em cubos, ovo, alface, tomate, milho, ervilha e maionese da casa.",
    price: 42,
    image: photo("3888a5a68769296c25248ae8593e2223"),
    category: "Xis",
  },
  {
    id: "xis-salada",
    name: "Xis Salada",
    description:
      "Hambúrguer bovino de 150g, mussarela, alface americana, tomate, milho, ervilha, ovo e maionese da casa na prensa.",
    price: 33,
    image: photo("28271beabeba2905be3d520fa8400fa9"),
    category: "Xis",
  },

  // ---------------- COMBOS ----------------
  {
    id: "castelo-inbox",
    name: "Castelo Inbox",
    description:
      "5 mini smash burgers, nuggets, dadinho de mussarela com bacon, rib balls e fritas crocantes com dois potinhos de molho. Serve 2 pessoas.",
    price: 155,
    image: photo("7f05caf49cccb04b0308fd8d78117f30"),
    category: "Combos",
    tag: "Jantar para dois",
  },
  {
    id: "imperio-inbox",
    name: "Império Inbox",
    description:
      "5 mini smash burgers, almofadinhas de mussarela e bacon, batatas com cheddar e bacon, nuggets artesanais e dois molhos. Serve 2 pessoas.",
    price: 138,
    image: photo("3f30a3b2043be25660ff8bdcb0b456aa"),
    category: "Combos",
  },
  {
    id: "box-quarteto",
    name: "Box Quarteto",
    description:
      "4 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 4 pessoas.",
    price: 163,
    image: photo("7d8bd45dcd8ba9e19b66cbb9016ec0c5"),
    category: "Combos",
  },
  {
    id: "box-trinca",
    name: "Box Trinca",
    description:
      "3 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 3 pessoas.",
    price: 131,
    image: photo("72e7761b7ea163167340473772ab7edc"),
    category: "Combos",
  },
  {
    id: "box-dueto",
    name: "Box Dueto",
    description:
      "2 hambúrgueres (Baconudo, Saladélico ou Simplaço) + fritas com cheddar e bacon + anéis de cebola. Serve 2 pessoas.",
    price: 99,
    image: photo("8d8aecebdd477dd826d14122f92e9dca"),
    category: "Combos",
  },
  {
    id: "box-solo",
    name: "Box Solo",
    description: "A box individual do reino: hambúrguer, acompanhamentos e molho para curtir sozinho.",
    price: 55,
    image: photo("96a0dbef422dba9b00b72edf5fae24c6"),
    category: "Combos",
    tag: "O favorito",
  },
  {
    id: "mini-box",
    name: "Mini Box",
    description:
      "Mini smash burgers com maionese tradicional e tirinhas de bacon + batatas com cheddar cremoso e bacon crocante. Serve 1 pessoa.",
    price: 47,
    image: photo("b2c77a8707340f59c40766c8b69ff673"),
    category: "Combos",
  },
  {
    id: "combo-kids",
    name: "Combo Kids",
    description: "O combo pensado para os pequenos do reino.",
    price: 38,
    image: photo("cc48545a11506db9782f3d693954a09f"),
    category: "Combos",
  },

  // ---------------- PORÇÕES ----------------
  {
    id: "rib-ball",
    name: "Rib Ball",
    description:
      "6 bolinhos de costela desfiada recheados com mussarela, provolone e Catupiry®. Acompanha molho sweet chilli. Serve 2 pessoas.",
    price: 45,
    image: photo("fa77d7d38aa2ac0713bcbab49f396400"),
    category: "Porções",
  },
  {
    id: "nuggets",
    name: "Nuggets",
    description:
      "6 unidades de nuggets de peito de frango, crocantes por fora e suculentos por dentro. Acompanha potinho de molho.",
    price: 30,
    image: photo("fc9860197eea5865ec2b2a6aa33f61c8"),
    category: "Porções",
  },
  {
    id: "aneis-de-cebola",
    name: "Anéis de Cebola Premium",
    description: "Porções P (8 un.), M (12 un.) e G (18 un.), crocantes na medida.",
    price: 18,
    image: photo("27d165fbb7f527ee86447d86f85a3ed5"),
    category: "Porções",
  },
  {
    id: "batata-frita",
    name: "Batata Frita Tradicional",
    description: "Batatas sequinhas e crocantes, já temperadas com sal para realçar o sabor.",
    price: 15,
    image: photo("85c6a5438e8ece1c2a4e629edf3743ec"),
    category: "Porções",
    tag: "Crocante",
  },
  {
    id: "cookie",
    name: "Cookie Tradicional",
    description:
      "Cookie artesanal feito na cozinha da casa, com gotas de chocolate nobre e recheio cremoso de chocolate.",
    price: 16,
    image: photo("7cf5429a14f59560e0fa7f1739acd843"),
    category: "Porções",
  },

  // ---------------- MOLHOS ----------------
  {
    id: "piscina-cheddar-bacon",
    name: "Piscina de Cheddar e Bacon",
    description: "Aquele extra de cheddar cremoso com bacon crocante para mergulhar as fritas.",
    price: 22,
    image: photo("39a48ff43abdfd21e085b660e238f9cf"),
    category: "Molhos",
  },
  {
    id: "maionese-real",
    name: "Potinho de Maionese Real",
    description: "Maionese da casa, cremosa e temperada.",
    price: 5,
    image: photo("86e004ec11e536dacae92fd0c0d7cf82"),
    category: "Molhos",
  },
  {
    id: "maionese-medieval",
    name: "Potinho de Maionese Medieval",
    description: "A versão mais marcante da maionese do reino.",
    price: 5,
    image: photo("e44122da45926e5fcb266ec629490803"),
    category: "Molhos",
  },
  {
    id: "molho-barbecue",
    name: "Potinho de Molho Barbecue",
    description: "Barbecue 100% artesanal, defumado na medida certa.",
    price: 5,
    image: photo("d0d8782d5d3870198f5090e6be6e20e0"),
    category: "Molhos",
  },
  {
    id: "molho-sweet-chilli",
    name: "Molho Sweet Chilli",
    description: "Agridoce com um toque leve de pimenta.",
    price: 5,
    image: photo("b54906cad961aaf8ff25a085c785c724"),
    category: "Molhos",
  },

  // ---------------- BEBIDAS ----------------
  {
    id: "coca-2l",
    name: "Coca-Cola 2L",
    description: "Garrafa de 2 litros gelada.",
    price: 17,
    image: photo("1230ec871896195815717c67ae0a7b56"),
    category: "Bebidas",
  },
  {
    id: "coca-zero-2l",
    name: "Coca-Cola Zero 2L",
    description: "Garrafa de 2 litros gelada.",
    price: 17,
    image: photo("0748661bd1c39c27ec11cdfd8a8fe224"),
    category: "Bebidas",
  },
  {
    id: "fanta-guarana-2l",
    name: "Fanta Guaraná 2L",
    description: "Garrafa de 2 litros gelada.",
    price: 17,
    image: photo("08ad07282a6d13285f0a1225ecd62bda"),
    category: "Bebidas",
  },
  {
    id: "coca-350",
    name: "Coca-Cola 350ml",
    description: "Lata bem gelada.",
    price: 8,
    image: photo("5a948a7df4f004212c0cbc620e94b170"),
    category: "Bebidas",
  },
  {
    id: "coca-zero-350",
    name: "Coca-Cola Zero 350ml",
    description: "Lata bem gelada.",
    price: 8,
    image: photo("2af2ddd8a32f9de5b02d4335a8b93658"),
    category: "Bebidas",
  },
  {
    id: "fanta-guarana-350",
    name: "Fanta Guaraná 350ml",
    description: "Lata bem gelada.",
    price: 8,
    image: photo("996c365aab0e413c94e4abf948d6c144"),
    category: "Bebidas",
  },
];

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
