"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Store,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AdminDashboard } from "./admin-dashboard";
import { AdminOrders } from "./admin-orders";
import { AdminProducts } from "./admin-products";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

const NAV = [
  { label: "Paneli", to: "/admin", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { label: "Porosit", to: "/admin/orders", icon: ClipboardList, match: (p: string) => p.startsWith("/admin/orders") },
  { label: "Fustanat", to: "/admin/products", icon: Package, match: (p: string) => p.startsWith("/admin/products") },
];

export function AdminLayout({
  admin,
  onLogout,
  path,
}: {
  admin: AdminUser | null;
  onLogout: () => void;
  path: string;
}) {
  const { navigate } = useRouter();
  const [mobileNav, setMobileNav] = useState(false);

  const logout = async () => {
    await api.auth.logout();
    toast.success("Dolët me sukses.");
    onLogout();
    navigate("/");
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-none text-primary">Fustana</p>
          <p className="text-xs text-muted-foreground">Paneli Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active = item.match(path);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileNav(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-accent hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
            {admin?.name?.charAt(0) || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{admin?.name || "Admin"}</p>
            <p className="truncate text-xs text-muted-foreground">{admin?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Dilni
        </Button>
      </div>
    </div>
  );

  const currentNav = NAV.find((n) => n.match(path)) || NAV[0];

  return (
    <div className="mx-auto max-w-[1400px] px-2 py-4 sm:px-4">
      <div className="flex gap-4">
        {/* Desktop sidebar */}
        <aside className="sticky top-[8.5rem] hidden h-[calc(100vh-10rem)] w-64 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-background lg:block">
          {SidebarContent}
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <Sheet open={mobileNav} onOpenChange={setMobileNav}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent aria-describedby={undefined} side="left" className="w-64 p-0">
                  {SidebarContent}
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="font-display text-xl font-semibold sm:text-2xl">{currentNav.label}</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Mirë se erdhet, {admin?.name?.split(" ")[0] || "Admin"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Store className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Shiko dyqanin</span>
              <span className="sm:hidden">Dyqani</span>
            </Button>
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-border/60 bg-background p-4 sm:p-6">
            {path === "/admin" && <AdminDashboard />}
            {path.startsWith("/admin/orders") && <AdminOrders />}
            {path.startsWith("/admin/products") && <AdminProducts />}
          </div>
        </div>
      </div>
    </div>
  );
}
