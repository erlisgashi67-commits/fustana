"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Lock, Mail, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("admin@fustana.al");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.login(email, password);
      toast.success("Mirë se erdhet!");
      onLogin();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim gjatë hyrjes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Kthehu te dyqani
        </button>

        <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold">Hyr në Panelin e Adminit</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Menaxho porositë dhe fustanat e dyqanit Fustana.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="admin@fustana.al"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Fjalëkalimi</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Duke hyrë..." : "Hyr"}
            </Button>
          </form>

          <div className="mt-5 rounded-xl bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
            Kredencialet demo: <strong>admin@fustana.al</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
