"use client";

import { Link } from "@/components/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Mail, Phone, MapPin, Instagram, Facebook, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      {/* Trust badges */}
      <div className="border-b border-border/40 bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Truck, title: "Dërgim i Shpejtë", desc: "Në të gjithë Shqipërinë brenda 2-4 ditësh" },
            { icon: ShieldCheck, title: "Pagesë e Sigurt", desc: "Para në dorë ose online" },
            { icon: CreditCard, title: "Kthim Falas", desc: "14 ditë e drejta e kthimit" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display text-2xl font-semibold text-primary">Fustana</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Dyqani online i fustanave. Zgjedhje elegante për çdo moment të veçantë —
            mbrëmje, dasmë apo kokteil.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Kategoritë</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/shop?category=${encodeURIComponent(c)}`} className="text-muted-foreground hover:text-primary">
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="text-muted-foreground hover:text-primary">
                Të gjitha fustanat
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Kontakt</h4>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Rruga Myslym Shyri, Tiranë, Shqipëri</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+355692345678" className="hover:text-primary">+355 69 234 5678</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:info@fustana.al" className="hover:text-primary">info@fustana.al</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold">Newsletter</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Abonohu për të marrë ofertat dhe koleksionet e reja.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Faleminderit! U abonuat me sukses.");
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="mt-3 flex gap-2"
          >
            <Input type="email" required placeholder="Email-i juaj" className="h-10 bg-background" />
            <Button type="submit" className="h-10 shrink-0">OK</Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Fustana. Të gjitha të drejtat e rezervuara.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-primary">Hyr si Admin</Link>
            <span>Termat & Kushtet</span>
            <span>Privatësia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
