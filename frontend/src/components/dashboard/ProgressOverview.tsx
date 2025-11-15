"use client";

import type { Route } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { MEMBER_DASHBOARD_ROUTES } from "@/constants/memberDashboardRoutes";

type ProgressOverviewProps = {
  totalModules: number;
  completedModules: number;
  percentComplete: number;
  streakDays: number;
  badges: string[];
  ctaHref?: Route;
};

export default function ProgressOverview({
  totalModules,
  completedModules,
  percentComplete,
  streakDays,
  badges,
  ctaHref,
}: ProgressOverviewProps) {
  const safePercent = Math.max(0, Math.min(100, percentComplete));
  const ringStyle = {
    background: `conic-gradient(#B18499 ${safePercent * 3.6}deg, rgba(177,132,153,0.15) ${safePercent * 3.6}deg)`,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-label="Academy progress overview"
      className="grid gap-6 rounded-2xl border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card md:grid-cols-[auto,1fr] md:gap-8 md:rounded-[2rem] md:p-8"
    >
      <div className="mx-auto flex flex-col items-center gap-3 md:mx-0 md:items-start">
        <div className="relative h-32 w-32 rounded-full bg-blush-100/70 p-3 md:h-40 md:w-40">
          <div className="h-full w-full rounded-full" style={ringStyle} aria-hidden />
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white/95 text-center shadow-soft">
            <span className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Complete</span>
            <span className="text-2xl font-semibold tracking-tight text-charcoal-700">{safePercent}%</span>
          </div>
        </div>
        <Link
          href={(ctaHref ?? (MEMBER_DASHBOARD_ROUTES.learnWelcome as Route))}
          className="inline-flex items-center rounded-full bg-mauve-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-mauve-600"
        >
          Continue module
        </Link>
      </div>

      <div className="space-y-4 text-left md:space-y-6">
        <div>
          <h2 className="font-[var(--font-playfair)] text-2xl text-charcoal-700">
            You’re blooming beautifully
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-500 md:text-base">
            {completedModules}/{totalModules} concierge chapters complete. Keep the cadence gentle.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-blush-200 bg-ivory px-3 py-3 text-center shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Modules</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight text-charcoal-700">
              {completedModules}/{totalModules}
            </dd>
          </div>
          <div className="rounded-2xl border border-blush-200 bg-ivory px-3 py-3 text-center shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Streak</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight text-charcoal-700">{streakDays} days</dd>
          </div>
          <div className="rounded-2xl border border-blush-200 bg-ivory px-3 py-3 text-center shadow-inner">
            <dt className="text-[0.6rem] uppercase tracking-[0.32em] text-charcoal-300">Focus</dt>
            <dd className="mt-1 text-xl font-semibold tracking-tight text-charcoal-700">
              {percentComplete >= 100 ? "Celebration" : "Steady glow"}
            </dd>
          </div>
        </dl>

        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-mauve-600 md:flex-wrap md:overflow-visible md:pb-0 md:text-[0.6rem]">
          {badges.map((badge) => (
            <span key={badge} className="dashboard-pill min-w-[6rem] snap-center bg-ivory px-3 py-1 text-center">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
