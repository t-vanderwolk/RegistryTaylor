import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import { getAcademyModule, getAcademyModules } from "@/lib/academy";
import { AcademyProgressProvider } from "@/components/academy/ProgressContext";
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
    redirect("/dashboard/learn/welcome");
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
            href="/dashboard/learn/welcome"
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
        />

        {modules.length > 1 ? (
          <section className="space-y-4 rounded-3xl border border-[#EED6D3] bg-white p-6">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#3E2F35]/60">
                Continue the journey
              </p>
              <h2 className="font-serif text-2xl text-[#3E2F35]">Other chapters you may love</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {modules
                .filter((candidate) => candidate.slug !== moduleEntry.slug)
                .slice(0, 4)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/dashboard/learn/${item.slug}`}
                    className="flex flex-col gap-1 rounded-2xl border border-[#EED6D3] bg-[#F8F6F3] px-4 py-3 transition hover:border-[#C8A6B6]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">
                      {item.category ?? item.journey ?? "Module"}
                    </span>
                    <span className="font-serif text-lg text-[#3E2F35]">{item.title}</span>
                    {item.subtitle ? (
                      <span className="text-sm text-[#3E2F35]/70">{item.subtitle}</span>
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
