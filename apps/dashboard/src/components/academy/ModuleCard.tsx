"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
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
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col justify-between rounded-3xl border bg-[#F8F6F3] p-6 md:p-7"
      style={{ borderColor, color: textColor }}
    >
      <div className="space-y-6">
        {heroImage ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-[#EED6D3] bg-white/80">
            <Image
              src={heroImage}
              alt={heroAlt}
              width={640}
              height={360}
              className="h-36 w-full object-cover"
              priority={isActive}
            />
          </div>
        ) : null}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#EED6D3] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
              {badgeLabel}
            </span>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl leading-tight text-[#3E2F35] md:text-[1.75rem]">{module.title}</h2>
              {module.tagline ? (
                <p className="font-script text-xl leading-snug text-[#C8A6B6]">{module.tagline}</p>
              ) : module.subtitle ? (
                <p className="text-sm leading-relaxed text-[#3E2F35]/80">{module.subtitle}</p>
              ) : module.summary ? (
                <p className="text-sm leading-relaxed text-[#3E2F35]/80">{module.summary}</p>
              ) : null}
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#EED6D3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]">
            {milestoneLabel}
          </span>
        </header>
      </div>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#3E2F35]/85">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Focus</p>
          <p className="mt-1 text-base text-[#3E2F35]">{module.registryFocus ?? "Taylor-Made Academy"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Estimated time</p>
          <p className="mt-1 text-base text-[#3E2F35]">
            {module.estimatedMinutes ? `${module.estimatedMinutes} minutes` : "Self-paced"}
          </p>
        </div>
        {module.summary ? (
          <p className="text-sm leading-relaxed text-[#3E2F35]/75">{module.summary}</p>
        ) : null}
        <div>
          <div className="h-1 w-full rounded-full bg-[#EED6D3]/70">
            <motion.div
              className="h-full rounded-full bg-[#C8A6B6]"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em]">
            <span className="text-[#3E2F35]/60">{label}</span>
            <span className="text-[#3E2F35]/50">{percent}%</span>
          </div>
        </div>
      </div>

      <Link
        href={`/dashboard/learn/${module.slug}`}
        className="mt-8 inline-flex items-center justify-center rounded-full border border-[#C8A6B6] bg-[#EED6D3] px-6 py-3 text-sm font-semibold tracking-[0.2em] text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A6B6]"
      >
        {status}
      </Link>
    </motion.article>
  );
}
