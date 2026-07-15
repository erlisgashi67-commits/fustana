"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: CartItem) => void;
  remove: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      add: (item) => {
        const items = get().items;
        const idx = items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );
        if (idx >= 0) {
          const next = [...items];
          next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
          set({ items: next, isOpen: true });
        } else {
          set({ items: [...items, item], isOpen: true });
        }
      },
      remove: (productId, size, color) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        }),
      setQty: (productId, size, color, qty) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId && i.size === size && i.color === color
                ? { ...i, qty: Math.max(1, qty) }
                : i
            ),
        }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    {
      name: "fustana-cart",
      // Only persist cart items — never persist isOpen (prevents the cart
      // drawer from auto-opening on page load / refresh).
      partialize: (state) => ({ items: state.items }),
      // Defer hydration until after the component mounts. This ensures the
      // server-rendered HTML (empty cart) matches the first client render
      // (still empty), avoiding React hydration mismatches. The persisted
      // items are loaded via useCart.persist.rehydrate() in <Providers/>.
      skipHydration: true,
    }
  )
);
