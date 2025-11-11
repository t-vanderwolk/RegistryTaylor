"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type MemberLayoutProps = {
  children: ReactNode;
};

export default function MemberLayout({ children }: MemberLayoutProps) {
  const pathname = usePathname() ?? "";

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-10"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
