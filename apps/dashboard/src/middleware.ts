import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login", "/request-invite", "/blog"]);
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

  const hasToken = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);
  if (!hasToken) {
    const loginUrl = new URL("/login", siteOrigin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
