import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ORDER_STATUSES = ["novo", "em produção", "pronto", "entregue", "cancelado"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = { id: string; name: string; quantity: number; price: number };

export type Order = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  mode: string;
  payment: string;
  address: string;
  complement: string;
  reference: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
};

const itemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(99),
  price: z.number().min(0).max(9999),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Informe o nome").max(80),
  customerPhone: z.string().trim().min(8, "Informe o telefone").max(30),
  mode: z.enum(["Entrega", "Retirada"]),
  payment: z.enum(["Pix", "Cartão", "Dinheiro"]),
  address: z.string().trim().max(200).default(""),
  complement: z.string().trim().max(120).default(""),
  reference: z.string().trim().max(120).default(""),
  notes: z.string().trim().max(600).default(""),
  items: z.array(itemSchema).min(1, "Adicione itens ao pedido").max(60),
});

/** Registra o pedido para a equipe produzir (chamado pelo carrinho do site). */
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Preços são recalculados a partir do cardápio no banco, nunca do cliente.
    const ids = data.items.map((i) => i.id);
    const { data: rows, error: menuError } = await context.supabase
      .from("products")
      .select("id, name, price")
      .in("id", ids)
      .eq("is_available", true);
    if (menuError) throw new Error(menuError.message);

    const byId = new Map((rows ?? []).map((r) => [r.id, r]));
    const items: OrderItem[] = data.items.map((i) => {
      const row = byId.get(i.id);
      if (!row) {
        throw new Error(`Produto indisponível: ${i.name}`);
      }
      return {
        id: i.id,
        name: row.name,
        quantity: i.quantity,
        price: Number(row.price),
      };
    });
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const { data: inserted, error } = await context.supabase
      .from("orders")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        mode: data.mode,
        payment: data.payment,
        address: data.address,
        complement: data.complement,
        reference: data.reference,
        notes: data.notes,
        items,
        subtotal,
        customer_id: context.userId,
      })
      .select("id, code")
      .single();
    if (error) throw new Error(error.message);

    return { id: inserted.id, code: inserted.code, subtotal };
  });

export const listCustomerOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, code, customer_name, customer_phone, mode, payment, address, complement, reference, notes, items, subtotal, status, created_at",
      )
      .eq("customer_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    return (data ?? []).map<Order>((row) => ({
      id: row.id,
      code: row.code,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      mode: row.mode,
      payment: row.payment,
      address: row.address,
      complement: row.complement,
      reference: row.reference,
      notes: row.notes,
      items: Array.isArray(row.items) ? (row.items as unknown as OrderItem[]) : [],
      subtotal: Number(row.subtotal),
      status: row.status as OrderStatus,
      createdAt: row.created_at,
    }));
  });

/** Pedidos recebidos (somente equipe administradora, via RLS). */
export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, code, customer_name, customer_phone, mode, payment, address, complement, reference, notes, items, subtotal, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    return (data ?? []).map<Order>((row) => ({
      id: row.id,
      code: row.code,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      mode: row.mode,
      payment: row.payment,
      address: row.address,
      complement: row.complement,
      reference: row.reference,
      notes: row.notes,
      items: Array.isArray(row.items) ? (row.items as unknown as OrderItem[]) : [],
      subtotal: Number(row.subtotal),
      status: row.status as OrderStatus,
      createdAt: row.created_at,
    }));
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(ORDER_STATUSES) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("orders").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
