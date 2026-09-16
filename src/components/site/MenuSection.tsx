import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Plus } from "lucide-react";
import { CATEGORIES, PRODUCTS, formatBRL, type Category, type Product } from "@/data/menu";
import { listMenu } from "@/lib/products.functions";
import { useCart } from "@/lib/cart";


function ProductCard({ product }: { product: Product }) {
  const { add, lastAddedId } = useCart();
  const justAdded = lastAddedId === product.id;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-royal transition-all duration-300 hover:-translate-y-1 hover:border-gold/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-primary-foreground">
            {product.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl tracking-wide text-cream">{product.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="font-display text-2xl text-gold">{formatBRL(product.price)}</span>
          <button
            type="button"
            onClick={() => add(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
              justAdded
                ? "bg-accent text-accent-foreground"
                : "bg-gold-gradient text-primary-foreground hover:scale-[1.04]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" /> Adicionado
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" /> Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function MenuSection() {
  const [active, setActive] = useState<Category>("Burgers");
  const menuFn = useServerFn(listMenu);
  const menu = useQuery({ queryKey: ["menu"], queryFn: () => menuFn() });
  const all: Product[] = menu.data && menu.data.length > 0 ? menu.data : PRODUCTS;
  const list = all.filter((p) => p.category === active);


  return (
    <section id="cardapio" className="section-pad relative scroll-mt-20">
      <div id="combos" className="absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Destaques da casa</p>
          <h2 className="mt-3 text-5xl text-cream md:text-6xl">Escolha o seu favorito</h2>
          <p className="mt-4 text-muted-foreground">
            Itens, fotos e preços do cardápio oficial da casa. Valores "a partir de" — adicionais e
            tamanhos podem alterar o total, confirmado no WhatsApp. Pedido mínimo R$ 27,00.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="mt-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={active === c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                active === c
                  ? "border-gold bg-secondary text-gold"
                  : "border-border bg-surface text-muted-foreground hover:border-gold/50 hover:text-cream"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={`${active}-${p.id}`} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
