import Link from "next/link";
import ProgressBar from "@/components/academy/ProgressBar";
import AcademyCarousel from "@/components/academy/AcademyCarousel";
import { getAcademyModules, getModuleProgress } from "@/lib/academy";

export default async function DashboardHome() {
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
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-[var(--font-great-vibes)] text-3xl text-[#C8A1B4]">Welcome back</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
              Your Taylor-Made journey continues
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
              Explore the academy, curate your registry, and stay connected with your mentor—all from one serene space.
            </p>
          </div>
          <ProgressBar percent={percentOverall} label="Academy Progress" />
        </div>
        <div className="mt-8 grid gap-4 text-sm text-[#3E2F35]/70 sm:grid-cols-3">
          <div className="rounded-[1.8rem] bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Modules Complete</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{completedCount}</p>
          </div>
          <div className="rounded-[1.8rem] bg-gradient-to-br from-[#FFFAF8] via-white to-[#D9C48E]/30 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Concierge Reminders</p>
            <p className="mt-2 text-sm">
              Review this week’s action items inside your journal tab for bespoke follow-ups from your mentor.
            </p>
          </div>
          <div className="rounded-[1.8rem] bg-gradient-to-br from-[#FFFAF8] via-white to-[#C8A1B4]/25 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Upcoming Support</p>
            <p className="mt-2 text-sm">
              Concierge office hours Tuesday at 11 AM.{" "}
              <Link href="/dashboard/concierge" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
                Confirm attendance →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/90">My Academy</p>
            <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Continue your learning journey</h2>
          </div>
          <Link
            href="/dashboard/academy"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E] hover:text-[#C8A1B4]"
          >
            View all modules
          </Link>
        </header>
        <AcademyCarousel modules={modules} progressMap={progressMap} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.65fr,0.35fr]">
        <div className="space-y-6 rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">My Registry</p>
            <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Taylor-curated essentials</h3>
          </header>
          <p className="text-sm text-[#3E2F35]/70">
            Unlock personalized recommendations as you complete modules. When inspiration strikes, add your own finds to
            keep everything organized for gifting and fulfillment.
          </p>
          <Link
            href="/dashboard/registry"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-5 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
          >
            Open Plan
          </Link>
        </div>
        <div className="space-y-6 rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Community & Journal</p>
            <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Stay connected</h3>
          </header>
          <ul className="space-y-3 text-sm text-[#3E2F35]/70">
            <li>✨ Join this week’s mentor salon in the Community tab.</li>
            <li>📝 Capture reflections in your Journal after each module.</li>
            <li>🤍 Concierge is ready for bespoke support whenever you need it.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/community"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Community
            </Link>
            <Link
              href="/dashboard/journal"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Journal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
