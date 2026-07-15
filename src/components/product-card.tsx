"use client";

import { Link } from "@/components/link";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";
import { formatALL } from "@/lib/format";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const add = useCart((s) => s.add);
  const image = product.images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      title: product.title,
      price: product.price,
      image,
      qty: 1,
      size: product.sizes[0] || "M",
      color: product.colors[0] || "—",
    });
    toast.success(`${product.title} u shtua në shportë`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Pa foto
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground shadow-sm">I veçantë</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-white shadow-sm">-{discount}%</Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="shadow-sm">Skaduar</Badge>
          )}
        </div>

        {/* Quick add button */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            onClick={quickAdd}
            className="w-full shadow-lg"
            size="sm"
            disabled={!product.inStock}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />
            Shto në Shportë
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
          {product.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {product.colors.length} ngjyr{product.colors.length === 1 ? "ë" : "a"}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-semibold text-primary sm:text-base">
            {formatALL(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatALL(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
