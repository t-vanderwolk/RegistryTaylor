"use client";

import Link from "next/link";
import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";
import ModuleCard from "@/app/dashboard/learn/welcome/components/ModuleCard";

type LearnSpotlightProps = {
  modules: AcademyModule[];
};

export default function LearnSpotlight({ modules }: LearnSpotlightProps) {
  const hasModules = modules.length > 0;
  const featuredModules = hasModules ? modules.slice(0, 3) : modules;

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-[0_24px_55px_rgba(200,161,180,0.14)] md:p-8">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]">Learn Spotlight</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35] md:text-[2.1rem]">
              Fresh chapters waiting for you
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/70">
              Nursery, Gear, and Postpartum journeys curated by concierge mentors. Pick up where you left off or explore
              something brand new.
            </p>
          </div>
          <Link
            href={"/dashboard/member/learn/welcome" as Route}
            className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            View all modules
          </Link>
        </div>
      </header>

      {hasModules ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredModules.map((module) => (
            <ModuleCard key={module.id ?? module.slug} module={module} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[#EAD6DE] bg-[#FFFAF8] px-6 py-10 text-center text-sm text-[#3E2F35]/70">
          We’ll drop your first modules here as soon as your concierge cues them up.
        </div>
      )}
    </section>
  );
}
