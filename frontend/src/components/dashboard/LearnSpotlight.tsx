"use client";

import type { Route } from "next";
import Link from "next/link";
import type { AcademyModule } from "@/types/academy";
import { MEMBER_DASHBOARD_ROUTES } from "@/constants/memberDashboardRoutes";

type LearnSpotlightProps = {
  modules: AcademyModule[];
};

export default function LearnSpotlight({ modules }: LearnSpotlightProps) {
  const hasModules = modules.length > 0;
  const featuredModules = hasModules ? modules.slice(0, 3) : modules;

  return (
    <section className="space-y-4 rounded-2xl border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card md:rounded-[2rem] md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">Learn spotlight</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-charcoal-700">Fresh chapters</h2>
        </div>
        <Link
          href={MEMBER_DASHBOARD_ROUTES.learnWelcome as Route}
          className="rounded-full border border-mauve-500/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-charcoal-600 transition hover:border-mauve-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
        >
          View all modules
        </Link>
      </header>

      {hasModules ? (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
          {featuredModules.map((module) => {
            const journey = module.journey ?? module.category ?? "Module";
            const progress = module.progress?.percentComplete ?? 0;
            const status = progress >= 100 ? "Complete" : progress > 0 ? `${progress}%` : "New";
            return (
              <Link
                key={module.id ?? module.slug}
                href={`/dashboard/member/learn/${module.slug}`}
                className="group relative min-w-[240px] max-w-[260px] snap-center overflow-hidden rounded-[1.75rem] border border-mauve-200/60 bg-gradient-to-br from-ivory via-white to-blush-100 p-5 shadow-mauve-card transition hover:-translate-y-1 hover:shadow-blush-soft before:absolute before:inset-0 before:rounded-[1.75rem] before:bg-white/20 before:opacity-0 before:transition before:duration-300 before:content-[''] active:scale-[0.98] active:before:opacity-100 md:min-w-0 md:max-w-none"
              >
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-mauve-500">
                  {journey}
                </p>
                <h3 className="mt-2 font-[var(--font-playfair)] text-xl text-charcoal-700 line-clamp-2">
                  {module.title}
                </h3>
                {module.subtitle ? (
                  <p className="mt-1 text-sm leading-snug text-charcoal-500 line-clamp-2">{module.subtitle}</p>
                ) : null}

                <div className="mt-4 flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-mauve-500">
                  <span>{status}</span>
                  <span className="inline-flex items-center gap-1">
                    Open <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-mauve-200/60 bg-ivory px-5 py-6 text-sm text-charcoal-500">
          We’ll drop your first modules here as soon as your concierge cues them up.
        </div>
      )}
    </section>
  );
}
