"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES, ALL_SIZES } from "@/lib/types";
import { formatALL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Search, X, LayoutGrid } from "lucide-react";

const ALL_COLORS = ["E zezë", "Bardhë", "Rozë", "E kuqe", "Bordeaux", "Vjollcë", "Argjend", "Blu marine", "Fildish", "Rozë e hapër"];

export function ShopView() {
  const { query, navigate } = useRouter();
  const queryCategory = query.get("category") || "Të gjitha";
  const querySearch = query.get("q") || "";
  const queryKey = query.toString();

  const [category, setCategory] = useState(queryCategory);
  const [search, setSearch] = useState(querySearch);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 60000]);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [lastQueryKey, setLastQueryKey] = useState(queryKey);

  // Sync local filters from URL when the query changes (e.g. navbar search / category link).
  // Uses the recommended "adjust state during render" pattern instead of an effect.
  if (queryKey !== lastQueryKey) {
    setLastQueryKey(queryKey);
    setCategory(queryCategory);
    setSearch(querySearch);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["products", "shop", category, search],
    queryFn: () =>
      api.products.list({
        category: category !== "Të gjitha" ? category : undefined,
        q: search || undefined,
      }),
  });

  const products = data?.products ?? [];

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedSizes.length && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
      if (selectedColors.length && !p.colors.some((c) => selectedColors.includes(c))) return false;
      return true;
    });
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, priceRange, selectedSizes, selectedColors, sortBy]);

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleColor = (c: string) =>
    setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 60000]);
    setCategory("Të gjitha");
    setSearch("");
    navigate("/shop");
  };

  const activeFilterCount =
    selectedSizes.length + selectedColors.length + (category !== "Të gjitha" ? 1 : 0);

  const FiltersContent = (
    <div className="space-y-7">
      {/* Category */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Kategoria
        </h4>
        <div className="flex flex-wrap gap-2">
          {["Të gjitha", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background hover:border-primary/40 hover:text-primary"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Madhësia
        </h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                selectedSizes.includes(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background hover:border-primary/40 hover:text-primary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ngjyra
        </h4>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedColors.includes(c)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background hover:border-primary/40 hover:text-primary"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Çmimi
          </h4>
          <span className="text-xs text-muted-foreground">
            {formatALL(priceRange[0])} – {formatALL(priceRange[1])}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={60000}
          step={1000}
          className="py-2"
        />
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" /> Pastro filtrat ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dyqani</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
          {category === "Të gjitha" ? "Të gjitha fustanat" : category}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "fustan" : "fustana"} të gjetura
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-36">{FiltersContent}</div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/shop?q=${encodeURIComponent(search)}`);
              }}
              className="relative min-w-0 flex-1"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko..."
                className="h-10 rounded-full pl-9"
              />
            </form>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtra
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 px-1 rounded-full">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtrat</SheetTitle>
                </SheetHeader>
                <div className="mt-4 px-1">{FiltersContent}</div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-full border border-border/60 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Më të rejat</option>
                <option value="price-asc">Çmimi: I ulët → i lartë</option>
                <option value="price-desc">Çmimi: I lartë → i ulët</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {category !== "Të gjitha" && (
                <FilterChip label={category} onRemove={() => setCategory("Të gjitha")} />
              )}
              {selectedSizes.map((s) => (
                <FilterChip key={s} label={s} onRemove={() => toggleSize(s)} />
              ))}
              {selectedColors.map((c) => (
                <FilterChip key={c} label={c} onRemove={() => toggleColor(c)} />
              ))}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-20 text-center">
              <Search className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold">Asnjë fustan nuk u gjet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Provo të ndryshosh filtrat ose kërkimin.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Pastro filtrat
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 rounded-full py-1.5 pl-3 pr-1.5">
      {label}
      <button
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-background"
        aria-label="Largo"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
