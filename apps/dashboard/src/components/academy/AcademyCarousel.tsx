import ModuleCard from "@/components/academy/ModuleCard";
import type { AcademyModule, ModuleProgress } from "@/types/academy";

type AcademyCarouselProps = {
  modules: AcademyModule[];
  progressMap?: Record<string, ModuleProgress>;
};

export default function AcademyCarousel({ modules, progressMap = {} }: AcademyCarouselProps) {
  if (modules.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[#C8A1B4]/40 bg-white/70 p-10 text-center text-sm text-[#3E2F35]/70">
        Modules are on the way. Taylor is curating new lessons for you.
      </div>
    );
  }

  return (
    <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 xl:grid-cols-3">
      {modules.map((module) => (
        <div key={module.id} className="min-w-[280px] snap-start px-2 md:px-0">
          <ModuleCard
            module={module}
            href={`/dashboard/academy/modules/${module.slug}`}
            progress={progressMap[module.slug]}
          />
        </div>
      ))}
    </div>
  );
}
