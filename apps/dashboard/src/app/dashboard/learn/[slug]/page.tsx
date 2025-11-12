import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModule, getAcademyModules } from "@/lib/academy";
import { AcademyProgressProvider } from "@/components/academy/ProgressContext";
import ModuleDetail from "@/components/academy/ModuleDetail";
import LectureContent from "@/components/academy/LectureContent";
import InteractiveSection from "@/components/academy/InteractiveSection";
import type { ModuleProgress } from "@/types/academy";

export const dynamic = "force-dynamic";

type ModulePageParams = {
  params: {
    slug: string;
  };
};

function buildProgressMap(modules: Awaited<ReturnType<typeof getAcademyModules>>): Record<string, ModuleProgress> {
  return modules.reduce<Record<string, ModuleProgress>>((acc, module) => {
    acc[module.slug] = module.progress ?? { percentComplete: 0, completed: false };
    return acc;
  }, {});
}

export async function generateMetadata({ params }: ModulePageParams): Promise<Metadata> {
  const moduleEntry = await getAcademyModule(params.slug);
  if (!moduleEntry) {
    return {
      title: "Academy Module · Taylor-Made Baby Co.",
    };
  }

  return {
    title: `${moduleEntry.title} · Taylor-Made Baby Academy`,
    description: moduleEntry.tagline ?? moduleEntry.summary ?? moduleEntry.subtitle ?? undefined,
  };
}

export default async function AcademyModulePage({ params }: ModulePageParams) {
  await requireMember();
  const modules = await getAcademyModules();

  if (!modules.length) {
    redirect("/dashboard/member/learn/welcome");
  }

  const currentIndex = modules.findIndex((module) => module.slug === params.slug);
  if (currentIndex === -1) {
    notFound();
  }

  const moduleEntry = modules[currentIndex];
  const previousModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const progressMap = buildProgressMap(modules);

  const moduleOrder = modules.map((module) => module.slug);

  return (
    <AcademyProgressProvider initialProgress={progressMap} moduleOrder={moduleOrder}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-10 md:gap-12 md:px-10">
        <div>
          <Link
            href="/dashboard/member/learn/welcome"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60 transition hover:text-[#3E2F35]"
          >
            ← Back to all modules
          </Link>
        </div>
        <ModuleDetail
          module={moduleEntry}
          previousModule={
            previousModule ? { slug: previousModule.slug, title: previousModule.title } : null
          }
          nextModule={nextModule ? { slug: nextModule.slug, title: nextModule.title } : null}
        >
          <LectureContent module={moduleEntry} />
          <InteractiveSection moduleSlug={moduleEntry.slug} moduleTitle={moduleEntry.title} />
        </ModuleDetail>

        {modules.length > 1 ? (
          <section className="space-y-5 rounded-academy-xl border border-blush-300/70 bg-ivory/95 p-6 shadow-mauve-card">
            <div className="space-y-3 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">
                Continue the journey
              </p>
              <h2 className="font-serif text-2xl text-charcoal-700 md:text-[2rem]">Other chapters you may love</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {modules
                .filter((candidate) => candidate.slug !== moduleEntry.slug)
                .slice(0, 4)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/dashboard/member/learn/${item.slug}`}
                    className="flex flex-col gap-2 rounded-academy border border-blush-300/60 bg-white/90 px-5 py-4 transition duration-200 ease-bloom hover:-translate-y-1 hover:shadow-blush-soft"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">
                      {item.category ?? item.journey ?? "Module"}
                    </span>
                    <span className="font-serif text-lg text-charcoal-700">{item.title}</span>
                    {item.subtitle ? (
                      <span className="text-sm text-charcoal-400">{item.subtitle}</span>
                    ) : null}
                  </Link>
                ))}
            </div>
          </section>
        ) : null}
      </div>
    </AcademyProgressProvider>
  );
}
