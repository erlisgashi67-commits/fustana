import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

/** GET /api/auth/me — check current admin session. */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ admin: null });
  return NextResponse.json({ admin });
}
