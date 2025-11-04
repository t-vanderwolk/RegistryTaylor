import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModule, getAcademyModules } from "@/lib/academy";
import { AcademyProgressProvider } from "@/components/academy/ProgressContext";
import AcademyCarousel from "@/components/academy/AcademyCarousel";
import ModuleDetail from "@/components/academy/ModuleDetail";
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
    redirect("/academy");
  }

  const currentIndex = modules.findIndex((module) => module.slug === params.slug);
  if (currentIndex === -1) {
    notFound();
  }

  const moduleEntry = modules[currentIndex];
  const previousModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const progressMap = buildProgressMap(modules);

  return (
    <AcademyProgressProvider initialProgress={progressMap}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-10 md:gap-12 md:px-10">
        <div>
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9B8C91] transition hover:text-[#3E2F35]"
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
        />

        {modules.length > 1 ? (
          <section className="space-y-6 rounded-2xl border border-[#E8E3E1] bg-white/80 p-6 shadow-[0_18px_40px_rgba(62,47,53,0.06)] md:p-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">
                Continue the journey
              </p>
              <h2 className="font-serif text-2xl text-[#3E2F35]">Next up in the Taylor-Made Academy</h2>
            </div>
            <AcademyCarousel modules={modules} initialSlug={moduleEntry.slug} />
          </section>
        ) : null}
      </div>
    </AcademyProgressProvider>
  );
}
