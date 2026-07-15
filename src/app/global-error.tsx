"use client";

import { useEffect } from "react";

/**
 * Next.js global error boundary.
 * Replaces the root layout when an unhandled error reaches the top level.
 * Must include its own <html> and <body> tags.
 */
export default function GlobalError({
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
    <html lang="sq">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fdf8f6",
          color: "#3d2820",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            Diçka shkoi keq
          </h1>
          <p style={{ color: "#7a6b62", maxWidth: "28rem", margin: 0 }}>
            Ndodhi një gabim gjatë ngarkimit të faqes. Kjo mund të jetë për shkak
            të një përditësimi të dev server-it. Provoni të rifreskoni faqen.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={reset}
              style={{
                background: "#b76e4a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Provo Përsëri
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "transparent",
                color: "#3d2820",
                border: "1px solid #e0d5cf",
                borderRadius: "0.5rem",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Kthehu në Kreu
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
