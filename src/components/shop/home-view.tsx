"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/hooks/use-router";
import { CATEGORIES } from "@/lib/types";
import { formatALL } from "@/lib/format";
import { ArrowRight, Sparkles, Truck, Gem, Heart, Star, Quote } from "lucide-react";

const HERO_IMG = "https://sfile.chatglm.cn/images-ppt/03e233f520b6.jpg";
const HERO_SIDE_IMG = "https://sfile.chatglm.cn/images-ppt/bcd11d1ac567.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  "Fustana Mbrëmjeje": "https://sfile.chatglm.cn/images-ppt/745075c8c479.jpg",
  "Fustana Dasme": "https://sfile.chatglm.cn/images-ppt/a3da37c166ef.jpg",
  "Fustana Kokteile": "https://sfile.chatglm.cn/images-ppt/ac765dd8c427.jpg",
};

const TESTIMONIALS = [
  {
    name: "Era H.",
    city: "Tiranë",
    text: "Fustani ishte edhe më i bukur se në foto. Cilësia e materialit ishte e jashtëzakonshme!",
    rating: 5,
  },
  {
    name: "Arta K.",
    city: "Durrës",
    text: "Dërgimi ishte i shpejtë dhe komunikimi i shkëlqyer. Faleminderit Fustana!",
    rating: 5,
  },
  {
    name: "Klea B.",
    city: "Vlorë",
    text: "Gjeta fustanin perfekt për dasmën. Dizajn elegant dhe çmim të arsyeshëm.",
    rating: 5,
  },
];

export function HomeView() {
  const { navigate } = useRouter();
  const { data } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => api.products.list({ featured: true }),
  });
  const featured = data?.products ?? [];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="relative z-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Koleksioni i ri 2025
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Gjej fustanin e <span className="text-gradient-rose">ëndrrave të tua</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Nga fustana mbrëmjeje tek fustana e dasmës — zgjedhje elegante
              për çdo moment të veçantë. Dizajn i sofistikuar, cilësi e lartë.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 px-8" onClick={() => navigate("/shop")}>
                Shiko Koleksionin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8"
                onClick={() => navigate("/shop?category=Fustana%20Dasme")}
              >
                Fustana Dasme
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Stat icon={Gem} value="500+" label="Modele" />
              <Stat icon={Truck} value="2-4 ditë" label="Dërgim" />
              <Stat icon={Heart} value="10k+" label="Klientë të kënaqur" />
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={HERO_SIDE_IMG}
                alt="Fustana elegant"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -left-2 bottom-8 hidden rounded-2xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur sm:block animate-float">
              <p className="text-xs text-muted-foreground">Duke filluar nga</p>
              <p className="font-display text-2xl font-semibold text-primary">{formatALL(8900)}</p>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent blur-3xl" />
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border/60 bg-primary py-3 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              {["Fustana Mbrëmjeje", "Fustana Dasme", "Fustana Kokteile", "Dërgim Falas mbi 20,000 L", "Cilësi Premium", "Porosit Online"].map((t) => (
                <span key={t} className="flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
                  {t} <Sparkles className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Koleksionet"
          title="Zgjidhni sipas rastit"
          subtitle="Nga mbrëmjet elegante tek dasmat magjike — gjeni fustanin e duhur."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat}
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={CATEGORY_IMAGES[cat]}
                alt={cat}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold">{cat}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/80 transition-colors group-hover:text-white">
                  Shiko koleksionin <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Të zgjedhurat"
              title="Fustanat në tendencë"
              subtitle="Modelet më të dashura të sezonit, të zgjedhura për ju."
              align="left"
            />
            <Button variant="outline" className="hidden shrink-0 sm:inline-flex" onClick={() => navigate("/shop")}>
              Shiko të gjitha <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" onClick={() => navigate("/shop")}>
              Shiko të gjitha <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={HERO_IMG} alt="Koleksioni i dasmës" className="h-72 w-full object-cover sm:h-96" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg px-8 text-white sm:px-12">
              <p className="font-display text-sm uppercase tracking-[0.2em] text-white/80">
                Koleksioni i Dasave
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Ditëlindja juaj e madhe meriton diçka të veçantë
              </h2>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                Zbuloni fustana dasme të punuar me kujdes, për nusen që dëshiron
                të shkëlqejë në ditën më të rëndësishme.
              </p>
              <Button className="mt-6" size="lg" onClick={() => navigate("/shop?category=Fustana%20Dasme")}>
                Zbulo koleksionin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeading
            eyebrow="Çfarë thonë klientët"
            title="Eksperienca e blerësve"
            subtitle="Mijëra gra kanë gjetur fustanin e perfekt te Fustana."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Quote className="h-7 w-7 text-primary/30" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Gati të gjeni fustanin tuaj?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Shfletoni koleksionin tonë dhe porosit online me dërgim në të gjithë Shqipërinë.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
            onClick={() => navigate("/shop")}
          >
            Shiko Dyqanin <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Gem; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="font-display text-lg font-semibold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-sm text-muted-foreground sm:text-base ${align === "center" ? "mx-auto max-w-xl" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
