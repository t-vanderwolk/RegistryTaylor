import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const auth = req.cookies.get("tm_auth")?.value;

  if (path.startsWith("/dashboard") && !auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/invite";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
