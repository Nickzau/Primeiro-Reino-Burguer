import { useEffect, useMemo, useState } from "react";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatBRL, INFO, WHATSAPP_LINK } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { createOrder } from "@/lib/orders.functions";
import { useServerFn } from "@tanstack/react-start";

type Mode = "Entrega" | "Retirada";
type Payment = "Pix" | "Cartão" | "Dinheiro";

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-cream placeholder:text-muted-foreground focus:border-gold focus:outline-none";

export function CartDrawer() {
  const { items, isOpen, close, subtotal, setQuantity, remove, clear } = useCart();
  const createOrderFn = useServerFn(createOrder);
  const [mode, setMode] = useState<Mode>("Entrega");
  const [payment, setPayment] = useState<Payment>("Pix");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    complement: "",
    reference: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    void supabase.auth.getUser().then(({ data }) => setAuthenticated(Boolean(data.user)));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const message = useMemo(() => {
    const lines = items.map(
      (i) => `- ${i.quantity}x ${i.product.name} — ${formatBRL(i.product.price * i.quantity)}`,
    );
    const parts = [
      "Olá, Primeiro Reino Burger! 👑🍔",
      "",
      "Quero fazer um pedido:",
      "",
      ...lines,
      "",
      `Total: ${formatBRL(subtotal)}`,
      `Modalidade: ${mode}`,
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
    ];
    if (mode === "Entrega") {
      const address = [form.address, form.complement, form.reference].filter(Boolean).join(" – ");
      parts.push(`Endereço: ${address}`);
    }
    parts.push(`Pagamento: ${payment}`);
    if (form.notes.trim()) parts.push(`Observações: ${form.notes.trim()}`);
    return parts.join("\n");
  }, [items, subtotal, mode, payment, form]);

  const submit = async () => {
    if (items.length === 0) return;
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Informe seu nome e telefone para continuar.");
      return;
    }
    if (mode === "Entrega" && !form.address.trim()) {
      setError("Informe o endereço de entrega.");
      return;
    }
    setError(null);
    setSending(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setSending(false);
      setError("Crie sua conta ou entre para salvar e acompanhar este pedido.");
      return;
    }
    try {
      await createOrderFn({
        data: {
          customerName: form.name,
          customerPhone: form.phone,
          mode,
          payment,
          address: form.address,
          complement: form.complement,
          reference: form.reference,
          notes: form.notes,
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      });
      window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
      clear();
      close();
      setSending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível registrar o pedido.");
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Seu pedido"
    >
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={close}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <aside className="animate-rise-in relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <ShoppingBag className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <h2 className="truncate font-display text-2xl tracking-wide text-cream">Seu pedido</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-cream hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              Seu carrinho está vazio. Escolha um burger no cardápio para começar.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.product.id}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    loading="lazy"
                    width={160}
                    height={160}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <h3 className="truncate font-display text-lg tracking-wide text-cream">
                        {i.product.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remove(i.product.id)}
                        aria-label={`Remover ${i.product.name}`}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gold">{formatBRL(i.product.price * i.quantity)}</p>
                    <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-border px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(i.product.id, i.quantity - 1)}
                        aria-label={`Diminuir quantidade de ${i.product.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full text-cream hover:bg-secondary"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-4 text-center text-sm font-bold text-cream">
                        {i.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(i.product.id, i.quantity + 1)}
                        aria-label={`Aumentar quantidade de ${i.product.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full text-cream hover:bg-secondary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-2">
                {(["Entrega", "Retirada"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                      mode === m
                        ? "border-gold bg-secondary text-gold"
                        : "border-border bg-card text-muted-foreground hover:text-cream"
                    }`}
                  >
                    {m === "Retirada" ? "Retirar no local" : "Entrega"}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Nome
                  <input
                    className={`${fieldClass} mt-2`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </label>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Telefone
                  <input
                    className={`${fieldClass} mt-2`}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(51) 90000-0000"
                    inputMode="tel"
                  />
                </label>

                {mode === "Entrega" && (
                  <>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Endereço
                      <input
                        className={`${fieldClass} mt-2`}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Rua, número e bairro"
                      />
                    </label>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Complemento
                      <input
                        className={`${fieldClass} mt-2`}
                        value={form.complement}
                        onChange={(e) => setForm({ ...form, complement: e.target.value })}
                        placeholder="Apto, bloco, casa"
                      />
                    </label>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Referência
                      <input
                        className={`${fieldClass} mt-2`}
                        value={form.reference}
                        onChange={(e) => setForm({ ...form, reference: e.target.value })}
                        placeholder="Ponto de referência"
                      />
                    </label>
                  </>
                )}

                <fieldset>
                  <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Pagamento
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["Pix", "Cartão", "Dinheiro"] as Payment[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPayment(p)}
                        aria-pressed={payment === p}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                          payment === p
                            ? "border-gold bg-secondary text-gold"
                            : "border-border bg-card text-muted-foreground hover:text-cream"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Observações
                  <textarea
                    className={`${fieldClass} mt-2 min-h-20`}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Sem cebola, ponto da carne, troco para..."
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={clear}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive"
              >
                Limpar carrinho
              </button>
            </div>
          )}
        </div>

        <footer className="border-t border-border px-5 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-display text-2xl tracking-wide text-cream">Total</span>
            <span className="font-display text-3xl text-gold">{formatBRL(subtotal)}</span>
          </div>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            Taxa de entrega confirmada no WhatsApp. {INFO.hoursNote}
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {items.length > 0 && authenticated === false && (
            <div className="mt-3 rounded-2xl border border-gold/40 bg-secondary/40 p-4 text-sm text-cream">
              <p>
                Entre ou crie sua conta para registrar e acompanhar este pedido. Seus itens
                continuarão no carrinho.
              </p>
              <Link
                to="/cliente"
                className="mt-3 inline-flex rounded-full bg-gold-gradient px-4 py-2 font-bold text-primary-foreground"
              >
                Entrar ou criar conta
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={items.length === 0 || sending}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Abrindo WhatsApp...
              </>
            ) : (
              "Enviar pedido pelo WhatsApp"
            )}
          </button>
        </footer>
      </aside>
    </div>
  );
}
