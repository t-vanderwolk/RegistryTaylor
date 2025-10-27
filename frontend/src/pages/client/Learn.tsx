import React from "react";
import { useNavigate } from "react-router-dom";
import useAcademyModules from "../../hooks/useAcademyModules";
import EmptyState from "../../components/ui/EmptyState";
import { AcademyModuleCard } from "../../components/dashboard";

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { modules, loading, error, refresh } = useAcademyModules();

  const coreModules = modules.filter((module) => module.isCore);
  const completedCore = coreModules.filter((module) => module.progress.completed).length;

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[2.75rem] border border-mauve/25 bg-white/95 p-6 shadow-soft sm:p-10">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-mauve/20 px-4 py-2 text-xs font-heading uppercase tracking-[0.35em] text-mauve">
            Learn · Plan · Connect
          </span>
          <h1 className="font-heading text-3xl text-charcoal sm:text-4xl">Taylor-Made Baby Academy</h1>
          <p className="max-w-2xl text-sm text-charcoal/75 sm:text-base">
            Move through the Member → Mentor framework at your pace. Begin with the core modules, capture your reflections,
            and unlock concierge planning prompts that sync with your registry.
          </p>
        </header>
        {coreModules.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/55">
            <span>
              Core modules completed: {completedCore}/{coreModules.length}
            </span>
            <span aria-hidden="true">•</span>
            <span>
              Progress:{" "}
              {modules.length
                ? Math.round(
                    modules.reduce((total, module) => total + (module.progress?.percentComplete || 0), 0) /
                      modules.length
                  )
                : 0}
              %
            </span>
          </div>
        )}
      </section>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`module-skeleton-${index}`}
              className="h-64 animate-pulse rounded-[2.5rem] border border-mauve/20 bg-white/80 shadow-soft"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <EmptyState
          title="Unable to load modules"
          description={error}
          action={
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
            >
              Try again
            </button>
          }
        />
      )}

      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-2">
          {modules.map((module) => (
            <AcademyModuleCard
              key={module.id}
              module={module}
              onSelect={() => navigate(module.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;
