import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { serializeOrder, listOrders, type SerializedOrderItem } from "@/lib/orders";
import { parseJSONField, generateOrderNumber } from "@/lib/format";

/** GET /api/orders — admin only. List all orders. */
export async function GET(req: NextRequest) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const orders = await listOrders(status);
  return NextResponse.json({ orders });
}

/** POST /api/orders — public. Place a new order. */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { firstName, lastName, phone, email, address, city, notes, items, paymentMethod } = body;

  if (!firstName || !lastName || !phone || !address) {
    return NextResponse.json(
      { error: "Emri, mbiemri, telefoni dhe adresa janë të detyrueshme." },
      { status: 400 }
    );
  }

  const parsedItems = parseJSONField<SerializedOrderItem[]>(items, []);
  if (!parsedItems || parsedItems.length === 0) {
    return NextResponse.json({ error: "Shporta ësështë bosh." }, { status: 400 });
  }

  const subtotal = parsedItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal > 20000 ? 0 : 500;
  const total = subtotal + shipping;

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      firstName: String(firstName),
      lastName: String(lastName),
      phone: String(phone),
      email: email ? String(email) : null,
      address: String(address),
      city: city ? String(city) : null,
      notes: notes ? String(notes) : null,
      items: JSON.stringify(parsedItems),
      subtotal,
      shipping,
      total,
      status: "Në Pritje",
      paymentMethod: paymentMethod || "Para në dorë",
    },
  });

  return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
}
