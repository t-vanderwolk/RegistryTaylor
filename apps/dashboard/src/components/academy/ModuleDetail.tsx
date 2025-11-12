"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ScrollProgress from "@/components/ui/ScrollProgress";
import LectureRenderer from "@/components/academy/LectureRenderer";
import WorkbookPanel from "@/components/academy/WorkbookPanel";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import ProgressTracker from "@/components/academy/ProgressTracker";
import type { AcademyModule, ModuleProgress, WorkbookSection } from "@/types/academy";

type ModuleDetailProps = {
  module: AcademyModule;
  previousModule?: { slug: string; title: string } | null;
  nextModule?: { slug: string; title: string } | null;
  children?: ReactNode;
};

const PROGRESS_HEARTBEAT_MS = 30_000;

function normalizeProgress(progress?: ModuleProgress): ModuleProgress {
  if (!progress) {
    return { percentComplete: 0, completed: false };
  }
  const percent = Math.max(0, Math.min(100, Math.round(progress.percentComplete ?? 0)));
  return {
    percentComplete: percent,
    completed: progress.completed ?? percent >= 100,
    completedAt: progress.completedAt,
    updatedAt: progress.updatedAt,
    quizScore: progress.quizScore ?? null,
    reflection: progress.reflection ?? null,
  };
}

export default function ModuleDetail({
  module,
  previousModule,
  nextModule,
  children,
}: ModuleDetailProps) {
  const router = useRouter();
  const { progress, setProgressFor, refresh, getMilestone } = useAcademyProgress();
  const { index, total } = getMilestone(module.slug);
  const initialProgress = normalizeProgress(progress[module.slug] ?? module.progress);

  const [localProgress, setLocalProgress] = useState(initialProgress);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const lessonBlocks = useMemo(() => {
    if (Array.isArray(module.content.learn) && module.content.learn.length > 0) {
      return module.content.learn;
    }
    if (Array.isArray(module.content.sections) && module.content.sections.length > 0) {
      return module.content.sections;
    }
    if (typeof module.content.lecture === "string") {
      return [{ body: module.content.lecture }];
    }
    return [];
  }, [module.content.learn, module.content.sections, module.content.lecture]);

  const workbookSections = useMemo<WorkbookSection[]>(() => {
    if (Array.isArray(module.content.workbook) && module.content.workbook.length > 0) {
      return module.content.workbook;
    }

    const fallback: WorkbookSection[] = [];
    if (Array.isArray(module.content.apply) && module.content.apply.length > 0) {
      fallback.push({
        type: "checklist",
        title: "Apply this week",
        items: module.content.apply,
      });
    }
    if (module.content.journalPrompt) {
      fallback.push({
        type: "reflection",
        title: "Reflection",
        prompt: module.content.journalPrompt,
      });
    }
    fallback.push({
      type: "submit",
      title: "Save workbook",
      ctaLabel: "Save workbook",
    });
    return fallback;
  }, [module.content.apply, module.content.journalPrompt, module.content.workbook]);

  const handleMarkComplete = useCallback(async () => {
    if (localProgress.completed || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/academy/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ moduleSlug: module.slug, percent: 100 }),
      });

      if (!response.ok) {
        throw new Error("Unable to update progress.");
      }

      const data = (await response.json()) as { progress?: ModuleProgress };
      const nextProgress = normalizeProgress(data.progress ?? { percentComplete: 100, completed: true });
      setLocalProgress(nextProgress);
      setProgressFor(module.slug, nextProgress);
      await refresh();
      setToast("Lesson complete 🎀 – Great work, Mama!");
      setTimeout(() => setToast(null), 2500);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("We couldn’t save your progress. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [module.slug, localProgress.completed, submitting, setProgressFor, refresh, router]);

  useEffect(() => {
    if (localProgress.completed) {
      return;
    }

    const interval = window.setInterval(async () => {
      const progressPercent = Math.max(localProgress.percentComplete, Math.round(scrollPercent));
      if (progressPercent <= localProgress.percentComplete) {
        return;
      }
      try {
        await fetch("/api/academy/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ moduleSlug: module.slug, percent: progressPercent }),
        });
        const updated = normalizeProgress({ ...localProgress, percentComplete: progressPercent });
        setLocalProgress(updated);
        setProgressFor(module.slug, updated);
      } catch (error) {
        console.error(error);
      }
    }, PROGRESS_HEARTBEAT_MS);

    return () => window.clearInterval(interval);
  }, [localProgress, module.slug, scrollPercent, setProgressFor]);

  const milestoneLabel = `Milestone ${Math.min(index + 1, total)} of ${Math.max(total, 1)}`;

  const handleReflectionSave = useCallback(async (value: string) => {
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleSlug: module.slug, content: value }),
      });
    } catch (error) {
      console.error(error);
    }
  }, [module.slug]);

  const lectureContent = children ?? (
    <LectureRenderer
      blocks={lessonBlocks}
      mentorNote={module.content.mentorNote ?? null}
      onReflectionSave={handleReflectionSave}
    />
  );

  return (
    <div className="space-y-12">
      <ScrollProgress onProgressChange={setScrollPercent} />

      <header className="space-y-6 rounded-academy-xl border border-blush-300/70 bg-ivory/95 p-8 shadow-blush-lift">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="space-y-4">
            <span className="academy-pill bg-white/80 text-charcoal-500">
              {module.category ?? module.journey ?? "Academy"}
            </span>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">
                Lesson {Math.min(index + 1, total)}
              </p>
              <h1 className="font-serif text-[2.25rem] leading-tight text-charcoal-700 md:text-[2.6rem]">
                {module.title}
              </h1>
              {module.subtitle ? (
                <p className="max-w-3xl text-base leading-relaxed text-charcoal-500">{module.subtitle}</p>
              ) : module.summary ? (
                <p className="max-w-3xl text-base leading-relaxed text-charcoal-500">{module.summary}</p>
              ) : null}
            </div>
          </div>
          <div className="min-w-[240px] max-w-sm flex-1 md:flex-none">
            <ProgressTracker
              percent={localProgress.percentComplete}
              label={milestoneLabel}
              encouragement={localProgress.completed ? "Ceremony complete — celebrate your glow" : undefined}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-12">
          {lectureContent}

          <div className="space-y-4 rounded-academy border border-blush-300/70 bg-white/90 px-6 py-5 text-sm text-charcoal-500 shadow-mauve-card">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">
              Wrap this chapter
            </p>
            <p className="text-sm leading-relaxed text-charcoal-500">
              Pause, breathe, and check in with how this lesson lands. When you’re ready, mark it complete to unlock the next
              concierge milestone.
            </p>
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={localProgress.completed || submitting}
              className="academy-button w-full justify-center gap-2 px-8 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {localProgress.completed ? "Module completed" : submitting ? "Saving…" : "Mark lesson complete"}
            </button>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <motion.nav
            className="flex flex-col gap-3 rounded-academy border border-blush-300/70 bg-ivory/95 px-6 py-4 text-sm text-charcoal-500 shadow-mauve-card md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
              {previousModule ? (
                <Link
                  href={`/dashboard/member/learn/${previousModule.slug}` as Route}
                  className="inline-flex items-center gap-2 font-semibold text-charcoal-600 transition hover:text-mauve-500"
                >
                  ← {previousModule.title}
                </Link>
              ) : (
                <span className="text-sm text-charcoal-300">Start of journey</span>
              )}
              {nextModule ? (
                <Link
                  href={`/dashboard/member/learn/${nextModule.slug}` as Route}
                  className="inline-flex items-center gap-2 font-semibold text-charcoal-600 transition hover:text-mauve-500"
                >
                  {nextModule.title} →
                </Link>
              ) : (
                <span className="text-sm text-charcoal-300">You’ve reached the finale</span>
              )}
            </div>
            {localProgress.completed ? (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600">
                <CheckCircle2 className="h-4 w-4 text-mauve-500" aria-hidden />
                <span>Lesson celebrated</span>
              </div>
            ) : null}
          </motion.nav>
        </div>

        <div className="hidden lg:block">
          <WorkbookPanel moduleSlug={module.slug} moduleTitle={module.title} sections={workbookSections} />
        </div>
      </div>

      <div className="lg:hidden">
        <WorkbookPanel moduleSlug={module.slug} moduleTitle={module.title} sections={workbookSections} />
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#C8A6B6] bg-white px-5 py-3 text-sm font-semibold text-[#3E2F35] shadow-lg"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
