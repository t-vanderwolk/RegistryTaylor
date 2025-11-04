'use client';

import { useMemo, useState } from "react";
import ModuleCard from "./ModuleCard";
import type { AcademyModule } from "@/types/academy";

type ModuleCarouselProps = {
  modules: AcademyModule[];
};

type FilterOption = {
  id: string;
  label: string;
};

export default function ModuleCarousel({ modules }: ModuleCarouselProps) {
  const journeys = useMemo<FilterOption[]>(() => {
    const unique = Array.from(
      new Set(
        modules
          .map((module) => module.journey ?? module.category ?? null)
          .filter((journey): journey is string => Boolean(journey))
      )
    );

    return [{ id: "All", label: "All Journeys" }, ...unique.map((journey) => ({ id: journey, label: journey }))];
  }, [modules]);

  const [selectedJourney, setSelectedJourney] = useState<string>("All");

  const filteredModules = useMemo(() => {
    if (selectedJourney === "All") {
      return modules;
    }
    return modules.filter((module) => (module.journey ?? module.category) === selectedJourney);
  }, [modules, selectedJourney]);

  const totalModules = modules.length;

  return (
    <section className="space-y-8">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Explore the academy</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="font-serif text-3xl text-[#3E2F35] md:text-[2.5rem]">
            Choose the journey that meets you now
          </h2>
          <span className="text-sm uppercase tracking-[0.3em] text-[#3E2F35]/60">
            {filteredModules.length} of {totalModules} modules
          </span>
        </div>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75 md:mx-0">
          Switch between Nursery, Gear, and Postpartum to see curated modules, or keep it on All to browse the full
          cadence. Your mentor sees every reflection you capture along the way.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
        {journeys.map((journey) => {
          const active = selectedJourney === journey.id;
          return (
            <button
              key={journey.id}
              type="button"
              onClick={() => setSelectedJourney(journey.id)}
              className={[
                "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition",
                active
                  ? "border-[#C8A1B4] bg-[#C8A1B4] text-white shadow-[0_12px_35px_rgba(200,161,180,0.28)]"
                  : "border-[#EED6D3] bg-white text-[#3E2F35] hover:border-[#C8A1B4] hover:text-[#C8A1B4]",
              ].join(" ")}
            >
              {journey.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map((module) => (
          <ModuleCard key={module.slug} module={module} />
        ))}
      </div>
    </section>
  );
}
