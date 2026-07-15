import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

/** POST /api/auth/logout — clear admin cookie. */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
