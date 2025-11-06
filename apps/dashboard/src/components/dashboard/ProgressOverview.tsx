"use client";

import { motion } from "framer-motion";

type ProgressOverviewProps = {
  totalModules: number;
  completedModules: number;
  percentComplete: number;
  streakDays: number;
  badges: string[];
};

const PETALS = 6;

export default function ProgressOverview({
  totalModules,
  completedModules,
  percentComplete,
  streakDays,
  badges,
}: ProgressOverviewProps) {
  const filledPetals = Math.round((percentComplete / 100) * PETALS);

  return (
    <section
      aria-label="Academy progress overview"
      className="flex flex-col gap-8 rounded-2xl border border-blush-300/70 bg-ivory/95 p-8 shadow-mauve-card md:flex-row md:items-center md:justify-between md:p-10"
    >
      <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-blush-200/40">
        {[...Array(PETALS)].map((_, index) => {
          const angle = (360 / PETALS) * index;
          const isFilled = index < filledPetals;
          return (
            <motion.span
              key={angle}
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{
                scale: isFilled ? 1 : 0.85,
                opacity: isFilled ? 1 : 0.4,
              }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
              className="absolute h-16 w-20 origin-bottom rounded-full bg-mauve-500/70 blur-[0.5px]"
              style={{ transform: `rotate(${angle}deg) translateY(-32px)` }}
            />
          );
        })}
        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white/90 text-center shadow-mauve-card">
          <span className="text-xs uppercase tracking-[0.28em] text-charcoal-300">Complete</span>
          <span className="font-serif text-2xl text-charcoal-700">{percentComplete}%</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-700 md:text-[2.1rem]">
            You’re blooming beautifully
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-400 md:text-base">
            {completedModules} of {totalModules} concierge modules are complete. Keep the cadence gentle and steady—luxury
            lives in consistent care.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-blush-300/60 bg-white/80 p-4 text-center shadow-inner">
            <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">Modules</dt>
            <dd className="mt-2 font-serif text-xl text-charcoal-700">
              {completedModules}/{totalModules}
            </dd>
          </div>
          <div className="rounded-2xl border border-blush-300/60 bg-white/80 p-4 text-center shadow-inner">
            <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">Streak</dt>
            <dd className="mt-2 font-serif text-xl text-charcoal-700">{streakDays} days</dd>
          </div>
          <div className="rounded-2xl border border-blush-300/60 bg-white/80 p-4 text-center shadow-inner">
            <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">Focus</dt>
            <dd className="mt-2 font-serif text-xl text-charcoal-700">
              {percentComplete >= 100 ? "Celebration" : "Steady Glow"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="dashboard-pill text-[0.6rem]">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
