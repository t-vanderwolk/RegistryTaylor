"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links: ReadonlyArray<{ name: string; href: Route }> = [
  { name: "Learn", href: "/learn" as Route },
  { name: "Membership", href: "/membership" as Route },
  { name: "Community", href: "/community" as Route },
  { name: "Login", href: "/login" as Route },
  { name: "Request Invite", href: "/request-invite" as Route },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
          onClick={toggle}
          className="text-charcoal focus:outline-none md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className="hidden items-center space-x-8 font-[var(--font-nunito)] text-sm md:flex">
          {links.map((link) => (
            <li key={link.name} className="group relative">
              <Link href={link.href} className="transition hover:text-mauve">
                {link.name}
              </Link>
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-mauve transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
          <li>
            <Link
              href={"/login" as Route}
              className="rounded-full bg-mauve px-4 py-2 text-white transition hover:bg-blush"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-mauve/20 bg-ivory shadow-inner md:hidden"
          >
            <ul className="flex flex-col items-center space-y-5 py-6 font-[var(--font-nunito)] text-charcoal">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} onClick={close} className="text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ivory/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
