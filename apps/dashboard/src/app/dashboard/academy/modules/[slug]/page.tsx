import ACADEMY_MODULES from "@/data/academyModules.json" assert { type: "json" };
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth";
import ModuleWorkbookPanel from "@/components/academy/ModuleWorkbookPanel";
import ProgressBar from "@/components/academy/ProgressBar";
import MarkCompleteButton from "@/components/academy/MarkCompleteButton";
import AddToRegistryButton from "@/components/academy/AddToRegistryButton";
import { getModuleProgress, markModuleComplete, addModuleToRegistry } from "@/lib/academy";
import { revalidatePath } from "next/cache";

export async function generateStaticParams() {
  return ACADEMY_MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const moduleEntry = ACADEMY_MODULES.find((m) => m.slug === params.slug);
  if (!moduleEntry) return { title: "Module not found" };
  return {
    title: `${moduleEntry.title} · Taylor-Made Baby Academy`,
    description: moduleEntry.subtitle || moduleEntry.content.explore.slice(0, 120),
  };
}

export default async function ModulePage({ params }: { params: { slug: string } }) {
  const user = await requireMember();
  const moduleEntry = ACADEMY_MODULES.find((m) => m.slug === params.slug);
  if (!moduleEntry) notFound();

  const progress = await getModuleProgress(moduleEntry.slug);

  const completeModule = async () => {
    "use server";
    await markModuleComplete(moduleEntry.slug);
    revalidatePath("/dashboard/learn");
    revalidatePath(`/dashboard/academy/modules/${moduleEntry.slug}`);
  };

  const addToRegistry = async () => {
    "use server";
    await addModuleToRegistry(moduleEntry.slug);
    revalidatePath("/dashboard/plan");
    revalidatePath("/dashboard/registry");
  };

  return (
    <article className="space-y-10">
      {/* --- HEADER --- */}
      <header
        className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${moduleEntry.accentColor ?? "#FFFAF8"} 0%, rgba(255,255,255,0.95) 60%)`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          {moduleEntry.journey} Journey · {moduleEntry.registryFocus}
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          {moduleEntry.title}
        </h1>
        {moduleEntry.subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-[#3E2F35]/70">{moduleEntry.subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <MarkCompleteButton action={completeModule} completed={progress.completed} />
          <AddToRegistryButton action={addToRegistry} />
        </div>

        <div className="mt-6 max-w-md">
          <ProgressBar percent={progress.percentComplete} label="Module Progress" />
        </div>
      </header>

      {/* --- NAVIGATION --- */}
      <nav className="flex flex-wrap gap-3 rounded-full border border-[#C8A1B4]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 shadow-inner">
        {["Explore", "Lecture", "Workbook", "Apply"].map((stage) => (
          <a
            key={stage}
            href={`#${stage.toLowerCase()}`}
            className="rounded-full px-4 py-1 transition hover:-translate-y-0.5 hover:bg-[#FFFAF8] hover:text-[#3E2F35]"
          >
            {stage}
          </a>
        ))}
      </nav>

      {/* --- EXPLORE --- */}
      <section
        id="explore"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Explore</h2>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75">{moduleEntry.content.explore}</p>
      </section>

      {/* --- LECTURE --- */}
      <section
        id="lecture"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Lecture</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Deep Dive</h2>
        </header>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75 whitespace-pre-line">
          {moduleEntry.content.lecture}
        </p>
      </section>

      {/* --- WORKBOOK --- */}
      <section
        id="workbook"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Workbook</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Reflect & Share</h2>
        </header>

        <ModuleWorkbookPanel
          moduleSlug={moduleEntry.slug}
          moduleTitle={moduleEntry.title}
          prompt={moduleEntry.content.journalPrompt}
        />
      </section>

      {/* --- APPLY --- */}
      <section
        id="apply"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Apply</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Turn Insight Into Action</h2>
        </header>
        <ul className="space-y-3 text-sm text-[#3E2F35]/75">
          {moduleEntry.content.apply.map((task: string) => (
            <li key={task} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A1B4]/20 text-xs text-[#C8A1B4]">
                ✓
              </span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* --- FOOTER --- */}
      <footer className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-8 text-sm text-[#3E2F35]/75 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        Completed modules automatically update your concierge roadmap and reveal new registry recommendations.
        Continue to{" "}
        <a href="/dashboard/plan" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
          Plan →
        </a>{" "}
        to see personalized updates for you, {user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Member"}.
      </footer>
    </article>
  );
}
