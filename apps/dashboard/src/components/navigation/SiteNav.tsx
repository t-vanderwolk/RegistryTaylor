"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence as MotionPresence } from "framer-motion";

// ✅ Font imports
import {
  nunito,
  playfair,
  playfairSc,
  greatVibes,
} from "@/app/fonts";

type SiteNavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: ReadonlyArray<SiteNavItem>;
  cta?: {
    label: string;
    href: string;
  } | null;
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href;
}

export default function SiteNav({ items, cta }: SiteNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navClassName = [
    "sticky inset-x-0 top-0 z-50 transition-all backdrop-blur",
    "rounded-b-[1.5rem] border border-[#EAD6DE]/70",
    "bg-gradient-to-b from-[#FDF7F9] to-[#FAF4F6]",
    "shadow-[0_10px_40px_rgba(200,161,180,0.15)]",
    scrolled ? "shadow-[0_4px_30px_rgba(200,161,180,0.25)]" : "",
  ].join(" ");

  return (
    <nav className={`${navClassName} ${nunito.variable} ${playfair.variable} ${playfairSc.variable} ${greatVibes.variable}`}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3 text-[#3E2F35] sm:px-8 lg:px-10">
        {/* ─── Logo ───────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-4" aria-label="Taylor-Made Baby Co. home">
          <div className="flex flex-col leading-tight select-none">
            <span
              className={`text-4xl md:text-5xl text-[#C8A1B4] font-[var(--font-great-vibes)]`}
            >
              Taylor-Made
            </span>
            <span
              className={`text-xs uppercase tracking-[0.5em] text-[#3E2F35]/80 font-[var(--font-playfair)]`}
            >
              BABY CO.
            </span>
          </div>
        </Link>

        {/* ─── Mobile Menu Toggle ─────────────────────────────── */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.25)] transition hover:text-[#C9A26B] md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "Close" : "Menu"}
        </motion.button>

        {/* ─── Desktop Links ──────────────────────────────────── */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-3 text-sm font-[var(--font-nunito)]">
            {items.map((item) => {
              const active = isActiveLink(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} className="relative">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className={[
                      "inline-flex items-center rounded-full border px-4 py-2 text-sm font-[var(--font-nunito)] transition-all shadow-[0_4px_20px_rgba(217,184,196,0.25)]",
                      active
                        ? "bg-[#F3E3E8] text-[#3E2F35] border-[#EAD6DE]"
                        : "text-[#3E2F35]/80 border-transparent hover:text-[#C9A26B] hover:border-[#EAD6DE]/60",
                    ].join(" ")}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#3E2F35] px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(62,47,53,0.25)] transition hover:-translate-y-0.5 hover:bg-[#C9A26B]"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>

      {/* ─── Mobile Drawer ───────────────────────────────────── */}
      <MotionPresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-white/50 bg-[#FDF7F9]/95 px-6 pb-6 pt-4 text-[#3E2F35] shadow-[0_25px_55px_rgba(200,161,180,0.25)] md:hidden"
          >
            <div className="flex flex-col gap-3 text-base font-[var(--font-nunito)]">
              {items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-center text-sm font-semibold text-[#3E2F35] transition hover:border-[#EAD6DE] hover:text-[#C9A26B]"
                >
                  {link.label}
                </Link>
              ))}
              {cta && (
                <Link
                  href={cta.href}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-[#3E2F35] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(62,47,53,0.25)] transition hover:-translate-y-0.5 hover:bg-[#C9A26B]"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </MotionPresence>
    </nav>
  );
}
