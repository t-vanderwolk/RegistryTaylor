export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TOKEN_COOKIE = "token";
const AUTH_SESSION_PATH = "/api/auth/session";

type SessionUser = {
  id: string;
  email: string | null;
  role: "MEMBER" | "MENTOR" | "ADMIN";
};

type BackendSessionResponse =
  | { user: SessionUser }
  | { message?: string; error?: string };

const unauthenticatedResponse = NextResponse.json(
  { authenticated: false, user: null },
  { status: 401 },
);

function resolveApiBaseUrl(): string | null {
  const explicit =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.INTERNAL_API_URL;

  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }

  return null;
}

function buildAuthSessionUrl(): URL {
  const fallback = "http://localhost:5050";
  const baseUrl = resolveApiBaseUrl() ?? fallback;
  return new URL(AUTH_SESSION_PATH, `${baseUrl}/`);
}

function toSessionUser(payload: BackendSessionResponse): SessionUser | null {
  if (!payload || typeof payload !== "object" || !("user" in payload)) {
    return null;
  }
  const user = payload.user;
  if (!user || typeof user !== "object") {
    return null;
  }
  return {
    id: String(user.id),
    email: typeof user.email === "string" ? user.email : null,
    role: String(user.role).toUpperCase() as SessionUser["role"],
  };
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return unauthenticatedResponse;
  }

  try {
    const sessionUrl = buildAuthSessionUrl();
    const response = await fetch(sessionUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 404) {
      return unauthenticatedResponse;
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as BackendSessionResponse;
      const message = ("error" in body && body.error) || ("message" in body && body.message);
      return NextResponse.json(
        { authenticated: false, user: null, error: message ?? "Unable to verify session" },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as BackendSessionResponse;
    const user = toSessionUser(payload);
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null, error: "Invalid session response" },
        { status: 502 },
      );
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("GET /api/session failed to reach backend", error);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Unable to verify session" },
      { status: 502 },
    );
  }
}
