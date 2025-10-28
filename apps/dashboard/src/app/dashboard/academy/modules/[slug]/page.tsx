import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProgressBar from "@/components/academy/ProgressBar";
import MarkCompleteButton from "@/components/academy/MarkCompleteButton";
import AddToRegistryButton from "@/components/academy/AddToRegistryButton";
import { addModuleToRegistry, getAcademyModule, getModuleProgress, markModuleComplete } from "@/lib/academy";
import { requireMember } from "@/lib/auth";
import ModuleWorkbookPanel from "@/components/academy/ModuleWorkbookPanel";

type ModulePageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ModulePageProps) {
  const academyModule = await getAcademyModule(params.slug);
  if (!academyModule) {
    return {
      title: "Module not found",
    };
  }

  return {
    title: `${academyModule.title} · Taylor-Made Baby Academy`,
    description: academyModule.subtitle ?? academyModule.content.explore.slice(0, 140),
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const user = await requireMember();
  const academyModule = await getAcademyModule(params.slug);

  if (!academyModule) {
    notFound();
  }

  const progress = await getModuleProgress(academyModule.slug);

  const completeModule = async () => {
    "use server";
    await markModuleComplete(academyModule.slug);
    revalidatePath("/dashboard/academy");
    revalidatePath(`/dashboard/academy/modules/${academyModule.slug}`);
  };

  const addToRegistry = async () => {
    "use server";
    try {
      await addModuleToRegistry(academyModule.slug);
      revalidatePath("/dashboard/plan");
    } catch (error) {
      console.error(error);
      redirect("/dashboard/plan?error=registry");
    }
  };

  return (
    <article className="space-y-10">
      <header
        className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${academyModule.accentColor ?? "#FFFAF8"} 0%, rgba(255,255,255,0.92) 55%)`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          {academyModule.journey} Journey · {academyModule.registryFocus ?? "Taylor-Made Academy"}
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">{academyModule.title}</h1>
        {academyModule.subtitle && <p className="mt-2 max-w-2xl text-sm text-[#3E2F35]/70">{academyModule.subtitle}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <MarkCompleteButton action={completeModule} completed={progress.completed} />
          <AddToRegistryButton action={addToRegistry} />
        </div>
        <div className="mt-6 max-w-md">
          <ProgressBar percent={progress.percentComplete} label="Module Progress" />
        </div>
      </header>

      <nav className="flex flex-wrap gap-3 rounded-full border border-[#C8A1B4]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 shadow-inner">
        {[
          { id: "explore", label: "Explore" },
          { id: "lecture", label: "Lecture" },
          { id: "workbook", label: "Workbook" },
          { id: "apply", label: "Apply" },
        ].map((stage) => (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            className="rounded-full px-4 py-1 transition hover:-translate-y-0.5 hover:bg-[#FFFAF8] hover:text-[#3E2F35]"
          >
            {stage.label}
          </a>
        ))}
      </nav>

      <section
        id="explore"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Explore</h2>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75">{academyModule.content.explore}</p>
        <div className="flex justify-end">
          <a
            href="#lecture"
            className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Next · Lecture →
          </a>
        </div>
      </section>

      <section
        id="lecture"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Lecture</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Deep dive</h2>
        </header>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75 whitespace-pre-line">{academyModule.content.lecture}</p>
        <div className="flex justify-between">
          <a
            href="#explore"
            className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            ← Back · Explore
          </a>
          <a
            href="#workbook"
            className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Next · Workbook →
          </a>
        </div>
      </section>

      <section
        id="workbook"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Workbook</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Reflect & share</h2>
        </header>
        <ModuleWorkbookPanel
          moduleSlug={academyModule.slug}
          moduleTitle={academyModule.title}
          prompt={academyModule.content.journalPrompt}
        />
        <div className="flex justify-end">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Next · Apply →
          </a>
        </div>
      </section>

      <section
        id="apply"
        className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
      >
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Apply</p>
          <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Turn insight into action</h2>
        </header>
        <ul className="space-y-3 text-sm text-[#3E2F35]/75">
          {academyModule.content.apply.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A1B4]/20 text-xs text-[#C8A1B4]">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-start">
          <a
            href="#workbook"
            className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            ← Back · Workbook
          </a>
        </div>
      </section>

      <footer className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-8 text-sm text-[#3E2F35]/75 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        Completed modules automatically update your concierge roadmap and unveil new registry recommendations. Continue to{" "}
        <a href="/dashboard/plan" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
          Plan →
        </a>{" "}
        to see the latest additions tailored for you, {user.name?.split(" ")[0] ?? "Taylor member"}.
      </footer>
    </article>
  );
}
