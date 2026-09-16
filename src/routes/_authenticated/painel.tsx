import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { formatBRL } from "@/data/menu";
import {
  deleteProduct,
  getAdminStatus,
  listAllProducts,
  saveProduct,
  type MenuProduct,
} from "@/lib/products.functions";

const CATEGORY_OPTIONS = ["Burgers", "Xis", "Combos", "Porções", "Molhos", "Bebidas"] as const;

const title = "Painel do cardápio | Primeiro Reino Burger";
const description =
  "Área restrita para a equipe do Primeiro Reino Burger cadastrar e atualizar produtos, preços e fotos.";

export const Route = createFileRoute("/_authenticated/painel")({
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
  component: PanelPage,
});

type FormState = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: (typeof CATEGORY_OPTIONS)[number];
  tag: string;
  isAvailable: boolean;
  sortOrder: string;
};

const emptyForm: FormState = {
  id: "",
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Burgers",
  tag: "",
  isAvailable: true,
  sortOrder: "0",
};

const toForm = (p: MenuProduct): FormState => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: String(p.price),
  image: p.image,
  category: p.category as FormState["category"],
  tag: p.tag ?? "",
  isAvailable: p.isAvailable,
  sortOrder: String(p.sortOrder),
});

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-cream outline-none focus:border-gold";
const labelClass = "text-xs font-bold uppercase tracking-widest text-gold";

function PanelPage() {
  const queryClient = useQueryClient();
  const adminFn = useServerFn(getAdminStatus);
  const listFn = useServerFn(listAllProducts);
  const saveFn = useServerFn(saveProduct);
  const removeFn = useServerFn(deleteProduct);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => adminFn() });
  const products = useQuery({
    queryKey: ["all-products"],
    queryFn: () => listFn(),
    enabled: admin.data?.isAdmin === true,
  });

  const save = useMutation({
    mutationFn: (data: FormState) =>
      saveFn({
        data: {
          id: data.id.trim().toLowerCase(),
          name: data.name,
          description: data.description,
          price: Number(data.price.replace(",", ".")) || 0,
          image: data.image.trim(),
          category: data.category,
          tag: data.tag,
          isAvailable: data.isAvailable,
          sortOrder: Number(data.sortOrder) || 0,
        },
      }),
    onSuccess: () => {
      setFeedback(editing ? "Produto atualizado." : "Produto cadastrado.");
      setError(null);
      setForm(emptyForm);
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
    onError: (err: unknown) => {
      setFeedback(null);
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: () => {
      setFeedback("Produto excluído.");
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
    onError: (err: unknown) =>
      setError(err instanceof Error ? err.message : "Não foi possível excluir."),
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
            Sua conta ainda não tem permissão para editar o cardápio. Peça para a pessoa
            administradora liberar seu acesso.
          </p>
          <Link to="/" className="mt-6 inline-block text-gold hover:underline">
            Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div>
              <h1 className="font-display text-3xl tracking-wide text-cream">Painel do cardápio</h1>
              <p className="text-sm text-muted-foreground">
                Cadastre, edite, oculte ou exclua itens do cardápio.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gold hover:underline">
              Ver site
            </Link>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="rounded-full border border-border px-4 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-cream"
            >
              Sair
            </button>
          </div>
        </header>

        {(feedback || error) && (
          <p
            role="status"
            className={`mt-6 rounded-xl px-4 py-3 text-sm ${
              error ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent"
            }`}
          >
            {error ?? feedback}
          </p>
        )}

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-royal">
          <h2 className="font-display text-2xl tracking-wide text-cream">
            {editing ? `Editando: ${form.name || form.id}` : "Novo produto"}
          </h2>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              save.mutate(form);
            }}
          >
            <div>
              <label className={labelClass} htmlFor="p-id">
                Código (sem espaços)
              </label>
              <input
                id="p-id"
                required
                readOnly={editing}
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className={inputClass}
                placeholder="derretudo"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="p-name">
                Nome
              </label>
              <input
                id="p-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="p-desc">
                Descrição
              </label>
              <textarea
                id="p-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="p-price">
                Preço (R$)
              </label>
              <input
                id="p-price"
                required
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
                placeholder="32,90"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="p-cat">
                Categoria
              </label>
              <select
                id="p-cat"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as FormState["category"] })
                }
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="p-img">
                Link da foto
              </label>
              <input
                id="p-img"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="p-tag">
                Selo (opcional)
              </label>
              <input
                id="p-tag"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={inputClass}
                placeholder="Mais pedido"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="p-order">
                Ordem
              </label>
              <input
                id="p-order"
                inputMode="numeric"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-cream sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="h-4 w-4 accent-[hsl(var(--gold))]"
              />
              Mostrar este item no site
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={save.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-display text-lg tracking-wide text-primary-foreground disabled:opacity-60"
              >
                {save.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Plus className="h-5 w-5" aria-hidden="true" />
                )}
                {editing ? "Salvar alterações" : "Cadastrar produto"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditing(false);
                  }}
                  className="rounded-full border border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-cream"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-cream">
            Itens cadastrados {products.data ? `(${products.data.length})` : ""}
          </h2>
          {products.isPending ? (
            <p className="mt-4 text-sm text-muted-foreground">Carregando cardápio...</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(products.data ?? []).map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-surface" aria-hidden="true" />
                  )}
                  <div className="min-w-[12rem] flex-1">
                    <p className="font-bold text-cream">
                      {p.name}{" "}
                      {!p.isAvailable && (
                        <span className="ml-1 text-xs uppercase tracking-widest text-muted-foreground">
                          oculto
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · {formatBRL(p.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(toForm(p));
                        setEditing(true);
                        setFeedback(null);
                        setError(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-full border border-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Excluir "${p.name}"?`)) remove.mutate(p.id);
                      }}
                      aria-label={`Excluir ${p.name}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
