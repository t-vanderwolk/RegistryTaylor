import Link from "next/link";
import ProgressRing from "@/components/ui/ProgressRing";
import type { AcademyModule } from "@/types/academy";

type AcademyHeaderProps = {
  modules: AcademyModule[];
};

function summarizeModules(modules: AcademyModule[]) {
  const total = modules.length;
  const percentSum = modules.reduce((acc, module) => acc + (module.progress?.percentComplete ?? 0), 0);
  const completed = modules.filter((module) => module.progress?.completed).length;
  const journeys = Array.from(
    new Set(
      modules
        .map((module) => module.journey ?? module.category ?? null)
        .filter((journey): journey is string => Boolean(journey))
    )
  );
  const overallPercent = total ? Math.round(percentSum / total) : 0;

  return { total, completed, journeys, overallPercent };
}

export default function AcademyHeader({ modules }: AcademyHeaderProps) {
  const { total, completed, journeys, overallPercent } = summarizeModules(modules);

  return (
    <section className="relative overflow-hidden rounded-academy-xl border border-blush-300/70 bg-ivory px-8 py-12 shadow-blush-lift md:px-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-academy-card opacity-80" aria-hidden />
      <div className="relative grid gap-12 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <span className="academy-pill bg-blush-200/70 text-charcoal-500">
            Taylor-Made Baby Academy
          </span>
          <div className="space-y-5">
            <h1 className="font-serif text-4xl text-charcoal-700 md:text-[3rem]">
              Welcome to your guided studio
            </h1>
            <h2 className="font-serif text-[1.95rem] leading-tight text-mauve-500 md:text-[2.4rem]">
              Calm, tactile lessons curated for your Taylor-Made journey
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-charcoal-500">
              Explore {total} concierge-crafted modules weaving storytelling, registry prompts, and workbook reflections.
              Each journey—Nursery, Gear, Postpartum—syncs with mentor notes and your concierge team in real time.
            </p>
          </div>
          {journeys.length ? (
            <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-charcoal-300">
              {journeys.map((journey) => (
                <span key={journey} className="academy-pill border-transparent bg-white/70 shadow-blush-soft">
                  {journey}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.32em] text-charcoal-300">
            <span>{completed} modules celebrated</span>
            <span aria-hidden>•</span>
            <span>{total - completed} chapters ready</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 rounded-academy border border-blush-300/70 bg-white/90 px-8 py-8 text-center shadow-mauve-card backdrop-blur">
          <ProgressRing
            value={overallPercent}
            size={140}
            progressColor="#C8A1B4"
            trackColor="#E8E3E1"
            ariaLabel="Overall academy progress"
          >
            <div className="flex flex-col items-center text-charcoal-500">
              <span className="font-serif text-3xl leading-none">{overallPercent}%</span>
              <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-charcoal-300">
                complete
              </span>
            </div>
          </ProgressRing>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-charcoal-500">
              {completed} of {total} modules complete
            </p>
            <p className="text-xs leading-relaxed text-charcoal-300">
              Workbook reflections, registry focus, and mentor celebrations update the moment you explore a chapter.
            </p>
          </div>
          <Link
            href="/dashboard/member/journal"
            className="academy-button gap-2"
          >
            Open Workbook
          </Link>
        </div>
      </div>
    </section>
  );
}
