import { Beef, Flame, Droplets, PackageCheck } from "lucide-react";

const ITEMS = [
  { icon: Beef, title: "Carne bem temperada", text: "Blend suculento, selado na chapa e temperado no ponto certo." },
  { icon: Flame, title: "Fritas crocantes", text: "Sequinhas por fora, macias por dentro. Do jeito que tem que ser." },
  { icon: Droplets, title: "Molhos marcantes", text: "Receitas da casa que dão personalidade a cada mordida." },
  { icon: PackageCheck, title: "Entrega com cuidado", text: "Embalagem bem feita e entrega rápida para chegar quentinho." },
];

export function Features() {
  return (
    <section id="sobre" className="section-pad scroll-mt-20 bg-royal">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-soft">Por que o reino</p>
          <h2 className="mt-3 text-5xl text-cream md:text-6xl">Hambúrgueres que valem cada mordida</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-gold/20 bg-background/35 p-6 backdrop-blur-sm transition-colors hover:border-gold/60"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-gradient text-primary-foreground">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-2xl tracking-wide text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
