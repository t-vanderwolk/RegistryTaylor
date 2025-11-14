export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const TOKEN_COOKIE = "token";

type SessionUser = {
  id: string;
  email: string | null;
  role: "MEMBER" | "MENTOR" | "ADMIN";
};

const unauthenticatedResponse = NextResponse.json(
  { authenticated: false, user: null },
  { status: 401 },
);

function decodeToken(token: string, secret: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !("role" in decoded)) {
      return null;
    }

    return {
      id: String(decoded.id),
      role: String(decoded.role).toUpperCase() as SessionUser["role"],
      email: typeof decoded.email === "string" ? decoded.email : null,
    };
  } catch (error) {
    console.warn("Unable to decode session token", error);
    return null;
  }
}

function resolveJwtSecret(): string | null {
  const secret =
    process.env.JWT_SECRET ??
    process.env.NEXT_PUBLIC_JWT_SECRET ??
    process.env.API_JWT_SECRET ??
    process.env.SECRET_KEY ??
    null;
  return secret ?? "tmbc_secret_key";
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return unauthenticatedResponse;
  }

  const secret = resolveJwtSecret();
  if (!secret) {
    console.error("GET /api/session missing JWT_SECRET");
    return NextResponse.json(
      { authenticated: false, user: null, error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const user = decodeToken(token, secret);
  if (!user) {
    return unauthenticatedResponse;
  }

  return NextResponse.json(
    {
      authenticated: true,
      user,
    },
    { status: 200 },
  );
}
