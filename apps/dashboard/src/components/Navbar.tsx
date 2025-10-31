"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    let isMounted = true;

    const clearClientToken = () => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem("tmbc.token");
      } catch {
        // Ignore local storage access errors (e.g., private mode).
      }
    };

    const evaluateSession = async () => {
      try {
        const response = await fetch("/api/session", { credentials: "include" });
        if (!response.ok) {
          if (isMounted) setIsAuthenticated(false);
          clearClientToken();
          return;
        }

        const data = (await response.json()) as { authenticated?: boolean };
        if (isMounted) {
          setIsAuthenticated(Boolean(data?.authenticated));
          if (!data?.authenticated) {
            clearClientToken();
          }
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
        clearClientToken();
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
  }, []);

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

  return (
    <nav
      className={[
        "sticky inset-x-0 top-0 z-50 border border-mauve-500/10 bg-[#FFFAF8]/90 backdrop-blur-md transition-all",
        "rounded-b-3xl shadow-[0_18px_45px_rgba(200,161,180,0.18)]",
        scrolled ? "shadow-[0_22px_55px_rgba(200,161,180,0.28)] bg-[#FFFAF8]/95" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-6 px-8 py-4 text-charcoal-500 sm:px-12">
        <Link href={"/" as Route} className="flex items-end gap-1" aria-label="Taylor-Made Baby Co. home">
          <span className="font-script text-3xl leading-none text-mauve-700">Taylor-Made</span>
          <span className="font-serif text-xl leading-none text-charcoal-700">Baby Co.</span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex items-center rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-700 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="tmbc-mobile-nav"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2">
            {links.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "group relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition",
                    "after:absolute after:left-1/2 after:bottom-0 after:h-0.5 after:w-10 after:-translate-x-1/2 after:rounded-full",
                    "after:bg-gradient-to-r after:from-mauve-500 after:via-blush-400 after:to-gold after:content-[''] after:transition after:duration-300",
                    "after:opacity-0 after:scale-x-0 group-hover:after:opacity-100 group-hover:after:scale-x-100",
                    active
                      ? "text-mauve-700 after:opacity-100 after:scale-x-100"
                      : "text-charcoal-500 hover:text-mauve-700",
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
            className="inline-flex items-center gap-2 rounded-full bg-mauve-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-700"
          >
            {CTA_LINK.label}
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="tmbc-mobile-nav"
          className="border-t border-mauve-500/15 bg-[#FFFAF8]/95 px-6 pb-6 pt-4 shadow-[0_22px_55px_rgba(200,161,180,0.2)] md:hidden"
        >
          <div className="flex flex-col gap-3 text-base font-semibold text-charcoal-500">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 transition hover:bg-blush-200/60 hover:text-mauve-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={CTA_LINK.href}
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-mauve-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:bg-mauve-700"
            >
              {CTA_LINK.label}
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
