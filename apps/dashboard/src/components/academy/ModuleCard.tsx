import Link from "next/link";
import type { Route } from "next";
import type { AcademyModule, ModuleProgress } from "@/types/academy";

type ModuleCardProps = {
  module: AcademyModule;
  progress?: ModuleProgress | null;
};

export default function ModuleCard({ module, progress }: ModuleCardProps) {
  const completed = progress?.completed;
  const percent = progress?.percentComplete ?? 0;

  return (
    <article
      className="group flex h-full flex-col justify-between rounded-[2rem] border border-[#C8A1B4]/30 bg-white/90 p-6 shadow-[0_20px_45px_rgba(200,161,180,0.15)] transition hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(200,161,180,0.2)]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${module.accentColor ?? "#FFFAF8"} 0%, rgba(255,255,255,0.92) 55%)`,
      }}
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          {module.journey} Journey
        </p>
        <h3 className="font-heading text-2xl text-[#3E2F35]">{module.title}</h3>
        {module.subtitle && <p className="font-[var(--font-playfair)] text-sm text-[#3E2F35]/70">{module.subtitle}</p>}
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#3E2F35]/65">
        <div>
          <dt className="font-semibold uppercase tracking-[0.26em]">Focus</dt>
          <dd>{module.registryFocus ?? "Taylor-Made Academy"}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-[0.26em]">Minutes</dt>
          <dd>{module.estimatedMinutes ?? 20}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 shadow-inner">
        <span>{completed ? "Completed" : percent > 0 ? "In Progress" : "New Module"}</span>
        <span>{percent}%</span>
      </div>

      <Link
        href={`/dashboard/academy/modules/${module.slug}` as Route}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-5 py-2 text-sm font-semibold text-[#3E2F35] shadow-[0_8px_20px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,161,180,0.45)]"
      >
        {completed ? "Review Module" : percent > 0 ? "Resume Module" : "Start Module"}
      </Link>
    </article>
  );
}
