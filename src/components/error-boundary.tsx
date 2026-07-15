"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that gracefully handles runtime errors.
 *
 * For `ChunkLoadError` (which happens when Turbopack invalidates a chunk
 * during HMR while a stale browser tab is still open), it automatically
 * reloads the page once so the fresh chunks are fetched — giving the user
 * a seamless experience instead of a broken page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    const isChunkLoadError =
      error.name === "ChunkLoadError" ||
      /Loading chunk [\d]+ failed|Failed to load chunk|Loading CSS chunk/i.test(error.message);

    if (isChunkLoadError) {
      // Prevent reload loops: only auto-reload once per session.
      const RELOAD_KEY = "__fustana_chunk_reload";
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, "1");
        // Hard reload to fetch fresh chunks from the dev server.
        window.location.reload();
        return;
      }
      // Already tried reloading once — clear the flag and show fallback.
      sessionStorage.removeItem(RELOAD_KEY);
    }
  }

  handleReload = () => {
    sessionStorage.removeItem("__fustana_chunk_reload");
    window.location.reload();
  };

  handleGoHome = () => {
    sessionStorage.removeItem("__fustana_chunk_reload");
    window.location.hash = "#/";
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
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
              Ndodhi një gabim gjatë ngarkimit të faqes. Kjo mund të jetë për shkak
              të një përditësimi të dev server-it. Provoni të rifreskoni faqen.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={this.handleReload}>Rifresko Faqen</Button>
            <Button variant="outline" onClick={this.handleGoHome}>
              Kthehu në Kreu
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
