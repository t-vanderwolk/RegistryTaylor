import ProgressBar from "@/components/academy/ProgressBar";
import AcademyCarousel from "@/components/academy/AcademyCarousel";
import { getAcademyModules, getModuleProgress } from "@/lib/academy";

export const metadata = {
  title: "Taylor-Made Baby Academy",
  description: "Curated learning journeys that unlock bespoke registry support and mentor insights.",
};

export default async function AcademyPage() {
  const modules = await getAcademyModules();
  const progressEntries = await Promise.all(
    modules.map(async (module) => {
      const progress = await getModuleProgress(module.slug);
      return [module.slug, progress] as const;
    })
  );

  const progressMap = Object.fromEntries(progressEntries);
  const completedCount = progressEntries.filter(([, progress]) => progress.completed).length;
  const percentOverall = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Taylor-Made Academy</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Learn, reflect, and unlock bespoke registry magic
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-[#3E2F35]/70">
          Every module combines design-forward learning with concierge-level action plans. Complete lessons to reveal new
          registry picks, journal prompts, and mentor recommendations tailored to your family.
        </p>
        <div className="mt-6">
          <ProgressBar percent={percentOverall} label="Overall Progress" />
        </div>
      </section>

      <section className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/90">Explore Modules</p>
          <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
            From nursery serenity to confident adventures
          </h2>
        </header>
        <AcademyCarousel modules={modules} progressMap={progressMap} />
      </section>

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">How it works</h3>
        <ol className="mt-4 space-y-3 text-sm text-[#3E2F35]/75">
          <li>
            <span className="font-semibold text-[#C8A1B4]">1. Learn:</span> Watch or read the module content at your pace—
            each lesson is optimized for calm evenings or nap-time moments.
          </li>
          <li>
            <span className="font-semibold text-[#C8A1B4]">2. Reflect:</span> Journal prompts and checklists capture your
            preferences and keep mentor conversations meaningful.
          </li>
          <li>
            <span className="font-semibold text-[#C8A1B4]">3. Unlock:</span> Marking complete reveals new registry items,
            concierge tasks, and community salons crafted for where you are in the journey.
          </li>
        </ol>
      </section>
    </div>
  );
}
