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
    <section className="overflow-hidden rounded-[3rem] border border-[#E8E3E1] bg-[#FFFAF8] px-8 py-10 shadow-[0_32px_80px_rgba(200,161,180,0.18)] md:px-14 md:py-14">
      <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-[#F2D6DF] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]">
            Taylor-Made Baby Academy
          </span>
          <div className="space-y-4">
            <h1 className="font-serif text-4xl leading-tight text-[#3E2F35] md:text-[3rem]">
              Welcome to your guided studio for calm preparation
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#3E2F35]/80">
              Explore {total} concierge-crafted modules that blend editorial storytelling, registry prompts, and workbook
              reflections. Each journey—Nursery, Gear, Postpartum—syncs with mentor notes and dynamic progress inside your
              dashboard.
            </p>
          </div>
          {journeys.length ? (
            <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]/60">
              {journeys.map((journey) => (
                <span
                  key={journey}
                  className="inline-flex rounded-full bg-white px-3 py-1 text-[#3E2F35] shadow-[0_10px_24px_rgba(200,161,180,0.14)]"
                >
                  {journey}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
            <span>{completed} modules celebrated</span>
            <span>•</span>
            <span>{total - completed} chapters ready</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 rounded-[2.5rem] border border-[#EED6D3] bg-white/90 px-8 py-8 text-center shadow-[0_24px_50px_rgba(200,161,180,0.18)]">
          <ProgressRing
            value={overallPercent}
            size={140}
            progressColor="#C8A1B4"
            trackColor="#E8E3E1"
            ariaLabel="Overall academy progress"
          >
            <div className="flex flex-col items-center text-[#3E2F35]">
              <span className="font-serif text-3xl leading-none">{overallPercent}%</span>
              <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">
                Complete
              </span>
            </div>
          </ProgressRing>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#3E2F35]">
              {completed} of {total} modules complete
            </p>
            <p className="text-xs leading-relaxed text-[#3E2F35]/70">
              Workbook reflections, registry focus, and mentor celebrations update the moment you explore a chapter.
            </p>
          </div>
          <Link
            href="/dashboard/academy/workbook"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] shadow-[0_18px_40px_rgba(200,161,180,0.22)] transition hover:-translate-y-0.5 hover:bg-[#C29AAD] hover:text-white"
          >
            Open Workbook
          </Link>
        </div>
      </div>
    </section>
  );
}
