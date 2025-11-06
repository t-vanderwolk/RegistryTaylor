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
      className="relative overflow-hidden rounded-2xl bg-dashboard-header px-8 py-10 text-charcoal-500 shadow-mauve-glow md:px-12 md:py-14"
      aria-label="Member welcome"
    >
      <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-sm" aria-hidden />
      <div className="relative flex flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-charcoal-300">
            {membershipTier}
          </p>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <h1 className="font-[var(--font-great-vibes)] text-4xl text-charcoal-700 md:text-5xl">
              Welcome back, {firstName} 👋
            </h1>
            <span className="text-sm uppercase tracking-[0.3em] text-charcoal-400">
              {currentDate}
            </span>
          </div>
          <p className="text-base leading-relaxed text-charcoal-400 md:text-lg">
            {quote}
          </p>
        </div>

        <div
          className="h-1 w-full rounded-full bg-dashboard-strip"
          role="presentation"
          aria-hidden
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="dashboard-card flex flex-col gap-1 rounded-2xl border-white/30 bg-white/60 p-5 shadow-none backdrop-blur">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">
              Your Concierge
            </span>
            <span className="font-serif text-xl text-charcoal-700">{mentorName}</span>
          </div>
          <div className="dashboard-card flex flex-col gap-1 rounded-2xl border-white/30 bg-white/50 p-5 shadow-none backdrop-blur">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">
              Daily Intention
            </span>
            <span className="font-serif text-xl text-charcoal-700">Soft steps forward</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
