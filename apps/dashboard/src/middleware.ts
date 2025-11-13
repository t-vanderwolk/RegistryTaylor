import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login", "/logout", "/request-invite", "/blog"]);
const PUBLIC_PREFIXES = ["/api", "/blog/"];
const DASHBOARD_PREFIX = "/dashboard";
const TOKEN_COOKIE = "token";

const canonicalSiteUrl = (() => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return null;
  }
  try {
    return new URL(siteUrl);
  } catch {
    return null;
  }
})();

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

const ROLE_PATH_MAP: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  MENTOR: "/dashboard/mentor",
  MEMBER: "/dashboard/member",
};

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    if (typeof atob === "function") {
      return atob(padded);
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

function decodeRoleFromToken(token: string): keyof typeof ROLE_PATH_MAP | null {
  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }
  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }
  try {
    const data = JSON.parse(decoded) as { role?: string };
    const role = data?.role?.toUpperCase();
    if (role && role in ROLE_PATH_MAP) {
      return role as keyof typeof ROLE_PATH_MAP;
    }
    return null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;
  const siteOrigin = canonicalSiteUrl?.origin ?? req.nextUrl.origin;

  if (process.env.NODE_ENV === "production") {
    if (canonicalSiteUrl) {
      if (host !== canonicalSiteUrl.host) {
        url.host = canonicalSiteUrl.host;
        url.protocol = canonicalSiteUrl.protocol;
        return NextResponse.redirect(url, 301);
      }

      if (
        canonicalSiteUrl.protocol === "https:" &&
        req.headers.get("x-forwarded-proto") === "http"
      ) {
        url.protocol = "https:";
        return NextResponse.redirect(url, 301);
      }
    } else {
      if (host === "taylormadebabyco.com") {
        url.host = "www.taylormadebabyco.com";
        url.protocol = "https:";
        return NextResponse.redirect(url, 301);
      }

      if (req.headers.get("x-forwarded-proto") === "http") {
        url.protocol = "https:";
        return NextResponse.redirect(url, 301);
      }
    }
  }

  if (!pathname.startsWith(DASHBOARD_PREFIX) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", siteOrigin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = decodeRoleFromToken(token);
  if (role) {
    const rolePath = ROLE_PATH_MAP[role];
    const isWithinRolePath =
      pathname === rolePath || pathname.startsWith(`${rolePath}/`);

    if (!isWithinRolePath) {
      const redirectUrl = new URL(rolePath, siteOrigin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
