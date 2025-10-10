import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcademyContext } from "../Academy";
import { ProgressTracker } from "../../components/academy";

const splitLectureIntoSlides = (lecture) =>
  lecture
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

const AcademyModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { moduleState, moduleProgress, loadModule } = useAcademyContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (moduleId) {
      loadModule(moduleId);
    }
  }, [moduleId, loadModule]);

  const moduleData = moduleState?.data?.module || null;
  const lectureSlides = useMemo(
    () => splitLectureIntoSlides(moduleData?.lecture || ""),
    [moduleData?.lecture]
  );

  useEffect(() => {
    setCurrentSlide(0);
  }, [moduleData?.id]);

  const progress = moduleProgress || {
    percent: moduleData?.progress ?? 0,
    completedPrompts: moduleData?.completedPrompts ?? 0,
    totalPrompts:
      moduleData?.totalPrompts ??
      ((Array.isArray(moduleData?.content?.reflect) ? moduleData.content.reflect.length : 0) +
        (moduleData?.content?.journal_prompt ? 1 : 0)),
  };

  if (moduleState.status === "loading" && !moduleData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-sm font-body text-charcoal/60">
        <span className="text-2xl">⌛</span>
        Loading module…
      </div>
    );
  }

  if (moduleState.status === "error") {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50/80 px-6 py-8 text-center text-sm font-body text-red-500">
        {moduleState.error || "Unable to load this module right now."}
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-4 py-8 text-center text-sm font-body text-charcoal/60">
        Module not found or unavailable for your current role.
      </div>
    );
  }

  const introductionCopy = moduleData.introduction || moduleData.content?.explore || "";
  const segments = Array.isArray(moduleData.content?.segments) ? moduleData.content.segments : [];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? lectureSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === lectureSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="space-y-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/70">{moduleData.section}</p>
          <h2 className="font-playful text-3xl text-charcoal">{moduleData.title}</h2>
          {moduleData.content?.overview && (
            <p className="mt-3 max-w-3xl text-sm font-body text-charcoal/70">{moduleData.content.overview}</p>
          )}
          {moduleData.content?.hero && (
            <div className="mt-3 flex flex-wrap gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-charcoal/50">
              {moduleData.content.hero.duration && <span>Duration · {moduleData.content.hero.duration}</span>}
              {moduleData.content.hero.format && <span>Format · {moduleData.content.hero.format}</span>}
              {moduleData.content.hero.tone && <span>Tone · {moduleData.content.hero.tone}</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-3">
          <ProgressTracker value={progress.percent} label="Complete" />
          <button
            type="button"
            onClick={() => navigate(`/academy/workbook/${moduleData.id}`)}
            className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
          >
            Open Workbook
          </button>
        </div>
      </header>

      {moduleData.content?.objectives?.length > 0 && (
        <section className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-5 py-4">
          <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Objectives</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {moduleData.content.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-3 text-sm font-body text-charcoal/70">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mauve" aria-hidden />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {introductionCopy && (
        <section className="space-y-5 rounded-[2rem] border border-ivory/80 bg-ivory/60 px-5 py-4">
          <div>
            <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Explore</h3>
            <p className="mt-3 text-sm font-body text-charcoal/70 whitespace-pre-line">{introductionCopy}</p>
          </div>
          {lectureSlides.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/70">Lecture Highlights</h4>
                {lectureSlides.length > 1 && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="rounded-full border border-mauve/30 bg-white px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-mauve shadow-soft transition hover:-translate-y-0.5"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-full border border-mauve/30 bg-white px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-mauve shadow-soft transition hover:-translate-y-0.5"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              <div className="rounded-[1.75rem] border border-mauve/30 bg-white/90 p-5 shadow-soft">
                <p className="text-sm font-body text-charcoal/80 whitespace-pre-line">
                  {lectureSlides[currentSlide]}
                </p>
                {lectureSlides.length > 1 && (
                  <div className="mt-4 flex justify-center gap-1">
                    {lectureSlides.map((_, index) => (
                      <span
                        key={`lecture-dot-${index}`}
                        className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-mauve" : "bg-mauve/30"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {segments.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">Syllabus</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {segments.map((segment) => (
              <article
                key={segment.title}
                className="rounded-[2rem] border border-mauve/20 bg-white/80 px-5 py-4 shadow-soft"
              >
                <p className="text-xs font-heading uppercase tracking-[0.3em] text-mauve/70">{segment.label}</p>
                <h4 className="mt-1 text-lg font-heading text-charcoal">{segment.title}</h4>
                <ul className="mt-3 space-y-2 text-sm font-body text-charcoal/70">
                  {(segment.topics || []).map((topic) => (
                    <li key={topic} className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full bg-mauve" aria-hidden />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="rounded-[2rem] border border-gold/20 bg-gold/10 px-5 py-4 text-sm font-body text-charcoal/70">
        Keep your concierge notebook active: reflections save automatically and your mentor can leave notes in-line to help
        translate insights into action.
      </footer>
    </article>
  );
};

export default AcademyModuleDetail;
