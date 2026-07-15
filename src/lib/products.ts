import { db } from "@/lib/db";
import { parseJSONField } from "@/lib/format";

export type SerializedProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export function serializeProduct(p: {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  sizes: string;
  colors: string;
  images: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}): SerializedProduct {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    category: p.category,
    sizes: parseJSONField<string[]>(p.sizes, []),
    colors: parseJSONField<string[]>(p.colors, []),
    images: parseJSONField<string[]>(p.images, []),
    featured: p.featured,
    inStock: p.inStock,
    rating: p.rating,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function findProduct(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  return product ? serializeProduct(product) : null;
}

export async function listProducts() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return products.map(serializeProduct);
}
