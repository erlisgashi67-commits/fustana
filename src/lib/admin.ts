import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE, type JwtPayload } from "./auth";

/** Get the authenticated admin payload from the request cookies (server-side). */
export async function getAdmin(): Promise<JwtPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Throws a 401 Response if the request is not authenticated as admin. */
export async function requireAdmin(): Promise<JwtPayload> {
  const admin = await getAdmin();
  if (!admin) {
    throw new Response(JSON.stringify({ error: "E paautorizuar" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return admin;
}
