export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const TOKEN_COOKIE = "token";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = body?.token;

  if (typeof token !== "string" || token.length === 0) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE, "", {
    ...baseCookieOptions,
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("GET /api/session missing JWT_SECRET");
    return NextResponse.json({ user: null }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== "object") {
      return NextResponse.json({ user: null }, { status: 403 });
    }
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 403 });
  }
}
