"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type ProgressTrackerProps = {
  percent: number;
  label?: string;
  encouragement?: string;
};

function normalize(percent: number) {
  if (Number.isNaN(percent)) return 0;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export default function ProgressTracker({ percent, label, encouragement }: ProgressTrackerProps) {
  const value = useMemo(() => normalize(percent), [percent]);
  const headline = encouragement ?? `Progress: ${value}% complete`;

  return (
    <div className="space-y-3 rounded-academy border border-blush-300/60 bg-white/90 p-5 text-charcoal-500 shadow-blush-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-serif text-lg text-charcoal-700">{headline}</p>
        {label ? (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">
            {label}
          </span>
        ) : null}
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-blush-200/60" aria-hidden>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 26 }}
          className="absolute left-0 top-0 h-full rounded-full bg-mauve-500"
        />
      </div>
      <span className="text-xs uppercase tracking-[0.28em] text-charcoal-300" aria-live="polite">
        You’re doing beautifully 🌸
      </span>
    </div>
  );
}
