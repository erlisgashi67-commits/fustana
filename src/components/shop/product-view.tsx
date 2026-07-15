"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { Link } from "@/components/link";
import { formatALL } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Heart,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function ProductView({ id }: { id: string }) {
  const { navigate } = useRouter();
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.products.get(id),
    enabled: !!id,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["products", "related", data?.product.category],
    queryFn: () => api.products.list({ category: data?.product.category }),
    enabled: !!data?.product.category,
  });

  const product = data?.product;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);

  // Compute effective selections with sensible defaults (no effects needed)
  const effectiveSize = selectedSize || product?.sizes[0] || "";
  const effectiveColor = selectedColor || product?.colors[0] || "";
  const safeImageIdx = Math.min(activeImage, (product?.images.length ?? 1) - 1);

  const related = (relatedData?.products ?? []).filter((p) => p.id !== id).slice(0, 4);

  const handleAdd = (buyNow = false) => {
    if (!product) return;
    add({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      qty,
      size: effectiveSize || "M",
      color: effectiveColor || "—",
    });
    if (buyNow) {
      navigate("/checkout");
    } else {
      toast.success(`${product.title} u shtua në shportë`);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="font-display text-2xl font-semibold">Fustani nuk u gjet</p>
        <Button className="mt-4" onClick={() => navigate("/shop")}>
          Kthehu te dyqani
        </Button>
      </div>
    );
  }

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Kreu</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-primary">Dyqani</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-24 sm:w-20",
                    safeImageIdx === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 overflow-hidden rounded-3xl bg-muted">
            <div className="aspect-[3/4] w-full">
              {product.images[safeImageIdx] ? (
                <img
                  src={product.images[safeImageIdx]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-primary text-primary-foreground">I veçantë</Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-destructive text-white">-{discount}%</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} · Vlerësim
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-3xl font-semibold text-primary">
              {formatALL(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="pb-1 text-lg text-muted-foreground line-through">
                {formatALL(product.compareAtPrice)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="secondary" className="mb-1.5 bg-primary/10 text-primary">
                Kurseni {discount}%
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Ngjyra: <span className="text-muted-foreground">{effectiveColor}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      effectiveColor === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Madhësia: <span className="text-muted-foreground">{effectiveSize}</span>
                </p>
                <button className="text-xs text-primary hover:underline">Tabela e madhësive</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-medium transition-all",
                      effectiveSize === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border/60">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-accent"
                aria-label="Pakëso"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-accent"
                aria-label="Shto"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="h-11 flex-1"
              onClick={() => handleAdd(false)}
              disabled={!product.inStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {product.inStock ? "Shto në Shportë" : "Skaduar"}
            </Button>
            <Button size="icon" variant="outline" className="h-11 w-11" aria-label="Të preferuarat">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="mb-6 h-11 w-full"
            onClick={() => handleAdd(true)}
            disabled={!product.inStock}
          >
            Ble Tani
          </Button>

          {/* Description */}
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
            <h3 className="font-display text-lg font-semibold">Përshkrimi</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {product.description}
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Dërgim 2-4 ditë" },
              { icon: ShieldCheck, label: "Pagesë e sigurt" },
              { icon: RefreshCw, label: "Kthim 14 ditë" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 rounded-xl border border-border/40 p-3 text-center">
                <b.icon className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Mund të të pëlqejnë</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
