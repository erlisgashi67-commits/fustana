import type { SerializedProduct } from "@/lib/products";
import type { SerializedOrder } from "@/lib/orders";

export type Product = SerializedProduct;
export type Order = SerializedOrder;
export type OrderItem = SerializedOrder["items"][number];

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size: string;
  color: string;
}

export const CATEGORIES = [
  "Fustana Mbrëmjeje",
  "Fustana Dasme",
  "Fustana Kokteile",
] as const;

export const ALL_SIZES = ["XS", "S", "M", "L", "XL"] as const;
