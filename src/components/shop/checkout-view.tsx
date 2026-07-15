"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "@/hooks/use-router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatALL } from "@/lib/format";
import { CheckCircle2, ShoppingBag, ArrowLeft, Truck, Lock } from "lucide-react";
import { toast } from "sonner";

export function CheckoutView() {
  const { items, subtotal, clear } = useCart();
  const { navigate } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ orderNumber: string; total: number } | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "Para në dorë",
  });

  const total = subtotal();
  const shipping = total > 20000 ? 0 : 500;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Shporta është bosh.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.orders.create({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        items,
      });
      setPlacedOrder({ orderNumber: res.order.orderNumber, total: res.order.total });
      clear();
      toast.success("Porosia u vendos me sukses!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë vendosjes së porosisë.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
          Faleminderit për porosinë!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Porosia juaj është regjistruar me sukses. Do t'ju kontaktojmë së shpejti
          për konfirmimin e dërgimit.
        </p>
        <div className="mt-6 w-full rounded-2xl border border-border/60 bg-secondary/30 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Numri i porosisë</span>
            <span className="font-mono text-sm font-semibold text-primary">
              {placedOrder.orderNumber}
            </span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Totali i paguar</span>
            <span className="font-display text-lg font-semibold">
              {formatALL(placedOrder.total)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-background p-3 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            Dërgimi pritet brenda 2-4 ditësh. Pagesa: Para në dorë.
          </div>
        </div>
        <Button className="mt-8" size="lg" onClick={() => navigate("/shop")}>
          Vazhdo blerjet
        </Button>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Shporta juaj është bosh</h1>
        <p className="mt-2 text-muted-foreground">
          Shtoni fustana për të vazhduar te pagesa.
        </p>
        <Button className="mt-6" size="lg" onClick={() => navigate("/shop")}>
          Shiko fustanat
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={() => navigate("/shop")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Vazhdo blerjet
      </button>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Pagesa</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Form fields */}
        <div className="space-y-6 lg:col-span-3">
          <section className="rounded-2xl border border-border/60 bg-background p-6">
            <h2 className="font-display text-xl font-semibold">Të dhënat e dërgimit</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Plotësoni të dhënat tuaja për të finalizuar porosinë.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Emri" required>
                <Input required value={form.firstName} onChange={set("firstName")} placeholder="Emri juaj" />
              </Field>
              <Field label="Mbiemri" required>
                <Input required value={form.lastName} onChange={set("lastName")} placeholder="Mbiemri juaj" />
              </Field>
              <Field label="Numri i Telefonit" required>
                <Input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+355 6X XXX XXXX" />
              </Field>
              <Field label="Email (opsionale)">
                <Input type="email" value={form.email} onChange={set("email")} placeholder="email@shembull.com" />
              </Field>
              <Field label="Adresa e Dërgimit" required className="sm:col-span-2">
                <Input required value={form.address} onChange={set("address")} placeholder="Rruga, numri, pallati, ap." />
              </Field>
              <Field label="Qyteti" className="sm:col-span-2">
                <Input value={form.city} onChange={set("city")} placeholder="Tiranë, Durrës, Vlorë..." />
              </Field>
              <Field label="Shënime (opsionale)" className="sm:col-span-2">
                <Textarea
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Shënime për porosinë ose dërgimin..."
                  rows={3}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-background p-6">
            <h2 className="font-display text-xl font-semibold">Mënyra e pagesës</h2>
            <RadioGroup
              value={form.paymentMethod}
              onValueChange={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}
              className="mt-4 space-y-3"
            >
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="Para në dorë" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Para në dorë (Cash on Delivery)</p>
                  <p className="text-xs text-muted-foreground">Paguani kur merrni porosinë</p>
                </div>
                <Truck className="h-5 w-5 text-muted-foreground" />
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 p-4 opacity-60">
                <RadioGroupItem value="Kartë bankare" disabled />
                <div className="flex-1">
                  <p className="text-sm font-medium">Kartë bankare (Së shpejti)</p>
                  <p className="text-xs text-muted-foreground">Pagesë online me kartë</p>
                </div>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </label>
            </RadioGroup>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-36 rounded-2xl border border-border/60 bg-background p-6">
            <h2 className="font-display text-xl font-semibold">Përmbledhja e porosisë</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto fancy-scroll pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                    {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · {item.color}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      {formatALL(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nëntotali</span>
                <span className="font-medium">{formatALL(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dërgimi</span>
                <span className="font-medium">{shipping === 0 ? "Falas" : formatALL(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Shtoni {formatALL(20000 - total)} për dërgim falas.
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Totali</span>
              <span className="font-display text-xl font-semibold text-primary">
                {formatALL(total + shipping)}
              </span>
            </div>

            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Duke procesuar..." : "Vendose Porosinë"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Të dhënat tuaja janë të mbrojtura
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}
