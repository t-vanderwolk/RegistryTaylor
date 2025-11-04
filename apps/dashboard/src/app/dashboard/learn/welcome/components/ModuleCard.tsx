'use client';

import Image from "next/image";
import Link from "next/link";
import ProgressRing from "@/components/ui/ProgressRing";
import type { AcademyModule } from "@/types/academy";

type ModuleCardProps = {
  module: AcademyModule;
};

function describeProgress(module: AcademyModule) {
  const progress = module.progress;
  const percent = progress?.percentComplete ?? 0;

  if (progress?.completed || percent >= 100) {
    return { label: "Lesson celebrated", status: "Review", percent: 100 };
  }

  if (percent > 0) {
    return { label: "In progress", status: "Resume", percent };
  }

  return { label: "New chapter", status: "Begin", percent: 0 };
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const journey = module.journey ?? module.category ?? "Academy";
  const { label, status, percent } = describeProgress(module);
  const accentColor = module.accentColor ?? "#C8A1B4";
  const heroImage = module.heroImage ?? "/images/academy/nursery-vision.jpg";
  const registryFocus = module.registryFocus ?? "Taylor-Made Focus";

  return (
    <article className="flex h-full flex-col justify-between rounded-[2.5rem] border border-[#EED6D3]/60 bg-white/95 p-6 shadow-[0_16px_45px_rgba(200,161,180,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(200,161,180,0.25)]">
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[2rem] border border-[#EED6D3]/70 bg-white/70">
          <Image
            src={heroImage}
            alt={module.title}
            width={640}
            height={360}
            className="h-40 w-full object-cover"
          />
        </div>
        <header className="space-y-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em]"
            style={{ backgroundColor: `${accentColor}1A`, color: "#3E2F35" }}
          >
            {journey}
          </span>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl leading-tight text-[#3E2F35]">{module.title}</h3>
            {module.subtitle ? (
              <p className="text-sm text-[#3E2F35]/75">{module.subtitle}</p>
            ) : null}
          </div>
        </header>
        <div className="grid gap-4 rounded-2xl border border-[#EED6D3]/60 bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]/80">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">Focus</p>
              <p>{registryFocus}</p>
            </div>
            <div className="flex items-center gap-3">
              <ProgressRing value={percent} size={60} progressColor={accentColor} trackColor="#EED6D3">
                <span className="text-xs font-semibold text-[#3E2F35]">{percent}%</span>
              </ProgressRing>
              <div className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">{label}</div>
            </div>
          </div>
          {module.estimatedMinutes ? (
            <div className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
              ⏱ {module.estimatedMinutes} minutes
            </div>
          ) : null}
        </div>
      </div>

      <Link
        href={`/dashboard/learn/${module.slug}`}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] bg-[#C8A1B4]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#C8A1B4] hover:text-white"
      >
        {status} Module →
      </Link>
    </article>
  );
}
