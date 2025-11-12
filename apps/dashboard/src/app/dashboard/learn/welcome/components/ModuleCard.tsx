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
    return { label: "Lesson celebrated", action: "Review Module", percent: 100 };
  }

  if (percent > 0) {
    return { label: "In progress", action: "Continue Learning", percent };
  }

  return { label: "New chapter", action: "Start Module", percent: 0 };
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const journey = module.journey ?? module.category ?? "Academy";
  const { label, action, percent } = describeProgress(module);
  const accentColor = module.accentColor ?? "#C8A1B4";
  const heroImage = module.heroImage ?? "/images/academy/nursery-vision.jpg";
  const registryFocus = module.registryFocus ?? "Taylor-Made Focus";

  return (
    <article className="group flex h-full flex-col justify-between gap-6 overflow-hidden rounded-academy-xl border border-blush-300/60 bg-ivory/95 p-6 shadow-mauve-card transition duration-200 ease-bloom hover:-translate-y-1 hover:shadow-blush-lift">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-academy border border-blush-300/60 bg-academy-card">
          <Image
            src={heroImage}
            alt={module.title}
            width={640}
            height={360}
            className="h-40 w-full object-cover transition duration-200 ease-bloom group-hover:scale-[1.02]"
          />
          <span className="academy-pill absolute left-4 top-4 border-transparent bg-white/80 text-charcoal-500 shadow-blush-soft">
            {journey}
          </span>
        </div>
        <header className="space-y-3">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl leading-tight text-charcoal-700">{module.title}</h3>
            {module.subtitle ? <p className="text-sm text-charcoal-500">{module.subtitle}</p> : null}
          </div>
        </header>
        <div className="grid gap-4 rounded-academy border border-blush-300/60 bg-white/80 p-4 text-sm text-charcoal-500">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">Focus</p>
              <p>{registryFocus}</p>
            </div>
            <div className="flex items-center gap-2">
              <ProgressRing value={percent} size={56} progressColor={accentColor} trackColor="#EED6D3">
                <span className="text-xs font-semibold text-charcoal-500">{percent}%</span>
              </ProgressRing>
              <div className="text-xs uppercase tracking-[0.28em] text-charcoal-300">{label}</div>
            </div>
          </div>
          {module.estimatedMinutes ? (
            <div className="text-xs uppercase tracking-[0.3em] text-charcoal-300">
              ⏱ {module.estimatedMinutes} minutes
            </div>
          ) : null}
        </div>
      </div>

      <Link
        href={`/dashboard/member/learn/${module.slug}`}
        className="academy-button mt-2 w-full justify-center gap-2"
      >
        {action} →
      </Link>
    </article>
  );
}
