import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#combos", label: "Combos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#localizacao", label: "Localização" },
];

export function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-border/70 bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:px-8">
        <a href="#inicio" className="flex min-w-0 items-center gap-3">
          <Logo className="h-11 w-11 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate font-display text-xl leading-none tracking-wide text-cream md:text-2xl">
              Primeiro Reino
            </span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold">
              Burger
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2 md:gap-6">
          <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={open}
            aria-label={`Abrir carrinho com ${count} item(ns)`}
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[0.7rem] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>

          <a
            href="#cardapio"
            className="hidden shrink-0 rounded-full bg-gold-gradient px-6 py-3 font-display text-lg tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] sm:block"
          >
            Pedir agora
          </a>
          <a
            href="/cliente"
            className="hidden shrink-0 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-gold sm:block"
          >
            Área do cliente
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-cream lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navegação mobile"
          className="animate-rise-in border-t border-border bg-background/97 px-4 pb-6 pt-2 backdrop-blur-xl lg:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-border/60 py-3 font-display text-2xl tracking-wide text-cream hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
