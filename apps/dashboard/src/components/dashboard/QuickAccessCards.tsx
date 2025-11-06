"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type QuickAccessCardsProps = {
  academy: {
    percentComplete: number;
    nextTitle: string | null;
    href: string;
  };
  registry: {
    itemsAdded: number;
    goalCount: number;
    href: string;
  };
  reflection: {
    excerpt: string | null;
    updatedAt: string | null;
    href: string;
  };
  mentor: {
    title: string | null;
    dateLabel: string | null;
    href: string;
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
    <section aria-label="Quick access" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <motion.article
        {...cardMotion}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="group flex flex-col gap-4 rounded-2xl border border-blush-300/60 bg-ivory/90 p-6 shadow-mauve-card backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg">🍼</span>
          <span className="dashboard-pill border-mauve-500/20 bg-white/70 text-[0.6rem] shadow-none">
            Academy
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-charcoal-700">Continue Learning</h3>
          <p className="text-sm leading-relaxed text-charcoal-400">
            {academy.nextTitle
              ? `Up next: ${academy.nextTitle}`
              : "Every chapter celebrated — revisit your favorites anytime."}
          </p>
        </div>
        <div className="space-y-2">
          <ProgressTrack value={academy.percentComplete} srLabel={`${academy.percentComplete}% complete`} />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">
            {academy.percentComplete}% complete
          </span>
        </div>
        <Link
          href={academy.href}
          className="academy-button justify-center gap-2 bg-mauve-500/90 text-white"
        >
          Continue
        </Link>
      </motion.article>

      <motion.article
        {...cardMotion}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group flex flex-col gap-4 rounded-2xl border border-blush-300/60 bg-white/85 p-6 shadow-blush-soft backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg">🎯</span>
          <span className="dashboard-pill border-mauve-500/20 bg-white/80 text-[0.6rem] shadow-none">
            Registry
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-charcoal-700">My Registry Plan</h3>
          <p className="text-sm leading-relaxed text-charcoal-400">
            {registry.itemsAdded} items curated &middot; {Math.max(registry.goalCount - registry.itemsAdded, 0)} to go.
          </p>
        </div>
        <div className="space-y-2">
          <ProgressTrack value={registryPercent} srLabel={`${registryPercent}% curated`} />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">
            {registryPercent}% curated
          </span>
        </div>
        <Link
          href={registry.href}
          className="academy-outline-button justify-center gap-2"
        >
          Open Registry
        </Link>
      </motion.article>

      <motion.article
        {...cardMotion}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="group flex flex-col gap-4 rounded-2xl border border-blush-300/70 bg-ivory p-6 shadow-mauve-card"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg">🫶</span>
          <span className="dashboard-pill border-mauve-500/30 bg-white/70 text-[0.6rem] shadow-none">
            Reflection
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-charcoal-700">Reflection Journal</h3>
          <p className="text-sm leading-relaxed text-charcoal-400 line-clamp-3">
            {reflection.excerpt ?? "Capture a few lines about what felt tender, hilarious, or human today."}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal-300">
          {reflection.updatedAt ? `Updated ${formatDateLabel(reflection.updatedAt)}` : "Let’s start a new entry"}
        </p>
        <Link
          href={reflection.href}
          className="academy-outline-button justify-center gap-2"
        >
          Open Journal
        </Link>
      </motion.article>

      <motion.article
        {...cardMotion}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group flex flex-col gap-4 rounded-2xl border border-blush-300/70 bg-ivory p-6 shadow-mauve-card"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg">🎓</span>
          <span className="dashboard-pill border-mauve-500/30 bg-white/70 text-[0.6rem] shadow-none">
            Mentor
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-charcoal-700">Mentor Moments</h3>
          <p className="text-sm leading-relaxed text-charcoal-400">
            {mentor.title ?? "We’ll post your mentor’s next session soon."}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal-300">
          {mentorDate ?? "Awaiting next session"}
        </p>
        <Link
          href={mentor.href}
          className="academy-button justify-center gap-2 bg-mauve-500/90 text-white"
        >
          View details
        </Link>
      </motion.article>
    </section>
  );
}
