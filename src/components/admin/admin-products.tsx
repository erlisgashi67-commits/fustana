"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { CATEGORIES, ALL_SIZES } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatALL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Plus, Search, Pencil, Trash2, Star, Package, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const COMMON_COLORS = ["E zezë", "Bardhë", "Rozë", "E kuqe", "Bordeaux", "Vjollcë", "Argjend", "Blu marine", "Fildish", "Rozë e hapër"];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: CATEGORIES[0],
  sizes: [] as string[],
  colors: [] as string[],
  images: [] as string[],
  featured: false,
  inStock: true,
  rating: "5",
};

export function AdminProducts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newColor, setNewColor] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "admin"],
    queryFn: () => api.products.list(),
  });
  const products = data?.products ?? [];

  const filtered = search
    ? products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : products;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      category: p.category,
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      featured: p.featured,
      inStock: p.inStock,
      rating: String(p.rating),
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("Titulli, përshkrimi dhe çmimi janë të detyrueshme.");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      category: form.category,
      sizes: form.sizes,
      colors: form.colors,
      images: form.images,
      featured: form.featured,
      inStock: form.inStock,
      rating: Number(form.rating),
    };
    try {
      if (editing) {
        await api.products.update(editing.id, payload);
        toast.success("Fustani u përditësua.");
      } else {
        await api.products.create(payload);
        toast.success("Fustani u shtua me sukses.");
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.products.remove(deleteId);
      toast.success("Fustani u fshi.");
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim.");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleSize = (s: string) =>
    setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));
  const toggleColor = (c: string) =>
    setForm((f) => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] }));
  const addImage = () => {
    if (newImageUrl.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };
  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const addCustomColor = () => {
    if (newColor.trim() && !form.colors.includes(newColor.trim())) {
      setForm((f) => ({ ...f, colors: [...f.colors, newColor.trim()] }));
      setNewColor("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko fustana..."
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Shto Fustan
        </Button>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <Package className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-medium">Asnjë fustan</p>
          <p className="text-sm text-muted-foreground">Shtoni fustanin e parë.</p>
          <Button className="mt-4" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Shto Fustan
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden p-0">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Package className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  {p.featured && <Badge className="bg-primary text-primary-foreground">I veçantë</Badge>}
                  {!p.inStock && <Badge variant="secondary">Skaduar</Badge>}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <h3 className="mt-0.5 line-clamp-1 font-medium">{p.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-primary">{formatALL(p.price)}</span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatALL(p.compareAtPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.sizes.slice(0, 4).map((s) => (
                    <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-xs">{s}</span>
                  ))}
                  {p.sizes.length > 4 && <span className="text-xs text-muted-foreground">+{p.sizes.length - 4}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(p)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Ndrysho
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Ndrysho Fustanin" : "Shto Fustan të Ri"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Images */}
            <div>
              <Label className="mb-2 block">Fotot (URL)</Label>
              {form.images.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative h-20 w-16 overflow-hidden rounded-lg border border-border/60">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-destructive text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titulli" required>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Fustana Mbrëmjeje..." />
              </Field>
              <Field label="Kategoria" required>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Përshkrimi" required>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Përshkrimi i fustanit..."
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Çmimi (Lekë)" required>
                <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="15000" />
              </Field>
              <Field label="Çmimi i vjetër (opsionale)">
                <Input type="number" value={form.compareAtPrice} onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))} placeholder="20000" />
              </Field>
              <Field label="Vlerësimi">
                <Select value={form.rating} onValueChange={(v) => setForm((f) => ({ ...f, rating: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 4.5, 4, 3.5].map((r) => <SelectItem key={r} value={String(r)}>{r} ★</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Sizes */}
            <div>
              <Label className="mb-2 block">Madhësitë</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                      form.sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border/60 hover:border-primary/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="mb-2 block">Ngjyrat</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      form.colors.includes(c) ? "border-primary bg-primary text-primary-foreground" : "border-border/60 hover:border-primary/40"
                    )}
                  >
                    {c}
                  </button>
                ))}
                {form.colors.filter((c) => !COMMON_COLORS.includes(c)).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    className="rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    {c} <X className="ml-1 inline h-3 w-3" />
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Shto ngjyrë të personalizuar..."
                  className="h-9"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomColor(); } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addCustomColor}>Shto</Button>
              </div>
            </div>

            <Separator />

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
                <span className="text-sm font-medium">I veçantë (featured)</span>
              </label>
              <label className="flex items-center gap-3">
                <Switch checked={form.inStock} onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: v }))} />
                <span className="text-sm font-medium">Në stok</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Anulo</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Duke ruajtur..." : editing ? "Ruaj ndryshimet" : "Shto fustanin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fshi fustanin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ky veprim nuk mund të kthehet. Fustani do të fshihet përgjithmonë.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulo</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Fshi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}
