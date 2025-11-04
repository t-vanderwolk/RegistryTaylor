import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModules } from "@/lib/academy";
import { AcademyProgressProvider } from "@/components/academy/ProgressContext";
import AcademyCarousel from "@/components/academy/AcademyCarousel";
import ProgressRing from "@/components/ui/ProgressRing";
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

  const overallPercent = modules.length
    ? Math.round(
        modules.reduce((total, module) => total + (module.progress?.percentComplete ?? 0), 0) / modules.length
      )
    : 0;

  return (
    <AcademyProgressProvider initialProgress={progressMap}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-12 md:gap-20 md:px-10">
        <section className="grid gap-10 rounded-2xl border border-[#E8E3E1] bg-[#FAF9F7] p-6 shadow-[0_24px_55px_rgba(62,47,53,0.09)] md:grid-cols-[2fr_1fr] md:p-10">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9B8C91]">Taylor-Made Academy</p>
            <h1 className="font-serif text-4xl leading-tight text-[#3E2F35] md:text-[2.75rem]">
              Stories and strategies for calm, confident parenting
            </h1>
            <p className="text-base leading-relaxed text-[#3E2F35]/80">
              Each module welcomes you like a page from an heirloom magazine—inviting you to learn, reflect, and take heart-led
              action. Show up as you are; savor the textures, the insight, and the gentle pace designed for busy caregivers.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#E8E3E1] bg-white/70 px-5 py-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Concierge guidance</p>
                <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/85">
                  Unlock curated registry picks, mentor prompts, and tangible rituals as you move through each story-driven
                  lesson.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E8E3E1] bg-white/70 px-5 py-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Responsive pacing</p>
                <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/85">
                  Your progress syncs in real time—move gently, pick up where you left off, and mark moments complete when they
                  feel truly integrated.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#E8E3E1] bg-white/70 p-6">
            <ProgressRing value={overallPercent} size={120} strokeWidth={8}>
              <div className="flex flex-col items-center text-[#3E2F35]">
                <span className="text-lg font-semibold">{overallPercent}%</span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#9B8C91]">
                  Complete
                </span>
              </div>
            </ProgressRing>
            <p className="text-center text-sm leading-relaxed text-[#3E2F35]/80">
              You’re composing a bespoke parenting guide. Complete modules to unlock new mentor notes, registry spotlights, and
              seasonal rituals.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <header className="space-y-3 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9B8C91]">Explore the curriculum</p>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl text-[#3E2F35]">Drift through modules like curated magazine spreads</h2>
              <p className="text-base leading-relaxed text-[#3E2F35]/75">
                Swipe or tap through each story. Each chapter blends narrative, practical application, and Taylor’s concierge
                insights to keep you supported.
              </p>
            </div>
          </header>

          <AcademyCarousel modules={modules} />
        </section>

        <section className="grid gap-6 rounded-2xl border border-[#E8E3E1] bg-white p-6 shadow-[0_24px_55px_rgba(62,47,53,0.06)] md:grid-cols-3 md:p-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">How it flows</p>
            <h3 className="font-serif text-2xl text-[#3E2F35]">From inspiration to lived experience</h3>
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-[#3E2F35]/80">
            <p className="font-semibold text-[#3E2F35]">1 · Learn</p>
            <p>Absorb the editorial lecture that sets the tone—rich paragraphs, gallery imagery, and sensory prompts.</p>
          </div>
          <div className="space-y-2 text-sm leading-relaxed text-[#3E2F35]/80">
            <p className="font-semibold text-[#3E2F35]">2 · Apply & Reflect</p>
            <p>
              Work through gentle action steps and journal cues, then mark complete to sync concierge recommendations across your
              plan and registry.
            </p>
          </div>
        </section>
      </div>
    </AcademyProgressProvider>
  );
}
