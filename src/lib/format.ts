/**
 * Format a number as Albanian Lek.
 *
 * IMPORTANT: This must NOT use `Intl.NumberFormat` because Node.js and browser
 * ICU data produce different strings (e.g. "8900 Lekë" on server vs
 * "ALL 8,900" on client), causing React hydration mismatches.
 * We format manually so server and client always produce identical output.
 */
export function formatALL(amount: number): string {
  const rounded = Math.round(amount);
  const negative = rounded < 0;
  const absStr = Math.abs(rounded).toString();
  // Albanian convention: dot as thousands separator
  const withSeparators = absStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}${withSeparators} Lekë`;
}

const SQ_MONTHS = [
  "janar",
  "shkurt",
  "mars",
  "prill",
  "maj",
  "qershor",
  "korrik",
  "gusht",
  "shtator",
  "tetor",
  "nëntor",
  "dhjetor",
] as const;

/**
 * Format a date in Albanian.
 *
 * Deterministic (no Intl) to avoid hydration mismatches.
 * Uses the local timezone — only called in client-rendered components
 * (admin dashboard / order tables), so timezone is consistent.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = SQ_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/** Parse a JSON field that is stored as a string in SQLite. */
export function parseJSONField<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) return value as T;
  if (typeof value !== "string") return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/** Generate a human-friendly order number. Only called server-side (API route). */
export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `FS-${ts}${rand}`;
}
