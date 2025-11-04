"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import type { AcademyModule, ModuleProgress } from "@/types/academy";

type ModuleDetailProps = {
  module: AcademyModule;
  previousModule?: { slug: string; title: string } | null;
  nextModule?: { slug: string; title: string } | null;
};

const fadeVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function splitParagraphs(body: string): string[] {
  return body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

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
  const { progress, setProgressFor, refresh } = useAcademyProgress();
  const router = useRouter();
  const initialProgress = normalizeProgress(progress[module.slug] ?? module.progress);
  const [localProgress, setLocalProgress] = useState<ModuleProgress>(initialProgress);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const learnBlocks = useMemo(() => {
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

  return (
    <div className="space-y-10">
      <motion.header
        className="rounded-2xl border border-[#E8E3E1] bg-[#FAF9F7] p-6 shadow-[0_22px_45px_rgba(62,47,53,0.08)] md:p-8"
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-[#EAD7DC] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
              {module.category ?? module.journey ?? "Academy"}
            </span>
            <div className="space-y-3">
              <h1 className="font-serif text-3xl leading-tight text-[#3E2F35] md:text-[2.2rem]">{module.title}</h1>
              {module.tagline ? (
                <p className="font-script text-2xl text-[#D6C1C7]">{module.tagline}</p>
              ) : module.subtitle ? (
                <p className="text-base leading-relaxed text-[#3E2F35]/80">{module.subtitle}</p>
              ) : module.summary ? (
                <p className="text-base leading-relaxed text-[#3E2F35]/80">{module.summary}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 text-sm text-[#3E2F35]/80">
            <div className="rounded-xl border border-[#E8E3E1] bg-white/60 px-4 py-3 text-right">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/70">Estimated time</p>
              <p className="mt-1 text-sm text-[#3E2F35]">
                {module.estimatedMinutes ? `${module.estimatedMinutes} minutes` : "Self-paced"}
              </p>
            </div>
            <div className="rounded-xl border border-[#E8E3E1] bg-white/60 px-4 py-3 text-right">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/70">Progress</p>
              <p className="mt-1 text-sm font-semibold text-[#3E2F35]">
                {localProgress.completed ? "Complete" : `${localProgress.percentComplete}%`}
              </p>
            </div>
          </div>
        </div>
        {module.heroImage ? (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl border border-[#E8E3E1] bg-white">
            <Image src={module.heroImage} alt={module.title} fill className="object-cover" priority />
          </div>
        ) : null}
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${module.slug}-learn`}
          className="space-y-6 rounded-2xl border border-[#E8E3E1] bg-white p-6 shadow-[0_18px_40px_rgba(62,47,53,0.06)] md:p-8"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="initial"
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <header className="space-y-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Learn</p>
            <h2 className="font-serif text-2xl text-[#3E2F35]">Immerse in the lecture</h2>
          </header>
          <div className="space-y-8">
            {learnBlocks.map((block, index) => (
              <article key={`${block.heading ?? module.slug}-${index}`} className="space-y-4">
                {block.heading ? (
                  <h3 className="font-serif text-xl text-[#3E2F35]">{block.heading}</h3>
                ) : null}
                <div className="space-y-3 text-base leading-relaxed text-[#3E2F35]/80">
                  {splitParagraphs(block.body).map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
                {block.image ? (
                  <figure className="relative overflow-hidden rounded-2xl border border-[#E8E3E1] bg-[#FAF9F7]">
                    <div className="relative h-64 w-full">
                      <Image
                        src={block.image.src}
                        alt={block.image.alt ?? block.heading ?? module.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {block.image.caption ? (
                      <figcaption className="px-4 py-3 text-xs text-[#3E2F35]/70">{block.image.caption}</figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </article>
            ))}
          </div>
        </motion.section>
      </AnimatePresence>

      {applyTasks.length > 0 ? (
        <motion.section
          className="space-y-6 rounded-2xl border border-[#E8E3E1] bg-white p-6 shadow-[0_18px_40px_rgba(62,47,53,0.06)] md:p-8"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        >
          <header className="space-y-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Apply</p>
            <h2 className="font-serif text-2xl text-[#3E2F35]">Integrate the learning</h2>
          </header>
          <ul className="space-y-4 text-base leading-relaxed text-[#3E2F35]/82">
            {applyTasks.map((task, index) => (
              <li key={`${module.slug}-task-${index}`} className="flex items-start gap-3 rounded-xl bg-[#FAF9F7] px-4 py-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#D6C1C7] bg-white text-xs font-semibold text-[#D6C1C7]">
                  {index + 1}
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
          {module.content.journalPrompt ? (
            <div className="rounded-2xl border border-dashed border-[#D6C1C7] bg-[#FAF9F7] px-5 py-4 text-sm text-[#3E2F35]/75">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#D6C1C7]">Reflection prompt</p>
              <p className="mt-2">{module.content.journalPrompt}</p>
            </div>
          ) : null}
        </motion.section>
      ) : null}

      {module.content.insight ? (
        <motion.section
          className="rounded-2xl border border-[#E8E3E1] bg-[#FAF9F7] p-6 shadow-[0_18px_40px_rgba(62,47,53,0.05)] md:p-8"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Taylor-Made Insight</p>
          <p className="mt-3 text-lg leading-relaxed text-[#3E2F35]">{module.content.insight}</p>
        </motion.section>
      ) : null}

      {module.content.mentorNote ? (
        <motion.section
          className="rounded-2xl border border-[#D6C1C7] bg-[#EAD7DC]/80 px-6 py-6 shadow-[0_18px_40px_rgba(62,47,53,0.04)] md:px-8"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9B8C91]">Mentor Note</p>
          <blockquote className="mt-3 space-y-2 border-l-4 border-[#D6C1C7] pl-4 font-serif italic text-lg text-[#3E2F35]">
            <p>{module.content.mentorNote.text}</p>
            {module.content.mentorNote.author ? (
              <cite className="block text-sm not-italic text-[#3E2F35]/70">
                — {module.content.mentorNote.author}
                {module.content.mentorNote.role ? `, ${module.content.mentorNote.role}` : ""}
              </cite>
            ) : null}
          </blockquote>
        </motion.section>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <nav className="flex flex-col gap-3 rounded-2xl border border-[#E8E3E1] bg-white px-4 py-4 text-sm text-[#3E2F35] shadow-[0_18px_40px_rgba(62,47,53,0.05)] md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
          {previousModule ? (
            <Link
              href={`/academy/${previousModule.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E2F35]/80 transition hover:text-[#3E2F35]"
            >
              ← {previousModule.title}
            </Link>
          ) : (
            <span className="text-sm text-[#3E2F35]/50">Start of journey</span>
          )}
          {nextModule ? (
            <Link
              href={`/academy/${nextModule.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E2F35]/80 transition hover:text-[#3E2F35]"
            >
              {nextModule.title} →
            </Link>
          ) : (
            <span className="text-sm text-[#3E2F35]/50">You’ve reached the finale</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={localProgress.completed || submitting}
          className="inline-flex items-center justify-center rounded-full bg-[#3E2F35] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FAF9F7] transition hover:-translate-y-0.5 hover:bg-[#2C1F24] disabled:cursor-not-allowed disabled:bg-[#3E2F35]/60"
        >
          {localProgress.completed ? "Module Completed" : submitting ? "Marking…" : "Mark Complete"}
        </button>
      </nav>
    </div>
  );
}
