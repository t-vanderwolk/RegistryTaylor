"use client";

import { motion } from "framer-motion";

type DashboardHeaderProps = {
  firstName: string;
  membershipTier: string;
  mentorName: string;
  quote?: string;
  currentDate: string;
};

export default function DashboardHeader({
  firstName,
  membershipTier,
  mentorName,
  quote = "Progress, not perfection.",
  currentDate,
}: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-mauve-200/60 bg-gradient-to-br from-ivory via-blush-100 to-white px-5 py-6 text-charcoal-700 shadow-mauve-card md:px-8 md:py-8"
      aria-label="Member welcome"
    >
      <div className="pointer-events-none absolute inset-0 bg-white/40 backdrop-blur-md" aria-hidden />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-mauve-500">
            {membershipTier}
          </p>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-charcoal-400">{currentDate}</p>
            <h1 className="mt-1 font-[var(--font-playfair)] text-3xl text-charcoal-700 md:text-4xl">
              Welcome back{" "}
              <span className="font-script text-4xl text-mauve-600 md:text-[2.75rem]">{firstName}</span>
            </h1>
          </div>
          <p className="text-base leading-relaxed text-charcoal-500 md:max-w-xl">{quote}</p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-sm">
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-white/80 px-4 py-4 text-charcoal-600 shadow-soft">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-charcoal-400">Mentor</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-charcoal-400">{mentorName}</p>
            <p className="text-sm text-charcoal-400">Here for gentle nudges anytime</p>
          </div>
          <div className="rounded-[1.5rem] border border-mauve-200/40 bg-white/60 px-4 py-4 text-charcoal-600 shadow-soft">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-charcoal-400">Intentional cue</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-charcoal-500">Soft steps forward</p>
            <p className="text-sm text-charcoal-400">Breathe, savor, repeat.</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
