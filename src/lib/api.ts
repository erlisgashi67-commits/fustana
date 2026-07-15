import type { Product, Order } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Diçka shkoi keq.");
  }
  return data as T;
}

export const api = {
  products: {
    list: (params?: { category?: string; q?: string; featured?: boolean }) => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set("category", params.category);
      if (params?.q) sp.set("q", params.q);
      if (params?.featured) sp.set("featured", "true");
      return request<{ products: Product[] }>(`/api/products?${sp.toString()}`);
    },
    get: (id: string) => request<{ product: Product }>(`/api/products/${id}`),
    create: (data: Partial<Product>) =>
      request<{ product: Product }>(`/api/products`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Product>) =>
      request<{ product: Product }>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/api/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    list: (status?: string) => {
      const sp = new URLSearchParams();
      if (status) sp.set("status", status);
      return request<{ orders: Order[] }>(`/api/orders?${sp.toString()}`);
    },
    get: (id: string) => request<{ order: Order }>(`/api/orders/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ order: Order }>(`/api/orders`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Order>) =>
      request<{ order: Order }>(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ admin: { id: string; email: string; name: string } }>(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<{ success: boolean }>(`/api/auth/logout`, { method: "POST" }),
    me: () => request<{ admin: { id: string; email: string; name: string } | null }>(`/api/auth/me`),
  },
};
