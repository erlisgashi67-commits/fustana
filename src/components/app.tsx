"use client";

import { useEffect } from "react";
import { useRouter, matchPath } from "@/hooks/use-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { HomeView } from "@/components/shop/home-view";
import { ShopView } from "@/components/shop/shop-view";
import { ProductView } from "@/components/shop/product-view";
import { CheckoutView } from "@/components/shop/checkout-view";
import { AboutView } from "@/components/shop/about-view";
import { AdminApp } from "@/components/admin/admin-app";
import { Button } from "@/components/ui/button";

export function App() {
  const { path } = useRouter();

  // Scroll to top on path change (handled in navigate too, but for hash loads)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  // Admin routes: full-screen, no customer chrome
  if (path.startsWith("/admin")) {
    return (
      <div className="flex min-h-screen flex-col bg-secondary/20">
        <AdminApp />
      </div>
    );
  }

  // Customer routes
  let content: React.ReactNode;
  const productMatch = matchPath("/product/:id", path);

  if (path === "/" || path === "") {
    content = <HomeView />;
  } else if (path.startsWith("/shop")) {
    content = <ShopView />;
  } else if (productMatch) {
    content = <ProductView key={productMatch.id} id={productMatch.id} />;
  } else if (path.startsWith("/checkout")) {
    content = <CheckoutView />;
  } else if (path.startsWith("/about")) {
    content = <AboutView />;
  } else {
    content = (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-6xl font-semibold text-primary/30">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">Faqja nuk u gjet</h1>
        <p className="mt-2 text-muted-foreground">
          Faqja që kërkoni nuk ekziston ose është zhvendosur.
        </p>
        <Button className="mt-6" onClick={() => (window.location.hash = "#/")}>
          Kthehu në Kreu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{content}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
