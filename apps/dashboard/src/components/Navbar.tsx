"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/apiClient";
import { STORED_TOKEN_KEY } from "@/lib/sessionKeys";
import { clearStoredToken } from "@/lib/auth";

const BASE_LINKS: ReadonlyArray<{ label: string; href: Route }> = [
  { label: "Home", href: "/" as Route },
  { label: "Learn", href: "/learn" as Route },
  { label: "Membership", href: "/membership" as Route },
  { label: "Community", href: "/community" as Route },
  { label: "Login", href: "/login" as Route },
] as const;

const CTA_LINK: { label: string; href: Route } = {
  label: "Request Invite",
  href: "/request-invite" as Route,
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/learn") {
    return pathname === "/learn";
  }

  if (href === "/community") {
    return pathname === "/community";
  }

  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard");
  }

  return pathname === href;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sessionEndpoint = `${API_URL}/api/auth/session`;

  useEffect(() => {
    let isMounted = true;

    const evaluateSession = async () => {
      try {
        if (typeof window === "undefined") return;
        const token = window.localStorage.getItem(STORED_TOKEN_KEY);
        if (!token) {
          if (isMounted) setIsAuthenticated(false);
          return;
        }

        const response = await fetch(sessionEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          cache: "no-store",
        });

        if (isMounted) {
          setIsAuthenticated(response.ok);
          if (response.status === 401 || response.status === 404) {
            clearStoredToken();
          }
        }
      } catch {
        if (isMounted) setIsAuthenticated(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    evaluateSession();
    handleScroll();

    window.addEventListener("focus", evaluateSession);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      isMounted = false;
      window.removeEventListener("focus", evaluateSession);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sessionEndpoint]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = useMemo(() => {
    return BASE_LINKS.map((link) =>
      link.href === "/login" && isAuthenticated
        ? { label: "Dashboard", href: "/dashboard" as Route }
        : link,
    );
  }, [isAuthenticated]);

  const navClassName = [
    "sticky inset-x-0 top-0 z-50 border border-mauve-500/10 bg-ivory/80 backdrop-blur-sm transition-all",
    "rounded-b-3xl shadow-md shadow-mauve-500/20",
    scrolled ? "shadow-lg shadow-mauve-600/25 bg-ivory/90" : "",
  ].join(" ");

  return (
    <nav className={navClassName}>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-6 px-8 py-4 text-charcoal sm:px-12">
        <Link
          href={"/" as Route}
          className="flex items-baseline space-x-2 transition hover:text-mauve-600"
          aria-label="Taylor-Made Baby Co. home"
        >
          <span className="font-script text-4xl text-mauve-500 tracking-tight md:text-5xl">Taylor-Made</span>
          <span className="font-[var(--font-playfair-sc)] text-xl font-semibold uppercase tracking-[0.35em] text-charcoal md:text-2xl">
            Baby Co.
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex items-center rounded-full bg-rose px-4 py-2 text-sm font-semibold text-charcoal shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-600 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="tmbc-mobile-nav"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2 text-sm font-sans text-charcoal">
            {links.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "relative inline-flex items-center px-3 py-2 text-sm font-semibold tracking-wide transition",
                    "after:absolute after:left-1/2 after:bottom-0 after:h-1 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-mauve-500 after:opacity-0 after:transition after:duration-200",
                    active
                      ? "text-mauve-500 after:opacity-100"
                      : "text-charcoal hover:text-mauve-500 hover:after:opacity-100",
                  ].join(" ")}
                  prefetch={!link.href.startsWith("/#")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Link
            href={CTA_LINK.href}
            className="inline-flex items-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-charcoal shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-600"
          >
            {CTA_LINK.label}
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="tmbc-mobile-nav"
          className="border-t border-mauve-500/15 bg-ivory/95 px-6 pb-6 pt-4 shadow-[0_22px_55px_rgba(200,161,180,0.2)] md:hidden"
        >
          <div className="flex flex-col gap-3 text-base font-semibold text-charcoal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 transition hover:bg-blush-200/60 hover:text-mauve-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={CTA_LINK.href}
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-rose px-5 py-3 text-sm font-semibold text-charcoal shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-600"
            >
              {CTA_LINK.label}
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
