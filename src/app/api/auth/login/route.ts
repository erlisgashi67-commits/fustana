import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signToken, ADMIN_COOKIE } from "@/lib/auth";

/** POST /api/auth/login — admin login. Sets HTTP-only cookie. */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email dhe fjalëkalimi janë të detyrueshme." }, { status: 400 });
  }

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Email ose fjalëkalim i pasaktë." }, { status: 401 });
  }

  const token = signToken({ sub: admin.id, email: admin.email, name: admin.name });

  const res = NextResponse.json({
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
