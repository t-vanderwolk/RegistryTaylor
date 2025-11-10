"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";

const links: ReadonlyArray<{ name: string; href: Route }> = [
  { name: "Learn", href: "/learn" as Route },
  { name: "Membership", href: "/membership" as Route },
  { name: "Community", href: "/community" as Route },
  { name: "Login", href: "/login" as Route },
  { name: "Request Invite", href: "/request-invite" as Route },
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
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-mauve/20 bg-gradient-to-r from-mauve-300/90 via-rose/90 to-blush-200/90 backdrop-blur-xl shadow-[0_15px_40px_rgba(200,161,180,0.25)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 text-charcoal md:px-10">
        <Link
          href={"/" as Route}
          className="font-[var(--font-great-vibes)] text-2xl text-mauve md:text-3xl"
        >
          Taylor-Made Baby Co.
        </Link>

        <button
          onClick={toggleMenu}
          className="rounded-full p-2 text-charcoal transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-mauve md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            className={`h-6 w-6 transition-transform ${menuOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        <div className="hidden items-center space-x-8 font-[var(--font-nunito)] text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative transition hover:text-mauve"
            >
              {link.name}
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-mauve transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href={"/login" as Route}
            className="rounded-full bg-mauve px-4 py-2 text-white transition hover:bg-blush"
          >
            Login
          </Link>
        </div>
      </div>

      <div
        className={`md:hidden border-t border-mauve/20 bg-ivory shadow-inner transition-all duration-300 ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 py-6 font-[var(--font-nunito)] text-charcoal">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={"/login" as Route}
            className="rounded-full bg-mauve px-4 py-2 text-center text-white"
            onClick={closeMenu}
          >
            Login
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-hidden
        />
      )}
    </nav>
  );
}
