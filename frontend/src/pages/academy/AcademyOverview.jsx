import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAcademyContext } from "../Academy";

const AcademyOverview = () => {
  const navigate = useNavigate();
  const { modulesState } = useAcademyContext();

  const modules = useMemo(() => (Array.isArray(modulesState.data) ? modulesState.data : []), [modulesState.data]);

  if (modulesState.status === "loading" && !modules.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-sm font-body text-charcoal/60">
        <span className="text-2xl">⌛</span>
        Loading academy modules…
      </div>
    );
  }

  if (modulesState.status === "error") {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm font-body text-red-500">
        {modulesState.error || "We were unable to load the academy at this time. Please try again shortly."}
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-playful text-2xl text-charcoal">Choose your next Taylor-Made experience</h2>
        <p className="max-w-3xl text-sm font-body text-charcoal/70">
          Each module includes an immersive masterclass paired with a concierge workbook. Track your reflections, share
          entries with your mentor, and revisit anytime for refreshed guidance.
        </p>
      </header>

      <section className="space-y-6">
        {modules.map((module) => (
          <article
            key={module.id}
            className="space-y-4 rounded-3xl bg-softBeige/60 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            <header className="space-y-1">
              <p className="text-[0.7rem] font-heading uppercase tracking-[0.32em] text-mauve/70">
                {module.section}
              </p>
              <h2 className="text-xl font-serif text-mauve">{module.title}</h2>
              {module.introduction && (
                <p className="text-sm font-body italic text-charcoal/70">{module.introduction}</p>
              )}
            </header>
            <footer className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(`/academy/modules/${module.id}`)}
                className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
              >
                Open Module
              </button>
              <span className="text-[0.65rem] font-heading uppercase tracking-[0.32em] text-charcoal/50">
                {module.completedPrompts ?? 0}/{module.totalPrompts ?? 0} reflections · {module.progress ?? 0}%
              </span>
            </footer>
          </article>
        ))}
      </section>

      {!modules.length && (
        <p className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-4 py-8 text-center text-sm font-body text-charcoal/60">
          No modules available yet. Check back soon for new masterclasses tailored to your family.
        </p>
      )}
    </section>
  );
};

export default AcademyOverview;
