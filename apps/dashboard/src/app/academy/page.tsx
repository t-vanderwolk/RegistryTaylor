import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModules } from "@/lib/academy";
import { AcademyProgressProvider } from "@/components/academy/ProgressContext";
import ModuleCard from "@/components/academy/ModuleCard";
import type { ModuleProgress } from "@/types/academy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Taylor-Made Baby Academy",
  description:
    "Learn, apply, and be inspired with Taylor-Made Baby Academy. Every module blends editorial storytelling with concierge-level guidance.",
};

function buildProgressMap(modules: Awaited<ReturnType<typeof getAcademyModules>>): Record<string, ModuleProgress> {
  return modules.reduce<Record<string, ModuleProgress>>((acc, module) => {
    acc[module.slug] = module.progress ?? { percentComplete: 0, completed: false };
    return acc;
  }, {});
}

export default async function AcademyPage() {
  await requireMember();
  const modules = await getAcademyModules();
  const progressMap = buildProgressMap(modules);
  const moduleOrder = modules.map((module) => module.slug);

  const overallPercent = modules.length
    ? Math.round(
        modules.reduce((total, module) => total + (module.progress?.percentComplete ?? 0), 0) / modules.length
      )
    : 0;

  const completedCount = modules.filter((module) => (module.progress?.percentComplete ?? 0) >= 100).length;

  return (
    <AcademyProgressProvider initialProgress={progressMap} moduleOrder={moduleOrder}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-12 md:gap-20 md:px-10">
        <section className="space-y-6 rounded-3xl border border-[#C8A6B6] bg-[#F8F6F3] p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Taylor-Made Academy</p>
              <h1 className="font-serif text-4xl leading-tight text-[#3E2F35] md:text-[2.8rem]">
                Editorial lessons for every growing milestone
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-[#3E2F35]/80">
                Explore immersive stories, practical rituals, and gentle reflections written in Taylor’s concierge voice. Each
                module is a calm exhale—crafted to prepare you for the season you are stepping into.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-[#EED6D3] bg-white px-6 py-5">
              <span className="inline-flex items-center rounded-full bg-[#EED6D3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]">
                Studio Progress
              </span>
              <div className="w-full min-w-[220px]">
                <div className="h-1 w-full rounded-full bg-[#EED6D3]/70">
                  <div className="h-full rounded-full bg-[#C8A6B6]" style={{ width: `${overallPercent}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/60">
                  <span>{completedCount} completed</span>
                  <span>{overallPercent}% ready</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#3E2F35]/70">
                Pick up where you left off, or begin a fresh milestone. Your momentum stays synced to your dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Academy Collection</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">Choose the chapter that meets you today</h2>
            <p className="max-w-3xl text-base leading-relaxed text-[#3E2F35]/75">
              Every module pairs editorial guidance with tangible rituals. Browse the full library or follow Taylor’s suggested
              cadence to unlock seasonal insights.
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-[#EED6D3] bg-white p-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35]/60">Studio cadence</p>
            <h3 className="font-serif text-2xl text-[#3E2F35]">A guided rhythm for relaxed learning</h3>
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-[#3E2F35]/80">
            <span className="inline-flex items-center gap-2 font-semibold text-[#3E2F35]">
              <span className="text-[#C8A6B6]">①</span> Immerse
            </span>
            <p>Read or listen through the lecture. Notice the sensory cues and rituals suggested for your family.</p>
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-[#3E2F35]/80">
            <span className="inline-flex items-center gap-2 font-semibold text-[#3E2F35]">
              <span className="text-[#C8A6B6]">②</span> Reflect & Apply
            </span>
            <p>Capture reflections in your workbook, sync registry updates, and share takeaways with your mentor.</p>
          </div>
        </section>
      </div>
    </AcademyProgressProvider>
  );
}
