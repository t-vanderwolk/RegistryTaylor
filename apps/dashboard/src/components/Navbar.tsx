"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  href: Route;
  description: string;
};

const navLinks: NavLink[] = [
  { label: "Learn", href: "/learn", description: "Academy overview & curriculum" },
  { label: "Membership", href: "/membership", description: "Concierge benefits" },
  { label: "Community", href: "/community", description: "Events & gathering spaces" },
  { label: "Login", href: "/login", description: "Member dashboard access" },
  { label: "Request Invite", href: "/request-invite", description: "Join Taylor-Made" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  const activeHref = useMemo(() => {
    const match = navLinks.find((link) => link.href === pathname);
    return match?.href ?? null;
  }, [pathname]);

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full border-b border-[#EAC9D1]/40 bg-[#FFFAF8]/95 text-[#3E2F35] shadow-[0_20px_45px_rgba(62,47,53,0.08)] backdrop-blur-xl"
      aria-label="Taylor-Made Baby Co. navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href={"/" as Route} className="flex flex-col leading-tight" onClick={closeMenu}>
          <span className="font-[var(--font-great-vibes)] text-2xl text-[#C8A1B4] md:text-3xl">Taylor-Made Baby Co.</span>
          <span className="font-[var(--font-playfair)] text-xs uppercase tracking-[0.4em] text-[#D9C48E] md:text-sm">
            Styled care for modern families
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-[var(--font-nunito)] text-sm md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative px-1 py-1 font-semibold tracking-wide transition hover:text-[#C8A1B4]"
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-0 h-[2px] transition-all duration-300 ${
                  activeHref === link.href ? "w-full bg-[#D9C48E]" : "w-0 bg-[#C8A1B4] group-hover:w-full"
                }`}
                aria-hidden
              />
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="inline-flex items-center rounded-full border border-[#D9C48E]/60 p-2 text-[#3E2F35] transition hover:border-[#C8A1B4] hover:text-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#C8A1B4] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-[#EAC9D1]/50 bg-[#FFFAF8]"
          >
            <nav className="flex flex-col px-6 py-6 font-[var(--font-nunito)] text-[#3E2F35]" aria-label="Mobile navigation">
              {navLinks.map((link, index) => (
                <motion.div key={link.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="w-full">
                  <Link
                    href={link.href}
                    className={`block rounded-2xl px-4 py-3 text-base font-semibold tracking-wide transition ${
                      activeHref === link.href ? "bg-[#EAC9D1]/30 text-[#3E2F35]" : "text-[#3E2F35]"
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                    <span className="mt-1 block text-xs font-normal text-[#3E2F35]/70">{link.description}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
                <Link
                  href={"/login" as Route}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#3E2F35] px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-[#FFFAF8] transition hover:-translate-y-0.5"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
