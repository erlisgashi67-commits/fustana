"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "@/hooks/use-router";
import { AdminLogin } from "./admin-login";
import { AdminLayout } from "./admin-layout";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export function AdminApp() {
  const { path } = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    api.auth
      .me()
      .then((res) => {
        if (!cancelled) setAdmin(res.admin);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (admin === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!admin) {
    return (
      <AdminLogin
        onLogin={async () => {
          const res = await api.auth.me();
          setAdmin(res.admin);
        }}
      />
    );
  }

  return <AdminLayout admin={admin} onLogout={() => setAdmin(null)} path={path} />;
}
