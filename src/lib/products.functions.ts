import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { Category, Product } from "@/data/menu";

export type MenuProduct = Product & { isAvailable: boolean; sortOrder: number };

const rowToProduct = (row: {
  id: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  tag: string | null;
  is_available: boolean;
  sort_order: number;
}): MenuProduct => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  image: row.image,
  category: row.category as Category,
  ...(row.tag ? { tag: row.tag } : {}),
  isAvailable: row.is_available,
  sortOrder: row.sort_order,
});

/** Cardápio público, incluindo itens em falta para sinalização no site. */
export const listMenu = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const { data, error } = await client
    .from("products")
    .select("id, name, description, price, image, category, tag, is_available, sort_order")
    .order("sort_order", { ascending: true });

  if (error) return [] as MenuProduct[];
  return (data ?? []).map(rowToProduct);
});

/** Confere se a pessoa logada é administradora do cardápio. */
export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    // Sem auto-promoção: a permissão de administrador é concedida somente
    // por uma migração/seed confiável no banco de dados.
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) return { isAdmin: false };
    return { isAdmin: Boolean(data) };
  });

/** Cardápio completo para o painel (inclui itens ocultos). */
export const listAllProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("products")
      .select("id, name, description, price, image, category, tag, is_available, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToProduct);
  });

const productSchema = z.object({
  id: z
    .string()
    .trim()
    .min(2, "Informe um código para o produto")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  name: z.string().trim().min(2, "Informe o nome").max(80),
  description: z.string().trim().max(600).default(""),
  price: z.number().min(0, "Preço inválido").max(9999),
  image: z.string().trim().url("Informe o link da foto").max(500).or(z.literal("")),
  category: z.enum(["Burgers", "Xis", "Combos", "Porções", "Molhos", "Bebidas"]),
  tag: z.string().trim().max(40).optional().default(""),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(100000).default(0),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => productSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").upsert({
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      tag: data.tag ? data.tag : null,
      is_available: data.isAvailable,
      sort_order: data.sortOrder,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
