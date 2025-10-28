"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Blog", href: "/blog" },
  { label: "Request Invite", href: "/request-invite" },
  { label: "Login", href: "/login" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="border-b border-gold bg-ivory text-charcoal-700">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-6 md:px-16 md:py-8">
        <Link href="/" className="flex items-end gap-1" aria-label="Taylor-Made Baby Co. home">
          <span className="font-script text-3xl text-mauve-700 leading-none">Taylor-Made</span>
          <span className="font-serif text-xl text-charcoal-700 leading-none">Baby Co.</span>
        </Link>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mauve-700 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-6 text-base font-sans md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "transition-colors",
                pathname === link.href ? "text-mauve-700" : "hover:text-mauve-700",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen ? (
        <div className="px-6 pb-6 md:px-16 md:hidden">
          <div className="flex flex-col gap-4 text-base font-sans">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={[
                  "transition-colors",
                  pathname === link.href ? "text-mauve-700" : "hover:text-mauve-700",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
