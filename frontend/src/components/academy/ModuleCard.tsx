"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import type { AcademyModule, ModuleProgress } from "@/types/academy";

type ModuleCardProps = {
  module: AcademyModule;
  isActive?: boolean;
};

const DEFAULT_PROGRESS: ModuleProgress = { percentComplete: 0, completed: false };

function describeProgress(progress: ModuleProgress | undefined): { label: string; status: string } {
  const percent = progress?.percentComplete ?? 0;
  if (progress?.completed || percent >= 100) {
    return { label: "Completed", status: "Review Module" };
  }
  if (percent > 0) {
    return { label: "In Progress", status: "Resume Module" };
  }
  return { label: "New Module", status: "Start Module" };
}

export default function ModuleCard({ module, isActive = false }: ModuleCardProps) {
  const { progress, getMilestone } = useAcademyProgress();
  const progressState = progress[module.slug] ?? module.progress ?? DEFAULT_PROGRESS;
  const { label, status } = describeProgress(progressState);
  const percent = progressState.percentComplete ?? 0;
  const { index, total } = getMilestone(module.slug);
  const safeTotal = Math.max(total, 1);
  const milestoneLabel = `Milestone ${Math.min(index + 1, safeTotal)} of ${safeTotal}`;

  const badgeLabel = module.category ?? module.journey ?? "Academy";
  const borderColor = module.accentPalette?.border ?? "#EED6D3";
  const textColor = module.accentPalette?.text ?? "#3E2F35";
  const heroImage = module.heroImage;
  const heroAlt = module.subtitle ?? module.summary ?? module.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: isActive ? 1.0 : 1 }}
      whileHover={{ translateY: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group flex h-full flex-col justify-between gap-6 overflow-hidden rounded-academy-xl border border-blush-300/60 bg-ivory/95 p-6 shadow-mauve-card md:p-7"
      style={{ color: textColor, borderColor }}
    >
      <div className="space-y-6">
        {heroImage ? (
          <div className="relative overflow-hidden rounded-academy border border-blush-300/70 bg-academy-card">
            <Image
              src={heroImage}
              alt={heroAlt}
              width={640}
              height={360}
              className="h-36 w-full object-cover transition duration-200 ease-bloom group-hover:scale-[1.02]"
              priority={isActive}
            />
            <span className="academy-pill absolute left-4 top-4 border-transparent bg-white/80 text-charcoal-500 shadow-blush-soft">
              {badgeLabel}
            </span>
          </div>
        ) : null}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl leading-tight text-charcoal-700 md:text-[1.75rem]">{module.title}</h2>
              {module.tagline ? (
                <p className="text-base italic text-mauve-500">{module.tagline}</p>
              ) : module.subtitle ? (
                <p className="text-sm leading-relaxed text-charcoal-500">{module.subtitle}</p>
              ) : module.summary ? (
                <p className="text-sm leading-relaxed text-charcoal-500">{module.summary}</p>
              ) : null}
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border border-blush-300/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-charcoal-400">
            {milestoneLabel}
          </span>
        </header>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-charcoal-500">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-300">Focus</p>
          <p className="mt-1 text-base text-charcoal-600">{module.registryFocus ?? "Taylor-Made Academy"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal-300">Estimated time</p>
          <p className="mt-1 text-base text-charcoal-600">
            {module.estimatedMinutes ? `${module.estimatedMinutes} minutes` : "Self-paced"}
          </p>
        </div>
        {module.summary ? (
          <p className="text-sm leading-relaxed text-charcoal-400">{module.summary}</p>
        ) : null}
        <div>
          <div className="h-1 w-full rounded-full bg-blush-200/60">
            <motion.div
              className="h-full rounded-full bg-mauve-500"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em]">
            <span className="text-charcoal-300">{label}</span>
            <span className="text-charcoal-300">{percent}%</span>
          </div>
        </div>
      </div>

      <Link
        href={`/dashboard/member/learn/${module.slug}` as Route}
        className="academy-button mt-2 justify-center gap-2"
      >
        {status}
      </Link>
    </motion.article>
  );
}
