import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { serializeOrder } from "@/lib/orders";

/** GET /api/orders/[id] — admin only. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Porosia nuk u gjet." }, { status: 404 });
  return NextResponse.json({ order: serializeOrder(order) });
}

/** PUT /api/orders/[id] — admin only. Update status / fields. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();

  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Porosia nuk u gjet." }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.status != null) data.status = String(body.status);
  if (body.paymentMethod != null) data.paymentMethod = String(body.paymentMethod);
  if (body.firstName != null) data.firstName = String(body.firstName);
  if (body.lastName != null) data.lastName = String(body.lastName);
  if (body.phone != null) data.phone = String(body.phone);
  if (body.email !== undefined) data.email = body.email ? String(body.email) : null;
  if (body.address != null) data.address = String(body.address);
  if (body.city !== undefined) data.city = body.city ? String(body.city) : null;
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;

  const order = await db.order.update({ where: { id }, data });
  return NextResponse.json({ order: serializeOrder(order) });
}
