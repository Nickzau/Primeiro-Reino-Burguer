const STEPS = [
  { n: "01", title: "Escolha seus itens", text: "Navegue pelo cardápio e toque em adicionar." },
  { n: "02", title: "Confira o carrinho", text: "Ajuste quantidades e veja o total do pedido." },
  { n: "03", title: "Envie pelo WhatsApp", text: "Preencha seus dados e envie a mensagem pronta." },
  { n: "04", title: "Receba ou retire", text: "Entrega em Porto Alegre ou retirada no local." },
];

export function HowItWorks() {
  return (
    <section className="section-pad bg-surface">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Como funciona</p>
        <h2 className="mt-3 max-w-2xl text-5xl text-cream md:text-6xl">Do clique à mordida</h2>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-3xl border border-border bg-card p-6 shadow-royal">
              <span className="font-display text-4xl text-gold-gradient">{s.n}</span>
              <h3 className="mt-4 font-display text-2xl tracking-wide text-cream">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
