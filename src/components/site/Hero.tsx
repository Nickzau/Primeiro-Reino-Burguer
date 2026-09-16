import { ArrowRight, MapPin } from "lucide-react";
import { HERO_PHOTO } from "@/data/menu";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section id="inicio" className="grain-noise relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] animate-pulse-glow rounded-full bg-secondary blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] animate-pulse-glow rounded-full bg-accent/40 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="animate-rise-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-surface/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Delivery em Porto Alegre
          </span>

          <h1 className="mt-6 text-[3.4rem] leading-[0.9] text-cream sm:text-7xl lg:text-[5.6rem]">
            O sabor que
            <br />
            <span className="text-gold-gradient">merece a coroa.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Hambúrgueres artesanais com carne bem temperada, fritas sequinhas e molhos marcantes.
            Monte seu pedido e receba em casa, com a mesma coroa que virou tradição na cidade.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#cardapio"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Montar meu pedido
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#cardapio"
              className="inline-flex items-center rounded-full border border-border bg-surface/60 px-8 py-4 font-display text-2xl tracking-wide text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Ver cardápio
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["4,8★", "Avaliação no Google"],
              ["+380 mil", "Seguidores no Instagram"],
              ["11h", "Abrimos a cozinha"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl text-gold">{value}</dt>
                <dd className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-6 animate-pulse-glow rounded-full bg-gold/25 blur-3xl"
          />
          <img
            src={HERO_PHOTO}
            alt="Derretudo: hambúrguer duplo com molho cheddar, bacon e cebola crispy"
            className="animate-float-slow relative aspect-square w-full rounded-[2.5rem] border border-border/70 object-cover shadow-royal"
          />
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-background/90 px-4 py-3 backdrop-blur-md">
            <Logo className="h-10 w-10" />
            <div>
              <p className="font-display text-lg leading-none text-cream">Feito no reino</p>
              <p className="text-xs text-muted-foreground">Artesanal, na hora do pedido</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
