import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/products";
import { requireAdmin } from "@/lib/admin";
import { parseJSONField } from "@/lib/format";

/** GET /api/products — public list with optional filters. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const featured = searchParams.get("featured");
  const search = searchParams.get("q") || undefined;

  const where: Record<string, unknown> = {};
  if (category && category !== "Të gjitha") where.category = category;
  if (featured === "true") where.featured = true;
  if (search) where.title = { contains: search };

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}

/** POST /api/products — admin only. Create a new product. */
export async function POST(req: NextRequest) {
  await requireAdmin();
  const body = await req.json();

  const {
    title,
    description,
    price,
    compareAtPrice,
    category,
    sizes,
    colors,
    images,
    featured,
    inStock,
    rating,
  } = body;

  if (!title || !description || price == null || !category) {
    return NextResponse.json(
      { error: "Titulli, përshkrimi, çmimi dhe kategoria janë të detyrueshme." },
      { status: 400 }
    );
  }

  const product = await db.product.create({
    data: {
      title: String(title),
      description: String(description),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      category: String(category),
      sizes: JSON.stringify(parseJSONField<string[]>(sizes, [])),
      colors: JSON.stringify(parseJSONField<string[]>(colors, [])),
      images: JSON.stringify(parseJSONField<string[]>(images, [])),
      featured: Boolean(featured),
      inStock: inStock !== false,
      rating: rating ? Number(rating) : 5,
    },
  });

  return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
}
