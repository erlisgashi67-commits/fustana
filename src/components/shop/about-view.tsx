"use client";

import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/hooks/use-router";
import { Gem, Heart, Sparkles, Truck, ShieldCheck } from "lucide-react";

export function AboutView() {
  const { navigate } = useRouter();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Rreth Nesh</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Historia e Fustana
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Fustana lindi nga pasioni për elegancën dhe bukurinë. Besojmë se çdo grua
          meriton të ndihet e veçantë, pavarësisht rastit. Nga fustana mbrëmjeje tek
          fustana e dasmës, zgjedhim me kujdes çdo model për t'ju ofruar cilësi dhe stil.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          { icon: Gem, title: "Cilësi Premium", desc: "Materiale të zgjedhura dhe punim i kujdesshëm për çdo fustan." },
          { icon: Heart, title: "Me Pasion", desc: "Çdo model është krijuar me dashje për detajet." },
          { icon: Truck, title: "Dërgim Kudo", desc: "Dërgojmë në të gjithë Shqipërinë brenda 2-4 ditësh." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border/60 bg-background p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-12 text-center text-primary-foreground sm:px-12">
        <Sparkles className="mx-auto h-8 w-8" />
        <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
          Gati të shkëlqeni?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-primary-foreground/80">
          Zbuloni koleksionin tonë dhe gjeni fustanin e perfekt për ju.
        </p>
        <Button size="lg" variant="secondary" className="mt-6" onClick={() => navigate("/shop")}>
          Shiko Koleksionin
        </Button>
      </div>
    </div>
  );
}
