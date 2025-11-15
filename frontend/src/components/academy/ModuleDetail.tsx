"use client";

import { Children, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
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

  const childArray = Children.toArray(children);
  const lectureChild = childArray[0] ?? null;
  const interactiveChild = childArray[1] ?? null;

  const lectureContent = lectureChild ?? (
    <LectureRenderer
      blocks={lessonBlocks}
      mentorNote={module.content.mentorNote ?? null}
      onReflectionSave={handleReflectionSave}
    />
  );
  const interactiveContent = interactiveChild;

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

return (
  <div className="space-y-8 md:space-y-12">
      <ScrollProgress onProgressChange={setScrollPercent} />

      <header id="overview" className="space-y-6 rounded-academy-xl border border-blush-300/70 bg-ivory/95 p-6 shadow-blush-lift md:rounded-[2.5rem] md:p-10">
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
        {module.heroImage ? (
          <button
            type="button"
            onClick={() => setLightboxSrc(module.heroImage!)}
            className="relative mt-4 overflow-hidden rounded-3xl border border-blush-300/70 bg-ivory/80"
          >
            <Image
              src={module.heroImage}
              alt={module.title}
              width={1280}
              height={720}
              sizes="100vw"
              className="h-60 w-full object-cover md:h-72"
              priority
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-400">
              Expand
            </span>
          </button>
        ) : null}
      </header>

      <div className="space-y-12" id="lecture">
        <div className="space-y-8 rounded-academy-xl border border-blush-300/70 bg-ivory/95 p-5 text-charcoal-500 shadow-mauve-card md:rounded-[2rem] md:p-8 md:prose md:prose-lg md:prose-headings:font-serif md:prose-p:leading-relaxed md:prose-blockquote:border-mauve-200 md:prose-li:marker:text-mauve-400">
          {lectureContent}
        </div>

        <div id="interactive">{interactiveContent}</div>

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

      <div id="workbook" className="block h-0" aria-hidden />
      <div className="md:hidden">
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

      {nextModule ? (
        <Link
          href={`/dashboard/member/learn/${nextModule.slug}` as Route}
          className="hidden md:inline-flex fixed bottom-6 right-8 items-center gap-3 rounded-full border border-mauve-500/40 bg-white/95 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-charcoal-600 shadow-lg transition hover:bg-mauve-500 hover:text-white"
        >
          Next module →
        </Link>
      ) : null}

      {lightboxSrc
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,4,6,0.8)] p-6">
              <button
                type="button"
                aria-label="Close image"
                onClick={() => setLightboxSrc(null)}
                className="absolute right-6 top-6 rounded-full border border-white/40 p-2 text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative h-full w-full max-w-5xl">
                <Image src={lightboxSrc} alt={module.title} fill className="object-contain" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
