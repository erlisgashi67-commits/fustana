"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatALL, formatDate } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/orders";
import { Search, Eye, Phone, MapPin, Mail, User, Package, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  "Në Pritje": "bg-amber-100 text-amber-700 border-amber-200",
  "Në Procesim": "bg-blue-100 text-blue-700 border-blue-200",
  "Dërguar": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Përfunduar": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Anuluar": "bg-rose-100 text-rose-700 border-rose-200",
};

export function AdminOrders() {
  const { query, navigate } = useRouter();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(query.get("status") || "Të gjitha");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "admin", statusFilter],
    queryFn: () => api.orders.list(statusFilter !== "Të gjitha" ? statusFilter : undefined),
  });

  const orders = data?.orders ?? [];

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        `${o.firstName} ${o.lastName}`.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.orders.update(id, { status });
      toast.success(`Statusi u ndryshua në "${status}"`);
      qc.invalidateQueries({ queryKey: ["orders"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    }
  };

  const selectedOrder = orders.find((o) => o.id === selectedId) || null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko sipas numrit, emrit ose telefonit..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            navigate(`/admin/orders${v !== "Të gjitha" ? `?status=${encodeURIComponent(v)}` : ""}`);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Të gjitha">Të gjitha statuset</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status quick filter chips */}
      <div className="flex flex-wrap gap-2">
        {["Të gjitha", ...ORDER_STATUSES].map((s) => {
          const count = s === "Të gjitha" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                navigate(`/admin/orders${s !== "Të gjitha" ? `?status=${encodeURIComponent(s)}` : ""}`);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {s} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Porosia</th>
                <th className="px-4 py-3 font-medium">Klienti</th>
                <th className="px-4 py-3 font-medium">Artikuj</th>
                <th className="px-4 py-3 font-medium">Totali</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Statusi</th>
                <th className="px-4 py-3 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="ml-auto h-8 w-8 rounded-full" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    Asnjë porosi nuk u gjet.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-primary">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{o.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.firstName} {o.lastName}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-medium">
                        {o.items.reduce((s, it) => s + it.qty, 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatALL(o.total)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="h-7 w-32 border-0 p-0">
                          <Badge
                            variant="outline"
                            className={`w-full justify-center ${STATUS_COLORS[o.status] || ""}`}
                          >
                            {o.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedId(o.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span>Detajet e Porosisë</span>
              {selectedOrder && (
                <span className="font-mono text-sm text-primary">{selectedOrder.orderNumber}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5">
              {/* Status changer */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/50 p-3">
                <span className="text-sm font-medium">Ndrysho statusin:</span>
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedOrder.status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Customer info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-primary" /> Klienti
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <Info label="Emri" value={`${selectedOrder.firstName} ${selectedOrder.lastName}`} />
                    <Info label="Telefon" value={selectedOrder.phone} icon={<Phone className="h-3 w-3" />} />
                    {selectedOrder.email && (
                      <Info label="Email" value={selectedOrder.email} icon={<Mail className="h-3 w-3" />} />
                    )}
                  </dl>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" /> Dërgimi
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <Info label="Adresa" value={selectedOrder.address} />
                    {selectedOrder.city && <Info label="Qyteti" value={selectedOrder.city} />}
                    {selectedOrder.notes && <Info label="Shënime" value={selectedOrder.notes} />}
                  </dl>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-border/60 p-4">
                <h4 className="mb-3 text-sm font-semibold">Artikujt ({selectedOrder.items.length})</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                        {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{it.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Madhësia: {it.size} · {it.color} · Sasia: {it.qty}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{formatALL(it.price * it.qty)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nëntotali</span>
                    <span>{formatALL(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dërgimi</span>
                    <span>{selectedOrder.shipping === 0 ? "Falas" : formatALL(selectedOrder.shipping)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Totali</span>
                    <span className="text-primary">{formatALL(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Krijuar më: {formatDate(selectedOrder.createdAt)} · Pagesa: {selectedOrder.paymentMethod}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="flex items-center gap-1 text-muted-foreground">{icon}{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
