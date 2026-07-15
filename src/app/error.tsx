"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Next.js App Router route-level error boundary.
 * Catches errors thrown during rendering of any route segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const isChunkLoadError =
      error.name === "ChunkLoadError" ||
      /Loading chunk [\d]+ failed|Failed to load chunk|Loading CSS chunk/i.test(error.message);

    if (isChunkLoadError) {
      const RELOAD_KEY = "__fustana_chunk_reload";
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
      } else {
        sessionStorage.removeItem(RELOAD_KEY);
      }
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold">Diçka shkoi keq</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Ndodhi një gabim gjatë ngarkimit të faqes. Provoni të rifreskoni.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Provo Përsëri</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Kthehu në Kreu
        </Button>
      </div>
    </div>
  );
}
