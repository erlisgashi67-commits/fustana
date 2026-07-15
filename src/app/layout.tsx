import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fustana — Dyqan Fustanash Online | Fustana Mbrëmjeje, Dasme & Kokteile",
  description:
    "Fustana — dyqani online i fustanave. Zbuloni fustana mbrëmjeje, fustana dasme dhe fustana kokteile. Cilësi e lartë, dizajn elegant, dërgim në të gjithë Shqipërinë. Porosit online me para në dorë.",
  keywords: [
    "fustana",
    "fustana mbrëmjeje",
    "fustana dasme",
    "fustana kokteile",
    "dyqan fustanash",
    "fustan online",
    "rroba dasme",
  ],
  authors: [{ name: "Fustana" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Fustana — Dyqan Fustanash Online",
    description:
      "Fustana mbrëmjeje, dasme dhe kokteile. Dizajn elegant, porosi online me dërgim në të gjithë Shqipërinë.",
    siteName: "Fustana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${cormorant.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
