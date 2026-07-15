"use client";

import { useState } from "react";
import { useRouter } from "@/hooks/use-router";
import { Link } from "@/components/link";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  User,
  Sparkles,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Kreu", to: "/" },
  { label: "Dyqani", to: "/shop" },
  { label: "Rreth Nesh", to: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { navigate, path } = useRouter();
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(searchValue)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>Dërgim falas për porositë mbi 20,000 Lekë · Porosit online me para në dorë</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-6">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined} side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl text-primary">Fustana</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 hover:bg-accent hover:text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Kategoritë
                </p>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    to={`/shop?category=${encodeURIComponent(c)}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:bg-accent hover:text-primary"
                  >
                    {c}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
                >
                  Hyr si Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              Fustana
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  path === l.to ? "text-primary" : "text-foreground/70"
                )}
              >
                {l.label}
                {path === l.to && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
            {/* Categories dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
                Kategoritë
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-2 pt-2 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-popover p-2 shadow-xl">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c}
                      to={`/shop?category=${encodeURIComponent(c)}`}
                      className="block rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-accent hover:text-primary"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={submitSearch} className="ml-auto hidden flex-1 max-w-xs md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Kërko fustana..."
                className="h-10 rounded-full border-border/60 bg-muted/50 pl-9 pr-4"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Të preferuarat"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to="/admin" aria-label="Admin">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setOpen(true)}
              aria-label="Shporta"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-border/40 px-4 py-2 md:hidden">
          <form onSubmit={submitSearch}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Kërko fustana..."
                className="h-9 rounded-full border-border/60 bg-muted/50 pl-9 pr-4"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}


