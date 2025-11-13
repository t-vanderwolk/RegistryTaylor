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
      className="flex flex-col gap-6 rounded-[1.75rem] border border-blush-300/60 bg-white/95 p-5 shadow-mauve-card"
    >
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-blush-200/30">
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
        <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white/95 text-center shadow-mauve-card">
          <span className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Complete</span>
          <span className="text-xl font-semibold tracking-tight text-charcoal-700">{percentComplete}%</span>
        </div>
      </div>

      <div className="space-y-4 text-left">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-charcoal-700">
            You’re blooming beautifully
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-500">
            {completedModules}/{totalModules} concierge chapters complete. Keep the cadence gentle.
          </p>
        </div>

        <dl className="grid gap-3 text-center sm:grid-cols-3">
          <div className="rounded-2xl border border-blush-200 bg-white/90 px-3 py-3 shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Modules</dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-charcoal-700">
              {completedModules}/{totalModules}
            </dd>
          </div>
          <div className="rounded-2xl border border-blush-200 bg-white/90 px-3 py-3 shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Streak</dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-charcoal-700">{streakDays} days</dd>
          </div>
          <div className="rounded-2xl border border-blush-200 bg-white/90 px-3 py-3 shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Focus</dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-charcoal-700">
              {percentComplete >= 100 ? "Celebration" : "Steady glow"}
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
