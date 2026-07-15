"use client";

import { useCart } from "@/store/cart";
import { useRouter } from "@/hooks/use-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatALL } from "@/lib/format";
import { toast } from "sonner";

export function CartDrawer() {
  const { isOpen, setOpen, items, remove, setQty, subtotal } = useCart();
  const { navigate } = useRouter();
  const total = subtotal();
  const shipping = total > 20000 || total === 0 ? 0 : 500;

  const goCheckout = () => {
    if (items.length === 0) {
      toast.error("Shporta është bosh.");
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent aria-describedby={undefined} className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Shporta Juaj
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Shporta është bosh</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Shtoni fustana për të filluar porosinë.
              </p>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/shop");
              }}
            >
              Shiko Fustanat
            </Button>
          </div>
        ) : (
          <>
            <div className="fancy-scroll flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-3"
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium leading-tight">
                        {item.title}
                      </p>
                      <button
                        onClick={() => remove(item.productId, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Largo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Madhësia: {item.size} · {item.color}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border/60">
                        <button
                          onClick={() =>
                            setQty(item.productId, item.size, item.color, item.qty - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-accent"
                          aria-label="Pakëso"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() =>
                            setQty(item.productId, item.size, item.color, item.qty + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-accent"
                          aria-label="Shto"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {formatALL(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border/60 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nëntotali</span>
                <span className="font-medium">{formatALL(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dërgimi</span>
                <span className="font-medium">
                  {shipping === 0 ? "Falas" : formatALL(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Totali</span>
                <span className="font-display text-lg font-semibold text-primary">
                  {formatALL(total + shipping)}
                </span>
              </div>
              <Button className="w-full" size="lg" onClick={goCheckout}>
                Vazhdo te Pagesa
              </Button>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/shop");
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-primary"
              >
                Vazhdo blerjet
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
