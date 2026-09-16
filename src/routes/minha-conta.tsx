import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Clock3, MapPin, Package, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { signOutEverywhere } from "@/components/auth/SessionSecurity";
import { formatBRL } from "@/data/menu";
import { listCustomerOrders, type Order, type OrderStatus } from "@/lib/orders.functions";

export const Route = createFileRoute("/minha-conta")({
  ssr: false,
  component: CustomerAccountPage,
});

const statusSteps: { status: OrderStatus; label: string; icon: typeof Clock3 }[] = [
  { status: "novo", label: "Recebido", icon: Clock3 },
  { status: "em produção", label: "Em preparação", icon: Package },
  { status: "pronto", label: "A caminho", icon: Truck },
  { status: "entregue", label: "Entregue", icon: Check },
];

function progressIndex(status: OrderStatus) {
  if (status === "cancelado") return -1;
  return statusSteps.findIndex((step) => step.status === status);
}

function OrderTimeline({ order }: { order: Order }) {
  const current = progressIndex(order.status);
  return (
    <div className="mt-5 grid grid-cols-4 gap-1">
      {statusSteps.map((step, index) => {
        const Icon = step.icon;
        const reached = current >= index;
        return (
          <div key={step.status} className={`text-center ${reached ? "text-gold" : "text-muted-foreground"}`}>
            <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full border ${reached ? "border-gold bg-secondary" : "border-border bg-surface"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wide">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-royal">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-wide text-cream">Pedido #{order.code}</h2>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${order.status === "cancelado" ? "border-destructive text-destructive" : "border-gold text-gold"}`}>
          {order.status}
        </span>
      </div>
      <OrderTimeline order={order} />
      <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-cream">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span>{item.quantity}x {item.name}</span><span className="text-gold">{formatBRL(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between border-t border-border pt-3 font-bold text-cream">
        <span>Total</span><span className="text-gold">{formatBRL(order.subtotal)}</span>
      </p>
      {order.mode === "Entrega" && <p className="mt-3 flex gap-2 text-xs text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{[order.address, order.complement].filter(Boolean).join(" – ")}</p>}
    </article>
  );
}

function CustomerAccountPage() {
  const listFn = useServerFn(listCustomerOrders);
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });
  const orders = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => listFn(),
    enabled: Boolean(user),
    refetchInterval: 15000,
  });

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center"><div><h1 className="font-display text-3xl text-cream">Entre para acompanhar pedidos</h1><p className="mt-3 text-sm text-muted-foreground">Crie sua conta ou faça login para ver seu histórico.</p><Link to="/auth" className="mt-6 inline-flex rounded-full bg-gold-gradient px-6 py-3 font-display text-xl text-primary-foreground">Entrar ou criar conta</Link></div></main>;
  }

  const list = orders.data ?? [];
  const active = list.filter((order) => order.status !== "entregue" && order.status !== "cancelado");
  const delivered = list.filter((order) => order.status === "entregue");
  return <main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-3xl">
    <header className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><Logo className="h-12 w-12" /><div><p className="text-xs uppercase tracking-widest text-gold">Minha conta</p><h1 className="font-display text-3xl tracking-wide text-cream">{user.email}</h1></div></div><div className="flex flex-wrap gap-4"><Link to="/" className="text-sm text-gold hover:underline">Voltar ao site</Link><button type="button" className="text-sm text-muted-foreground hover:text-cream" onClick={() => supabase.auth.signOut().then(() => { window.location.href = "/"; })}>Sair</button><button type="button" className="text-sm text-destructive hover:underline" onClick={signOutEverywhere}>Sair de todos os dispositivos</button></div></header>
    <section className="mt-10"><h2 className="font-display text-2xl tracking-wide text-cream">Pedidos em andamento</h2>{orders.isPending ? <p className="mt-4 text-sm text-muted-foreground">Carregando pedidos...</p> : active.length ? <div className="mt-4 space-y-4">{active.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <p className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Você não tem pedidos em andamento.</p>}</section>
    <section className="mt-10"><h2 className="font-display text-2xl tracking-wide text-cream">Pedidos entregues</h2>{delivered.length ? <div className="mt-4 space-y-4">{delivered.map((order) => <OrderCard key={order.id} order={order} />)}</div> : <p className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Seu histórico de pedidos entregues aparecerá aqui.</p>}</section>
  </div></main>;
}
