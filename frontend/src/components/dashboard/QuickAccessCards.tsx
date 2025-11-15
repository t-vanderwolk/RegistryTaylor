"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
type QuickAccessCardsProps = {
  academy: {
    percentComplete: number;
    nextTitle: string | null;
    href: Route;
  };
  registry: {
    itemsAdded: number;
    goalCount: number;
    href: Route;
  };
  reflection: {
    excerpt: string | null;
    updatedAt: string | null;
    href: Route;
  };
  mentor: {
    title: string | null;
    dateLabel: string | null;
    href: Route;
  };
};

const cardMotion = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -6, scale: 1.01 },
};

function ProgressTrack({ value, srLabel }: { value: number; srLabel: string }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-blush-200/70" aria-hidden>
        <span
          className="block h-full rounded-full bg-mauve-500 transition-all duration-500 ease-bloom"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <span className="sr-only">{srLabel}</span>
    </div>
  );
}

function formatDateLabel(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function QuickAccessCards({
  academy,
  registry,
  reflection,
  mentor,
}: QuickAccessCardsProps) {
  const registryPercent =
    registry.goalCount > 0 ? Math.min(100, Math.round((registry.itemsAdded / registry.goalCount) * 100)) : 0;
  const mentorDate = formatDateLabel(mentor.dateLabel);

  return (
    <section aria-label="Quick access" className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-[var(--font-playfair)] text-2xl text-charcoal-700">Quick access</h2>
        <span className="text-xs uppercase tracking-[0.32em] text-charcoal-300 md:hidden">Swipe →</span>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:snap-none md:overflow-visible xl:grid-cols-4">
        <motion.article
          {...cardMotion}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="group flex min-w-[220px] max-w-[240px] snap-center flex-col gap-3 rounded-2xl border border-mauve-200/60 bg-gradient-to-br from-ivory via-white to-blush-100 p-4 text-charcoal-600 shadow-mauve-card transition hover:-translate-y-1 hover:shadow-blush-soft md:min-w-0 md:max-w-none"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl" aria-hidden>
              🍼
            </span>
            <span className="dashboard-pill border-mauve-500/20 bg-white/70 text-[0.55rem] text-mauve-600 shadow-none">
              Academy
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-charcoal-700">Continue learning</h3>
            <p className="text-sm leading-snug text-charcoal-500 line-clamp-2">
              {academy.nextTitle
                ? `Up next: ${academy.nextTitle}`
                : "Revisit any chapter whenever you crave a refresher."}
            </p>
          </div>
          <div className="space-y-1.5">
            <ProgressTrack value={academy.percentComplete} srLabel={`${academy.percentComplete}% complete`} />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-300">
              {academy.percentComplete}% complete
            </span>
          </div>
          <Link
            href={academy.href}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-mauve-500/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:bg-mauve-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
          >
            Continue
          </Link>
        </motion.article>

        <motion.article
          {...cardMotion}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="group flex min-w-[220px] max-w-[240px] snap-center flex-col gap-3 rounded-2xl border border-mauve-200/60 bg-white/95 p-4 text-charcoal-600 shadow-mauve-card transition hover:-translate-y-1 hover:shadow-blush-soft md:min-w-0 md:max-w-none"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 text-xl" aria-hidden>
              🎯
            </span>
            <span className="dashboard-pill border-mauve-500/20 bg-white/80 text-[0.55rem] text-mauve-600 shadow-none">
              Registry
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-charcoal-700">My registry plan</h3>
            <p className="text-sm leading-snug text-charcoal-500 line-clamp-2">
              {registry.itemsAdded} pieces added · {Math.max(registry.goalCount - registry.itemsAdded, 0)} to go.
            </p>
          </div>
          <div className="space-y-1.5">
            <ProgressTrack value={registryPercent} srLabel={`${registryPercent}% curated`} />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-300">
              {registryPercent}% curated
            </span>
          </div>
          <Link
            href={registry.href}
            className="mt-1 inline-flex items-center justify-center rounded-full border border-mauve-500/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-600 transition hover:border-mauve-500 hover:text-mauve-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
          >
            Open registry
          </Link>
        </motion.article>

        <motion.article
          {...cardMotion}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="group flex min-w-[220px] max-w-[240px] snap-center flex-col gap-3 rounded-2xl border border-mauve-200/60 bg-ivory p-4 text-charcoal-600 shadow-mauve-card transition hover:-translate-y-1 hover:shadow-blush-soft md:min-w-0 md:max-w-none"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl" aria-hidden>
              🫶
            </span>
            <span className="dashboard-pill border-mauve-500/30 bg-white/70 text-[0.55rem] text-mauve-600 shadow-none">
              Reflection
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-charcoal-700">Reflection journal</h3>
            <p className="text-sm leading-snug text-charcoal-500 line-clamp-2">
              {reflection.excerpt ?? "Capture what felt tender, hilarious, or human today."}
            </p>
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-charcoal-300">
            {reflection.updatedAt ? `Updated ${formatDateLabel(reflection.updatedAt)}` : "Start a new entry"}
          </p>
          <Link
            href={reflection.href}
            className="mt-1 inline-flex items-center justify-center rounded-full border border-mauve-500/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-600 transition hover:border-mauve-500 hover:text-mauve-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
          >
            Open journal
          </Link>
        </motion.article>

        <motion.article
          {...cardMotion}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group flex min-w-[220px] max-w-[240px] snap-center flex-col gap-3 rounded-2xl border border-mauve-200/60 bg-gradient-to-br from-white to-blush-100 p-4 text-charcoal-600 shadow-mauve-card transition hover:-translate-y-1 hover:shadow-blush-soft md:min-w-0 md:max-w-none"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-xl" aria-hidden>
              🎓
            </span>
            <span className="dashboard-pill border-mauve-500/30 bg-white/70 text-[0.55rem] text-mauve-600 shadow-none">
              Mentor
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-charcoal-700">Mentor moments</h3>
            <p className="text-sm leading-snug text-charcoal-500 line-clamp-2">
              {mentor.title ?? "We’ll post your mentor’s next session soon."}
            </p>
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-charcoal-300">
            {mentorDate ?? "Awaiting next session"}
          </p>
          <Link
            href={mentor.href}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-mauve-500/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:bg-mauve-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
          >
            View details
          </Link>
        </motion.article>
      </div>
    </section>
  );
}
