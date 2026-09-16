import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { formatBRL } from "@/data/menu";
import { getAdminStatus } from "@/lib/products.functions";
import {
  deleteOrder,
  listOrders,
  ORDER_STATUSES,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders.functions";

const title = "Pedidos recebidos | Primeiro Reino Burger";
const description =
  "Área restrita da equipe do Primeiro Reino Burger para acompanhar e produzir os pedidos recebidos.";

export const Route = createFileRoute("/_authenticated/pedidos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrdersPage,
});

const statusStyle: Record<OrderStatus, string> = {
  novo: "border-gold text-gold",
  "em produção": "border-accent text-accent",
  pronto: "border-primary text-primary",
  entregue: "border-border text-muted-foreground",
  cancelado: "border-destructive text-destructive",
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function OrderCard({
  order,
  onStatus,
  onDelete,
}: {
  order: Order;
  onStatus: (status: OrderStatus) => void;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-3xl border border-border bg-card p-5 shadow-royal">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl tracking-wide text-cream">
            #{order.code} · {order.customerName}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTime(order.createdAt)} · {order.mode} · {order.payment} · {order.customerPhone}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${statusStyle[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <ul className="mt-4 space-y-1 text-sm text-cream">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-3">
            <span>
              {i.quantity}x {i.name}
            </span>
            <span className="text-gold">{formatBRL(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-bold text-cream">
        <span>Total</span>
        <span className="text-gold">{formatBRL(order.subtotal)}</span>
      </p>

      {order.mode === "Entrega" && order.address && (
        <p className="mt-3 text-sm text-muted-foreground">
          Endereço: {[order.address, order.complement, order.reference].filter(Boolean).join(" – ")}
        </p>
      )}
      {order.notes && (
        <p className="mt-1 text-sm text-muted-foreground">Observações: {order.notes}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(s)}
            disabled={order.status === s}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              order.status === s
                ? "border-gold bg-secondary text-gold"
                : "border-border text-muted-foreground hover:text-cream"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Excluir pedido ${order.code}`}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Excluir
        </button>
      </div>
    </li>
  );
}

function OrdersPage() {
  const queryClient = useQueryClient();
  const adminFn = useServerFn(getAdminStatus);
  const listFn = useServerFn(listOrders);
  const statusFn = useServerFn(updateOrderStatus);
  const removeFn = useServerFn(deleteOrder);

  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => adminFn() });
  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: () => listFn(),
    enabled: admin.data?.isAdmin === true,
    refetchInterval: 15000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["orders"] });

  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: OrderStatus }) => statusFn({ data: v }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: invalidate,
  });

  if (admin.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" aria-hidden="true" />
      </main>
    );
  }

  if (!admin.data?.isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl tracking-wide text-cream">Acesso restrito</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua conta ainda não tem permissão para ver os pedidos. Peça para a pessoa administradora
            liberar seu acesso.
          </p>
          <Link to="/" className="mt-6 inline-block text-gold hover:underline">
            Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  const list = orders.data ?? [];
  const active = list.filter((o) => o.status === "novo" || o.status === "em produção");
  const done = list.filter((o) => o.status !== "novo" && o.status !== "em produção");

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div>
              <h1 className="font-display text-3xl tracking-wide text-cream">Pedidos recebidos</h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe a produção. A lista atualiza sozinha a cada 15 segundos.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/painel" className="text-sm text-gold hover:underline">
              Cardápio
            </Link>
            <button
              type="button"
              onClick={() => orders.refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-cream"
            >
              <RefreshCw
                className={`h-4 w-4 ${orders.isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Atualizar
            </button>
          </div>
        </header>

        {orders.isPending ? (
          <p className="mt-8 text-sm text-muted-foreground">Carregando pedidos...</p>
        ) : list.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Nenhum pedido recebido ainda. Assim que alguém finalizar um pedido no site, ele aparece
            aqui.
          </p>
        ) : (
          <>
            <h2 className="mt-10 font-display text-2xl tracking-wide text-cream">
              Em andamento ({active.length})
            </h2>
            <ul className="mt-4 space-y-4">
              {active.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onStatus={(status) => setStatus.mutate({ id: o.id, status })}
                  onDelete={() => {
                    if (window.confirm(`Excluir o pedido #${o.code}?`)) remove.mutate(o.id);
                  }}
                />
              ))}
              {active.length === 0 && (
                <li className="text-sm text-muted-foreground">Nenhum pedido em andamento.</li>
              )}
            </ul>

            {done.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-2xl tracking-wide text-cream">
                  Finalizados ({done.length})
                </h2>
                <ul className="mt-4 space-y-4">
                  {done.map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      onStatus={(status) => setStatus.mutate({ id: o.id, status })}
                      onDelete={() => {
                        if (window.confirm(`Excluir o pedido #${o.code}?`)) remove.mutate(o.id);
                      }}
                    />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
