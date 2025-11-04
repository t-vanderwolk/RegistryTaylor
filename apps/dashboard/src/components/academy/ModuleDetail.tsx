"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, NotebookPen, Sparkles } from "lucide-react";
import LectureView from "@/components/academy/LectureView";
import ModuleWorkbookPanel from "@/components/academy/ModuleWorkbookPanel";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import type { AcademyModule, ModuleProgress } from "@/types/academy";

type ModuleDetailProps = {
  module: AcademyModule;
  previousModule?: { slug: string; title: string } | null;
  nextModule?: { slug: string; title: string } | null;
};

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const percent = max <= 0 ? 0 : (scrollTop / max) * 100;
      setScrollProgress(Math.min(100, Math.max(0, percent)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

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

  const applyTasks = useMemo(() => {
    if (Array.isArray(module.content.apply) && module.content.apply.length > 0) {
      return module.content.apply;
    }
    return [];
  }, [module.content.apply]);

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
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("We couldn’t save your progress. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [module.slug, localProgress.completed, submitting, setProgressFor, refresh, router]);

  const milestoneLabel = `Milestone ${Math.min(index + 1, total)} of ${total}`;

  return (
    <div className="space-y-12">
      {mounted ? (
        <div className="pointer-events-none fixed left-0 top-0 z-30 h-1 w-full bg-[#F8F6F3]">
          <div
            className="h-full bg-[#C8A6B6]"
            style={{ width: `${scrollProgress}%`, transition: "width 0.2s ease-out" }}
          />
        </div>
      ) : null}

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
          <LectureView
            blocks={lessonBlocks}
            applyTasks={applyTasks}
            journalPrompt={module.content.journalPrompt}
            insight={module.content.insight}
            mentorNote={module.content.mentorNote}
            onMarkComplete={handleMarkComplete}
            completed={localProgress.completed}
            submitting={submitting}
          />
          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="space-y-4 rounded-3xl border border-[#EED6D3] bg-white p-6">
            <h2 className="inline-flex items-center gap-2 font-serif text-xl text-[#3E2F35]">
              <NotebookPen className="h-4 w-4 text-[#C8A6B6]" aria-hidden />
              Your tools
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-[#3E2F35]/85">
              <li className="flex items-start gap-3">
                <Sparkles className="mt-1 h-4 w-4 text-[#C8A6B6]" aria-hidden />
                <span>Workbook entries stay private to you until you decide to share with your mentor.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-1 h-4 w-4 text-[#C8A6B6]" aria-hidden />
                <span>Registry updates sync automatically once a lesson is complete.</span>
              </li>
            </ul>
            <div className="flex flex-col gap-2 text-sm font-semibold text-[#3E2F35]">
              <Link
                href="/dashboard/plan"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8A6B6] px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-[#C8A6B6] hover:text-white"
              >
                Registry planner <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/dashboard/academy/workbook"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8A6B6] px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:bg-[#C8A6B6] hover:text-white"
              >
                Shared workbook <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <ModuleWorkbookPanel
            moduleSlug={module.slug}
            moduleTitle={module.title}
            prompt={module.content.journalPrompt}
          />
        </aside>
      </div>

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
  );
}
