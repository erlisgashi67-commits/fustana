import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fustana-dev-secret-change-in-production-9f3k2";

/* ---------------- Password hashing (scrypt) ---------------- */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const hashBuf = Buffer.from(scryptSync(password, salt, 64));
  const keyBuf = Buffer.from(key, "hex");
  if (hashBuf.length !== keyBuf.length) return false;
  return timingSafeEqual(hashBuf, keyBuf);
}

/* ---------------- Simple JWT (HMAC-SHA256) ---------------- */

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): Buffer {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp" | "role">, expiresInSec = 60 * 60 * 24 * 7): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    role: "admin",
    iat: now,
    exp: now + expiresInSec,
  };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${headerB64}.${payloadB64}`;
  const sig = createHmac("sha256", JWT_SECRET).update(data).digest();
  const sigB64 = base64UrlEncode(sig);
  return `${data}.${sigB64}`;
}

export function verifyToken(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expectedSig = createHmac("sha256", JWT_SECRET).update(data).digest();
  const actualSig = base64UrlDecode(sigB64);
  if (expectedSig.length !== actualSig.length) return null;
  if (!timingSafeEqual(expectedSig, actualSig)) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString()) as JwtPayload;
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = "fustana_admin_token";
