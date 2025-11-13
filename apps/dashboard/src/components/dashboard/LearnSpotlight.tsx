"use client";

import Link from "next/link";
import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";

type LearnSpotlightProps = {
  modules: AcademyModule[];
};

export default function LearnSpotlight({ modules }: LearnSpotlightProps) {
  const hasModules = modules.length > 0;
  const featuredModules = hasModules ? modules.slice(0, 3) : modules;

  return (
    <section className="space-y-4 rounded-[1.75rem] border border-[#EAD6DE] bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.14)]">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]">Learn spotlight</p>
          <h2 className="text-xl font-semibold tracking-tight text-[#3E2F35]">
            Fresh chapters
          </h2>
        </div>
        <Link
          href={"/dashboard/member/learn/welcome" as Route}
          className="text-xs font-semibold uppercase tracking-[0.32em] text-mauve-500"
        >
          View all →
        </Link>
      </header>

      {hasModules ? (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {featuredModules.map((module) => {
            const journey = module.journey ?? module.category ?? "Module";
            const progress = module.progress?.percentComplete ?? 0;
            const status = progress >= 100 ? "Complete" : progress > 0 ? `${progress}%` : "New";
            return (
              <Link
                key={module.id ?? module.slug}
                href={`/dashboard/member/learn/${module.slug}` as Route}
                className="min-w-[280px] max-w-[320px] snap-center rounded-[1.5rem] border border-[#EAD6DE] bg-[#FFFAF8] p-4 shadow-mauve-card"
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-[#C8A1B4]">
                  {journey}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-[#3E2F35] line-clamp-2">
                  {module.title}
                </h3>
                {module.subtitle ? (
                  <p className="mt-1 text-sm leading-snug text-[#3E2F35]/70 line-clamp-2">{module.subtitle}</p>
                ) : null}
                <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                  <span>{status}</span>
                  <span>Open →</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-[#EAD6DE] bg-[#FFFAF8] px-5 py-6 text-sm text-[#3E2F35]/70">
          We’ll drop your first modules here as soon as your concierge cues them up.
        </div>
      )}
    </section>
  );
}
