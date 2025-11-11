"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links: ReadonlyArray<{ label: string; href: Route }> = [
  { label: "Learn", href: "/learn" as Route },
  { label: "Membership", href: "/membership" as Route },
  { label: "Community", href: "/community" as Route },
  { label: "Login", href: "/login" as Route },
  { label: "Request Invite", href: "/request-invite" as Route },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#EAC9D1]/40 bg-[#FFFAF8]/95 text-[#3E2F35] shadow-[0_20px_45px_rgba(62,47,53,0.08)] backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href={"/" as Route}
          className="flex flex-col leading-tight text-[#3E2F35]"
          onClick={closeMenu}
        >
          <span className="font-[var(--font-great-vibes)] text-2xl text-[#C8A1B4] md:text-3xl">
            Taylor-Made Baby Co.
          </span>
          <span className="font-[var(--font-playfair)] text-xs uppercase tracking-[0.4em] text-[#D9C48E] md:text-sm">
            Styled care for modern families
          </span>
        </Link>

        <div className="hidden items-center gap-6 font-[var(--font-nunito)] text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative px-1 py-1 font-semibold tracking-wide transition hover:text-[#C8A1B4]"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-[#C8A1B4] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href={"/login" as Route}
            className="rounded-full bg-[#C8A1B4] px-5 py-2 text-sm font-bold text-white shadow-[0_10px_30px_rgba(200,161,180,0.35)] transition hover:bg-[#EAC9D1] hover:text-[#3E2F35]"
          >
            Login
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="inline-flex items-center rounded-full border border-[#D9C48E]/60 p-2 text-[#3E2F35] transition hover:border-[#C8A1B4] hover:text-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#C8A1B4] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-[72px] z-40 w-full md:hidden"
          >
            <div className="mx-auto w-[92%] rounded-2xl border border-[#EAC9D1]/50 bg-[#FFFAF8] text-center font-[var(--font-nunito)] shadow-[0_20px_45px_rgba(62,47,53,0.12)]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 py-6"
              >
                {links.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-base font-semibold tracking-wide text-[#3E2F35]"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <Link
                    href={"/login" as Route}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#3E2F35] px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#FFFAF8]"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 z-30 bg-[#3E2F35]/30 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
