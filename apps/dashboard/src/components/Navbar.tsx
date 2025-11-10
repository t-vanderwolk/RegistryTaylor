"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence as MotionPresence } from "framer-motion";
import { API_URL } from "@/lib/apiClient";
import { STORED_TOKEN_KEY } from "@/lib/sessionKeys";
import { clearStoredToken } from "@/lib/auth";

const NAV_LINKS: ReadonlyArray<{ label: string; href: Route }> = [
  { label: "How It Works", href: "/how-it-works" as Route },
  { label: "Membership", href: "/membership" as Route },
  { label: "Blog", href: "/blog" as Route },
  { label: "Request Invite", href: "/request-invite" as Route },
  { label: "Login", href: "/login" as Route },
] as const;

const CTA_LINK: { label: string; href: Route } = {
  label: "Join Concierge",
  href: "/request-invite" as Route,
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
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
    return NAV_LINKS.map((link) =>
      link.href === "/login" && isAuthenticated
        ? { label: "Dashboard", href: "/dashboard" as Route }
        : link,
    );
  }, [isAuthenticated]);

  const navClassName = [
    "sticky inset-x-0 top-0 z-50 transition-all backdrop-blur",
    "rounded-b-[2rem] border border-white/40 shadow-[0_18px_55px_rgba(217,184,196,0.35)]",
    "bg-gradient-to-b from-[#F7E6E8]/95 via-[#F2D3DA]/90 to-[#D9B8C4]/90",
    scrolled ? "shadow-[0_20px_60px_rgba(62,47,53,0.15)]" : "",
  ].join(" ");

  return (
    <nav className={navClassName}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3 text-[#3E2F35] sm:px-8 lg:px-10">
        <Link
          href={"/" as Route}
          className="flex items-center gap-4 text-[#3E2F35]"
          aria-label="Taylor-Made Baby Co. home"
        >
          <div className="flex flex-col leading-tight">
            <span className="font-script text-3xl text-[#3E2F35] md:text-4xl">Taylor-Made</span>
            <span className="font-[var(--font-playfair)] text-xs uppercase tracking-[0.5em] text-[#3E2F35]/80">
              Baby Co.
            </span>
          </div>
        </Link>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex items-center rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.25)] transition hover:text-[#C9A26B] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="tmbc-mobile-nav"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </motion.button>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-3 text-sm font-[var(--font-nunito)]">
            {links.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative"
                  prefetch={!link.href.startsWith("/#")}
                >
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className={[
                      "inline-flex items-center rounded-full px-3 py-2 transition-colors",
                      active
                        ? "bg-white/80 text-[#C38B8E] shadow-[0_8px_20px_rgba(200,161,180,0.25)]"
                        : "text-[#3E2F35]/80 hover:text-[#C9A26B]",
                    ].join(" ")}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </div>
          <Link
            href={CTA_LINK.href}
            className="inline-flex items-center gap-2 rounded-full bg-[#3E2F35] px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(62,47,53,0.25)] transition hover:-translate-y-0.5 hover:bg-[#C9A26B]"
          >
            {CTA_LINK.label}
          </Link>
        </div>
      </div>

      <MotionPresence>
        {menuOpen ? (
          <motion.div
            id="tmbc-mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-white/50 bg-white/95 px-6 pb-6 pt-4 text-[#3E2F35] shadow-[0_25px_55px_rgba(200,161,180,0.25)] md:hidden"
          >
            <div className="flex flex-col gap-3 text-base font-[var(--font-nunito)]">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-white/50 bg-[#FDF7F9] px-4 py-3 text-center text-sm font-semibold text-[#3E2F35] transition hover:border-[#EAD6B9] hover:text-[#C9A26B]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={CTA_LINK.href}
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#3E2F35] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(62,47,53,0.25)] transition hover:-translate-y-0.5 hover:bg-[#C9A26B]"
              >
                {CTA_LINK.label}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </MotionPresence>
    </nav>
  );
}
