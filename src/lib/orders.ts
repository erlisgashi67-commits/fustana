import { db } from "@/lib/db";
import { parseJSONField } from "@/lib/format";

export type SerializedOrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
};

export type SerializedOrder = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  notes: string | null;
  items: SerializedOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  notes: string | null;
  items: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeOrder(o: OrderRow): SerializedOrder {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    firstName: o.firstName,
    lastName: o.lastName,
    phone: o.phone,
    email: o.email,
    address: o.address,
    city: o.city,
    notes: o.notes,
    items: parseJSONField<SerializedOrderItem[]>(o.items, []),
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

export async function listOrders(status?: string) {
  const where: Record<string, unknown> = {};
  if (status && status !== "Të gjitha") where.status = status;
  const orders = await db.order.findMany({ where, orderBy: { createdAt: "desc" } });
  return orders.map(serializeOrder);
}

export const ORDER_STATUSES = [
  "Në Pritje",
  "Në Procesim",
  "Dërguar",
  "Përfunduar",
  "Anuluar",
] as const;
