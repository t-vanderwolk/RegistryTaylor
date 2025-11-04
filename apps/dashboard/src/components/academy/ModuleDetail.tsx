"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ScrollProgress from "@/components/ui/ScrollProgress";
import LectureRenderer from "@/components/academy/LectureRenderer";
import WorkbookPanel from "@/components/academy/WorkbookPanel";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import type { AcademyModule, ModuleProgress, WorkbookSection } from "@/types/academy";

type ModuleDetailProps = {
  module: AcademyModule;
  previousModule?: { slug: string; title: string } | null;
  nextModule?: { slug: string; title: string } | null;
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
  };
}

export default function ModuleDetail({ module, previousModule, nextModule }: ModuleDetailProps) {
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

  return (
    <div className="space-y-12">
      <ScrollProgress onProgressChange={setScrollPercent} />

      <header className="space-y-6 rounded-3xl border border-[#EED6D3] bg-[#F8F6F3] p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-[#EED6D3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]">
              {module.category ?? module.journey ?? "Academy"}
            </span>
            <div className="space-y-3">
              <h1 className="font-serif text-3xl leading-tight text-[#3E2F35] md:text-[2.4rem]">{module.title}</h1>
              {module.subtitle ? (
                <p className="max-w-3xl text-base leading-relaxed text-[#3E2F35]/80">{module.subtitle}</p>
              ) : module.summary ? (
                <p className="max-w-3xl text-base leading-relaxed text-[#3E2F35]/80">{module.summary}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-[#C8A6B6]/40 bg-white px-5 py-4">
            <span className="inline-flex items-center rounded-full bg-[#EED6D3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]">
              {milestoneLabel}
            </span>
            <div className="h-1 w-full min-w-[220px] rounded-full bg-[#EED6D3]/70">
              <div className="h-full rounded-full bg-[#C8A6B6]" style={{ width: `${localProgress.percentComplete}%` }} />
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">
              {localProgress.completed ? "Completed" : `${localProgress.percentComplete}% explored`}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-12">
          <LectureRenderer
            blocks={lessonBlocks}
            mentorNote={module.content.mentorNote ?? null}
            onReflectionSave={handleReflectionSave}
          />

          <div className="space-y-3 rounded-3xl border border-[#EED6D3] bg-white px-5 py-4 text-sm text-[#3E2F35]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Wrap this chapter</p>
            <p className="text-sm leading-relaxed text-[#3E2F35]/80">
              Pause, breathe, and check in with how this lesson lands. When you’re ready, mark it complete to unlock the next
              concierge milestone.
            </p>
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={localProgress.completed || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EED6D3] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white disabled:cursor-not-allowed disabled:bg-[#EED6D3]/70"
            >
              {localProgress.completed ? "Module completed" : submitting ? "Saving…" : "Mark lesson complete"}
            </button>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <motion.nav
            className="flex flex-col gap-3 rounded-3xl border border-[#EED6D3] bg-white px-5 py-4 text-sm text-[#3E2F35] md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
              {previousModule ? (
                <Link
                  href={`/academy/${previousModule.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-[#3E2F35] transition hover:text-[#C8A6B6]"
                >
                  ← {previousModule.title}
                </Link>
              ) : (
                <span className="text-sm text-[#3E2F35]/50">Start of journey</span>
              )}
              {nextModule ? (
                <Link
                  href={`/academy/${nextModule.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-[#3E2F35] transition hover:text-[#C8A6B6]"
                >
                  {nextModule.title} →
                </Link>
              ) : (
                <span className="text-sm text-[#3E2F35]/50">You’ve reached the finale</span>
              )}
            </div>
            {localProgress.completed ? (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E2F35]">
                <CheckCircle2 className="h-4 w-4 text-[#C8A6B6]" aria-hidden />
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
