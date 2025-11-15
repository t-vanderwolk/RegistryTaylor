"use client";

import { motion } from "framer-motion";

export default function HeroHeading() {
  return (
    <div className="space-y-6 text-center lg:text-left">
      <motion.h1
        className="text-center lg:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="block font-script text-[#C8A1B4] text-6xl tracking-tight md:text-7xl">Taylor-Made</span>
        <span className="block font-[var(--font-playfair-sc)] text-3xl font-semibold uppercase tracking-[0.4em] text-[#3E2F35] md:text-4xl">
          Baby Co.
        </span>
      </motion.h1>
      <motion.p
        className="mt-2 text-lg text-[#3E2F35] md:text-xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        Baby prep, Taylor-Made.
      </motion.p>
      <motion.p
        className="text-sm leading-relaxed text-[#3E2F35]/75 md:text-base"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
      >
        Taylor-Made Baby Co. connects design, psychology, and real-world expertise to help parents prepare with confidence and
        calm.
      </motion.p>
    </div>
  );
}
