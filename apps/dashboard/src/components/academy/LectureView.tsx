"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Feather,
  Lightbulb,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import type { ModuleContentBlock, MentorNote } from "@/types/academy";

const insightIcon = <Lightbulb className="h-4 w-4 text-[#C8A6B6]" aria-hidden />;
const tipIcon = <Sparkles className="h-4 w-4 text-[#C8A6B6]" aria-hidden />;
const reflectIcon = <Feather className="h-4 w-4 text-[#C8A6B6]" aria-hidden />;

type LectureViewProps = {
  blocks: ModuleContentBlock[];
  applyTasks: string[];
  journalPrompt?: string;
  insight?: string | null;
  mentorNote?: MentorNote | null;
  onMarkComplete: () => void;
  completed: boolean;
  submitting: boolean;
};

function splitParagraphs(body: string): string[] {
  return body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function LectureView({
  blocks,
  applyTasks,
  journalPrompt,
  insight,
  mentorNote,
  onMarkComplete,
  completed,
  submitting,
}: LectureViewProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-8">
        {blocks.map((block, index) => {
          const paragraphs = splitParagraphs(block.body);
          const isTip = (block.type ?? "").toLowerCase() === "tip" || /tip/i.test(block.heading ?? "");
          const isQuote = (block.type ?? "").toLowerCase() === "quote";

          return (
            <article
              key={`${block.heading ?? "section"}-${index}`}
              className="space-y-4"
            >
              {block.heading ? (
                <header className="space-y-2">
                  <h3 className="inline-flex items-center gap-2 font-serif text-2xl text-[#3E2F35]">
                    <span>{block.heading}</span>
                    {isTip ? tipIcon : null}
                  </h3>
                  <span className="block h-[2px] w-16 bg-[#C8A6B6]" aria-hidden />
                  {block.subheading ? (
                    <p className="text-sm text-[#3E2F35]/70">{block.subheading}</p>
                  ) : null}
                </header>
              ) : null}

              <div className="space-y-4 text-base leading-relaxed text-[#3E2F35]/85">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <Fragment key={paragraphIndex}>
                    {isQuote ? (
                      <blockquote className="border-l-2 border-[#C8A6B6] pl-4 italic text-[#3E2F35]">{paragraph}</blockquote>
                    ) : isTip ? (
                      <div className="flex items-start gap-3 rounded-2xl border border-[#EED6D3] bg-white p-4 text-[#3E2F35]">
                        {tipIcon}
                        <p>{paragraph}</p>
                      </div>
                    ) : (
                      <p>{paragraph}</p>
                    )}
                  </Fragment>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {applyTasks.length > 0 ? (
        <section className="space-y-4 rounded-3xl border border-[#EED6D3] bg-white p-5">
          <header className="flex items-center gap-2">
            {insightIcon}
            <h4 className="font-serif text-xl text-[#3E2F35]">Apply these rituals</h4>
          </header>
          <ul className="space-y-3 text-sm leading-relaxed text-[#3E2F35]/85">
            {applyTasks.map((task, index) => (
              <li key={task} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#C8A6B6] text-xs font-semibold text-[#3E2F35]">
                  {index + 1}
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {journalPrompt ? (
        <section className="space-y-3 rounded-3xl border border-[#EED6D3] bg-[#F8F6F3] p-5">
          <header className="flex items-center gap-2 text-[#3E2F35]">
            {reflectIcon}
            <h4 className="font-serif text-xl">Reflect prompt</h4>
          </header>
          <p className="border-l-2 border-[#C8A6B6] pl-4 font-sans italic text-[#3E2F35]/80">{journalPrompt}</p>
        </section>
      ) : null}

      {insight ? (
        <section className="space-y-3 rounded-3xl border border-[#EED6D3] bg-white p-5">
          <header className="flex items-center gap-2 text-[#3E2F35]">
            {insightIcon}
            <h4 className="font-serif text-xl">Taylor-made insight</h4>
          </header>
          <p className="text-sm leading-relaxed text-[#3E2F35]/85">{insight}</p>
        </section>
      ) : null}

      {mentorNote ? (
        <section className="space-y-3 rounded-3xl border border-[#C8A6B6] bg-[#EED6D3]/50 p-5">
          <header className="flex items-center gap-2 text-[#3E2F35]">
            <NotebookPen className="h-4 w-4" aria-hidden />
            <h4 className="font-serif text-xl">Mentor note</h4>
          </header>
          <p className="font-serif italic text-[#3E2F35]">{mentorNote.text}</p>
          {mentorNote.author ? (
            <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
              — {mentorNote.author}
              {mentorNote.role ? `, ${mentorNote.role}` : ""}
            </p>
          ) : null}
        </section>
      ) : null}

      <div className="flex flex-col gap-3 rounded-3xl border border-[#C8A6B6] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#3E2F35]">
          <AnimatePresence initial={false}>
            {completed ? (
              <motion.span
                key="complete"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8A6B6]/20"
              >
                <CheckCircle2 className="h-5 w-5 text-[#C8A6B6]" aria-hidden />
              </motion.span>
            ) : (
              <motion.span
                key="incomplete"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EED6D3]"
              >
                <Feather className="h-4 w-4 text-[#3E2F35]" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">Lesson status</p>
            <p>{completed ? "Lesson marked complete" : "Ready when you are"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={completed || submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EED6D3] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white disabled:cursor-not-allowed disabled:bg-[#EED6D3]/70"
        >
          {completed ? "Completed" : submitting ? "Saving…" : "Mark lesson complete"}
        </button>
      </div>
    </div>
  );
}
