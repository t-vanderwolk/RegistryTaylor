import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
