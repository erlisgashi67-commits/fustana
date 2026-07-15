"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";

interface RouteInfo {
  path: string; // e.g. "/shop", "/product/abc", "/admin/orders"
  query: URLSearchParams;
  hash: string; // raw hash string, used as snapshot
}

function parseHash(hash: string): RouteInfo {
  const raw = hash.replace(/^#/, "");
  const [path, queryStr] = raw.split("?");
  return {
    path: path || "/",
    query: new URLSearchParams(queryStr || ""),
    hash,
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

/**
 * Pure snapshot — returns the current hash or "#/" default.
 * MUST be side-effect free to avoid React hydration issues.
 */
function getSnapshot(): string {
  return window.location.hash || "#/";
}

/** Server snapshot — always "#/" so the home page renders during SSR. */
function getServerSnapshot(): string {
  return "#/";
}

export function useRouter() {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const route = parseHash(hash);

  // Ensure a default hash exists on first client mount (after hydration).
  // This runs only once and doesn't affect the initial hydrated render.
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to : `#${to}`;
    if (window.location.hash === target) {
      // Force a re-parse even if the hash is identical (e.g. /shop → /shop)
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      window.location.hash = target;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const back = useCallback(() => window.history.back(), []);

  return { ...route, navigate, back };
}

/** Match a path pattern like "/product/:id" against the actual path. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const v = pathParts[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(v);
    } else if (p !== v) {
      return null;
    }
  }
  return params;
}
