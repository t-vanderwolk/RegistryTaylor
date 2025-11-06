"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

type ReflectionEntry = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  shared: boolean;
};

type CommunityHighlight = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
};

type ReflectionPanelProps = {
  reflections: ReflectionEntry[];
  communityHighlights: CommunityHighlight[];
};

export default function ReflectionPanel({ reflections, communityHighlights }: ReflectionPanelProps) {
  const [activeTab, setActiveTab] = useState<"mine" | "community">("mine");
  const [shareMode, setShareMode] = useState<"named" | "anonymous">("named");

  const displayList = useMemo(
    () => (activeTab === "mine" ? reflections : communityHighlights),
    [activeTab, reflections, communityHighlights]
  );

  return (
    <section className="rounded-2xl border border-blush-300/70 bg-ivory/95 p-8 shadow-mauve-card md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">
            Reflection & Community
          </p>
          <h2 className="mt-2 font-serif text-2xl text-charcoal-700 md:text-[2.1rem]">
            Gentle check-ins, shared softly
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-blush-300/60 bg-white/70 p-1 text-xs font-semibold uppercase tracking-[0.28em] text-charcoal-300">
          <button
            type="button"
            onClick={() => setActiveTab("mine")}
            className={`rounded-full px-4 py-1 transition duration-200 ease-bloom ${
              activeTab === "mine" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
            }`}
            aria-pressed={activeTab === "mine"}
          >
            My Reflections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`rounded-full px-4 py-1 transition duration-200 ease-bloom ${
              activeTab === "community" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
            }`}
            aria-pressed={activeTab === "community"}
          >
            Community Highlights
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-charcoal-400 md:text-base">
          Capture how this season feels and choose how we share it. Every reflection fuels concierge support and community empathy.
        </p>
        <div className="flex items-center gap-2 rounded-full border border-blush-300/60 bg-white/80 p-1 text-xs font-semibold uppercase tracking-[0.28em] text-charcoal-300">
          <button
            type="button"
            onClick={() => setShareMode("named")}
            className={`rounded-full px-3 py-1 transition duration-200 ease-bloom ${
              shareMode === "named" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
            }`}
            aria-pressed={shareMode === "named"}
          >
            Share w/ name
          </button>
          <button
            type="button"
            onClick={() => setShareMode("anonymous")}
            className={`rounded-full px-3 py-1 transition duration-200 ease-bloom ${
              shareMode === "anonymous" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
            }`}
            aria-pressed={shareMode === "anonymous"}
          >
            Share anonymously
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          {displayList.length === 0 ? (
            <div className="notebook-surface rounded-2xl border border-dashed border-blush-300/70 p-6 text-sm leading-relaxed text-charcoal-400 md:col-span-2">
              {activeTab === "mine"
                ? "You haven’t captured a reflection yet. Open the journal to jot down today’s thought or feeling."
                : "Community highlights will appear here once members choose to share. Check back soon for tender snippets."}
            </div>
          ) : (
            displayList.map((entry) => (
              <article
                key={entry.id}
                className="flex h-full flex-col gap-3 rounded-2xl border border-blush-300/70 bg-white/90 p-6 shadow-mauve-card"
              >
                <blockquote className="flex-1 space-y-2 text-charcoal-500">
                  <p className="font-serif text-lg leading-relaxed text-charcoal-700">“{entry.title}”</p>
                  <p className="text-sm leading-relaxed text-charcoal-400">{entry.excerpt}</p>
                </blockquote>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-charcoal-300">
                  <span>
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {activeTab === "mine" ? (
                    <span>{entry.shared ? "Shared" : "Private"}</span>
                  ) : (
                    <span>{(entry as CommunityHighlight).author}</span>
                  )}
                </div>
              </article>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/academy/workbook"
          className="academy-button justify-center gap-2 bg-mauve-500/90 text-white"
        >
          Open Reflection Studio
        </Link>
        <p className="text-xs leading-relaxed text-charcoal-300">
          Sharing mode set to {shareMode === "anonymous" ? "Anonymous" : "Named"} · switch anytime inside the journal.
        </p>
      </div>
    </section>
  );
}
