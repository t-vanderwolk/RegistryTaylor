"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProgressRing from "@/components/ui/ProgressRing";
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
  const { progress } = useAcademyProgress();
  const progressState = progress[module.slug] ?? module.progress ?? DEFAULT_PROGRESS;
  const { label, status } = describeProgress(progressState);
  const percent = progressState.percentComplete ?? 0;

  const badgeLabel = module.category ?? module.journey ?? "Academy";
  const backgroundColor = module.accentPalette?.background ?? "#FAF9F7";
  const borderColor = module.accentPalette?.border ?? "#E8E3E1";
  const textColor = module.accentPalette?.text ?? "#3E2F35";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: isActive ? 1.0 : 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col justify-between rounded-2xl p-6 shadow-[0_22px_45px_rgba(62,47,53,0.08)] md:p-8"
      style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
      }}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-[#EAD7DC] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
            {badgeLabel}
          </span>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl leading-tight text-[#3E2F35] md:text-[1.75rem]">{module.title}</h2>
            {module.tagline ? (
              <p className="font-script text-xl leading-snug text-[#D6C1C7]">{module.tagline}</p>
            ) : module.subtitle ? (
              <p className="text-sm leading-relaxed text-[#3E2F35]/80">{module.subtitle}</p>
            ) : module.summary ? (
              <p className="text-sm leading-relaxed text-[#3E2F35]/80">{module.summary}</p>
            ) : null}
          </div>
        </div>
        <ProgressRing
          value={percent}
          trackColor="#E8E3E1"
          progressColor={module.accentColor ?? "#D6C1C7"}
          className="shadow-inner"
          ariaLabel={`${module.title} progress`}
        >
          <span className="text-[0.75rem] font-semibold text-[#3E2F35]">{percent}%</span>
        </ProgressRing>
      </header>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#3E2F35]/80">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-[#E8E3E1] bg-white/60 px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/70">Focus</p>
            <p className="mt-1 text-sm text-[#3E2F35]">
              {module.registryFocus ?? "Taylor-Made Academy"}
            </p>
          </div>
          <div className="rounded-xl border border-[#E8E3E1] bg-white/60 px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/70">Estimated time</p>
            <p className="mt-1 text-sm text-[#3E2F35]">
              {module.estimatedMinutes ? `${module.estimatedMinutes} minutes` : "Self-paced"}
            </p>
          </div>
        </div>

        <p className="rounded-xl bg-white/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9B8C91]">
          {label}
        </p>
      </div>

      <Link
        href={`/academy/${module.slug}`}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#3E2F35] px-6 py-3 text-sm font-semibold tracking-[0.2em] text-[#FAF9F7] transition hover:-translate-y-0.5 hover:bg-[#2C1F24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6C1C7]"
      >
        {status}
      </Link>
    </motion.article>
  );
}
