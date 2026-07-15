import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/products";
import { requireAdmin } from "@/lib/admin";
import { parseJSONField } from "@/lib/format";

/** GET /api/products/[id] — public. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Fustani nuk u gjet." }, { status: 404 });
  return NextResponse.json({ product: serializeProduct(product) });
}

/** PUT /api/products/[id] — admin only. */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Fustani nuk u gjet." }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.title != null) data.title = String(body.title);
  if (body.description != null) data.description = String(body.description);
  if (body.price != null) data.price = Number(body.price);
  if (body.compareAtPrice !== undefined)
    data.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
  if (body.category != null) data.category = String(body.category);
  if (body.sizes != null)
    data.sizes = JSON.stringify(parseJSONField<string[]>(body.sizes, []));
  if (body.colors != null)
    data.colors = JSON.stringify(parseJSONField<string[]>(body.colors, []));
  if (body.images != null)
    data.images = JSON.stringify(parseJSONField<string[]>(body.images, []));
  if (body.featured != null) data.featured = Boolean(body.featured);
  if (body.inStock != null) data.inStock = Boolean(body.inStock);
  if (body.rating != null) data.rating = Number(body.rating);

  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json({ product: serializeProduct(product) });
}

/** DELETE /api/products/[id] — admin only. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Fustani nuk u gjet." }, { status: 404 });
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
