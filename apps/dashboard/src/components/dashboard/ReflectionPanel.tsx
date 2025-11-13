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
    <section className="rounded-[1.75rem] border border-blush-300/70 bg-ivory/95 p-5 shadow-mauve-card">
      <div className="space-y-2">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-charcoal-300">
          Reflections
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-charcoal-700">
            Gentle check-ins
          </h2>
          <div className="flex items-center gap-1 rounded-full border border-blush-300/60 bg-white/80 p-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
            <button
              type="button"
              onClick={() => setActiveTab("mine")}
              className={`rounded-full px-2.5 py-1 transition ${
                activeTab === "mine" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
              }`}
              aria-pressed={activeTab === "mine"}
            >
              Mine
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={`rounded-full px-2.5 py-1 transition ${
                activeTab === "community" ? "bg-mauve-500 text-white shadow-blush-pill" : ""
              }`}
              aria-pressed={activeTab === "community"}
            >
              Community
            </button>
          </div>
        </div>
        <p className="text-sm leading-snug text-charcoal-500">
          Capture two-line snippets and decide if they stay private or join the village.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
        <span>Share mode</span>
        <button
          type="button"
          onClick={() => setShareMode("named")}
          className={`rounded-full border px-2 py-1 ${
            shareMode === "named" ? "border-mauve-500 text-mauve-600" : "border-transparent"
          }`}
          aria-pressed={shareMode === "named"}
        >
          Named
        </button>
        <button
          type="button"
          onClick={() => setShareMode("anonymous")}
          className={`rounded-full border px-2 py-1 ${
            shareMode === "anonymous" ? "border-mauve-500 text-mauve-600" : "border-transparent"
          }`}
          aria-pressed={shareMode === "anonymous"}
        >
          Anonymous
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-4 grid gap-3"
        >
          {displayList.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-blush-300/70 bg-white/80 p-4 text-sm leading-relaxed text-charcoal-400">
              {activeTab === "mine"
                ? "You haven’t captured a reflection yet. Open the journal to jot down today’s thought or feeling."
                : "Community highlights will appear here once members choose to share. Check back soon for tender snippets."}
            </div>
          ) : (
            displayList.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-2 rounded-[1.5rem] border border-blush-300/70 bg-white/90 p-4 shadow-mauve-card"
              >
                <blockquote className="flex-1 space-y-1 text-charcoal-500">
                  <p className="text-lg font-semibold tracking-tight text-charcoal-700 line-clamp-2">“{entry.title}”</p>
                  <p className="text-sm leading-snug text-charcoal-400 line-clamp-2">{entry.excerpt}</p>
                </blockquote>
                <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.28em] text-charcoal-300">
                  <span>
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>
                    {activeTab === "mine"
                      ? (entry as ReflectionEntry).shared
                        ? "Shared"
                        : "Private"
                      : (entry as CommunityHighlight).author}
                  </span>
                </div>
              </article>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/member/journal"
          className="academy-button justify-center gap-2 bg-mauve-500/90 text-white"
        >
          Open Reflection Studio
        </Link>
        <p className="text-xs leading-snug text-charcoal-400">
          Sharing mode set to {shareMode === "anonymous" ? "Anonymous" : "Named"} · switch anytime inside the journal.
        </p>
      </div>
    </section>
  );
}
