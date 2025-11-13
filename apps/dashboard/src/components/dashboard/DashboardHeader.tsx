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
      className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-dashboard-header px-5 py-6 text-charcoal-100 shadow-mauve-glow"
      aria-label="Member welcome"
    >
      <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-sm" aria-hidden />
      <div className="relative space-y-5">
        <div className="space-y-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-white/70">
            {membershipTier}
          </p>
          <div className="space-y-1">
            <h1 className="font-[var(--font-playfair)] text-3xl text-white">
              Hi {firstName} 👋
            </h1>
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-white/70">
              {currentDate}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{quote}</p>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-white">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/70">Mentor</p>
              <p className="text-lg font-semibold tracking-tight text-white">{mentorName}</p>
            </div>
            <span aria-hidden className="text-xl">✨</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/70">Intention</p>
              <p className="text-lg font-semibold tracking-tight text-white">Soft steps forward</p>
            </div>
            <span aria-hidden className="text-xl">🌿</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
