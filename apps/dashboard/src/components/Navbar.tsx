"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links: ReadonlyArray<{ name: string; href: Route }> = [
  { name: "Learn", href: "/learn" as Route },
  { name: "Plan", href: "/plan" as Route },
  { name: "Connect", href: "/connect" as Route },
  { name: "Membership", href: "/membership" as Route },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-mauve/20 bg-ivory/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex items-center justify-between px-5 py-3 text-charcoal md:px-10">
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
              <li>
                <Link
                  href={"/login" as Route}
                  onClick={close}
                  className="rounded-full bg-mauve px-6 py-2 text-white transition hover:bg-blush"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
