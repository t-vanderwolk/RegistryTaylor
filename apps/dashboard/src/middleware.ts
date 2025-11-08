import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_HOME: Record<string, string> = {
  MEMBER: "/dashboard/member",
  MENTOR: "/dashboard/mentor",
  ADMIN: "/dashboard/admin",
};

const LOGIN_PATH = "/login";

function resolveHome(role?: string | null): string {
  if (!role) return "/dashboard/member";
  return DASHBOARD_HOME[role] ?? "/dashboard/member";
}

function buildLoginRedirect(url: URL) {
  const loginUrl = new URL(LOGIN_PATH, url);
  loginUrl.searchParams.set("redirect", url.pathname);
  return loginUrl;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value ?? null;
  const role = request.cookies.get("tm_role")?.value ?? null;

  const normalizedRole = role ? role.toUpperCase() : null;

  // Logged-in users shouldn't see the login screen again.
  if (pathname === LOGIN_PATH) {
    if (token && normalizedRole) {
      return NextResponse.redirect(new URL(resolveHome(normalizedRole), request.url));
    }
    return NextResponse.next();
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isApiRoute =
    pathname.startsWith("/api/community") ||
    pathname.startsWith("/api/support") ||
    pathname.startsWith("/api/mentor") ||
    pathname.startsWith("/api/admin");

  if (!isDashboardRoute && !isApiRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(buildLoginRedirect(request.nextUrl));
  }

  // Role-locked sections.
  if (pathname.startsWith("/dashboard/mentor") && normalizedRole !== "MENTOR") {
    return NextResponse.redirect(new URL(resolveHome(normalizedRole), request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && normalizedRole !== "ADMIN") {
    return NextResponse.redirect(new URL(resolveHome(normalizedRole), request.url));
  }

  if (isApiRoute) {
    if (pathname.startsWith("/api/mentor") && normalizedRole !== "MENTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (pathname.startsWith("/api/admin") && normalizedRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/(community|support|mentor|admin)/:path*"],
};
