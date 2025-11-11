import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect all requests to https://www.taylormadebabyco.com
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  if (process.env.NODE_ENV === "production") {
    // Redirect root domain → www
    if (host === "taylormadebabyco.com") {
      url.host = "www.taylormadebabyco.com";
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }

    // Enforce HTTPS (Heroku proxy sometimes forwards as HTTP)
    if (req.headers.get("x-forwarded-proto") === "http") {
      url.protocol = "https:";
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

// Match everything except Next.js internal assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};