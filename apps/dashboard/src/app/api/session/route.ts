export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/auth";

const TOKEN_COOKIE = "token";
const ROLE_COOKIE = "tm_role";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const ALLOWED_ROLES: ReadonlyArray<UserRole> = ["MEMBER", "MENTOR", "ADMIN"];

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const role = typeof body?.role === "string" ? body.role.toUpperCase() : null;

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: MAX_AGE_SECONDS,
  });

  if (role && (ALLOWED_ROLES as ReadonlyArray<string>).includes(role)) {
    cookieStore.set(ROLE_COOKIE, role, {
      ...baseCookieOptions,
      httpOnly: false,
      maxAge: MAX_AGE_SECONDS,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE, "", {
    ...baseCookieOptions,
    maxAge: 0,
  });
  cookieStore.set(ROLE_COOKIE, "", {
    ...baseCookieOptions,
    httpOnly: false,
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
