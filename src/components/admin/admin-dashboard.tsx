"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatALL, formatDate } from "@/lib/format";
import {
  ClipboardList,
  Clock,
  Wallet,
  Package,
  TrendingUp,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";
import { ORDER_STATUSES } from "@/lib/orders";

// Dynamically load the recharts chart on the client only.
// This keeps the heavy recharts library out of the main bundle and
// avoids SSR / chunk-loading issues with the chart library.
const DashboardChart = dynamic(
  () => import("@/components/admin/dashboard-chart").then((m) => m.DashboardChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

const STATUS_COLORS: Record<string, string> = {
  "Në Pritje": "oklch(0.75 0.12 70)",
  "Në Procesim": "oklch(0.7 0.13 250)",
  "Dërguar": "oklch(0.7 0.13 200)",
  "Përfunduar": "oklch(0.7 0.15 150)",
  "Anuluar": "oklch(0.62 0.2 25)",
};

export function AdminDashboard() {
  const { navigate } = useRouter();
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => api.orders.list(),
  });
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => api.products.list(),
  });

  const orders = ordersData?.orders ?? [];
  const products = productsData?.products ?? [];

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Në Pritje").length;
  const totalRevenue = orders
    .filter((o) => o.status === "Përfunduar" || o.status === "Dërguar")
    .reduce((s, o) => s + o.total, 0);
  const totalProducts = products.length;

  const statusCounts = ORDER_STATUSES.map((s) => ({
    name: s,
    value: orders.filter((o) => o.status === s).length,
  }));

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Porosi Totale",
      value: totalOrders.toString(),
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Në Pritje",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Të Ardhura Totale",
      value: formatALL(totalRevenue),
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Fustana Totale",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={s.label} className="relative overflow-hidden p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            {ordersLoading || productsLoading ? (
              <Skeleton className="mt-1 h-7 w-20" />
            ) : (
              <p className="mt-0.5 font-display text-xl font-semibold sm:text-2xl">{s.value}</p>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Chart */}
        <Card className="p-4 sm:p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Porosit sipas statusit</h2>
              <p className="text-xs text-muted-foreground">Shpërndarja e porosive aktuale</p>
            </div>
          </div>
          <div className="mt-6 h-56 sm:h-64">
            <DashboardChart data={statusCounts} />
          </div>
        </Card>

        {/* Quick actions / status list */}
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Statusi i porosive</h2>
          <p className="text-xs text-muted-foreground">Përmbledhje e shpejtë</p>
          <div className="mt-4 space-y-2">
            {ORDER_STATUSES.map((s) => {
              const count = orders.filter((o) => o.status === s).length;
              const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: STATUS_COLORS[s] }}
                  />
                  <span className="flex-1 text-sm">{s}</span>
                  <span className="text-sm font-semibold">{count}</span>
                  <div className="hidden w-20 overflow-hidden rounded-full bg-muted sm:block">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: STATUS_COLORS[s] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="mt-5 w-full"
            onClick={() => navigate("/admin/orders")}
          >
            Shiko të gjitha porositë
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Porosit e fundit</h2>
            <p className="text-xs text-muted-foreground">5 porosit më të reja</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
            Të gjitha
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Porosia</th>
                <th className="pb-2 font-medium">Klienti</th>
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Totali</th>
                <th className="pb-2 font-medium">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Asnjë porosi ende.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3 font-mono text-xs text-primary">{o.orderNumber}</td>
                    <td className="py-3">
                      <p className="font-medium">{o.firstName} {o.lastName}</p>
                      <p className="text-xs text-muted-foreground">{o.city || "—"}</p>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="py-3 font-semibold">{formatALL(o.total)}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || "oklch(0.62 0.13 18)";
  return (
    <Badge
      variant="secondary"
      className="gap-1.5 border"
      style={{ borderColor: color, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status}
    </Badge>
  );
}
