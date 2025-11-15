"use client";

import type { Route } from "next";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MEMBER_DASHBOARD_ROUTES } from "@/constants/memberDashboardRoutes";

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
    <section className="rounded-2xl border border-mauve-200/60 bg-ivory/95 p-5 shadow-mauve-card md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8 md:rounded-[2rem] md:p-8">
      <div className="space-y-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-mauve-600">
          Reflections
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-[var(--font-playfair)] text-2xl text-charcoal-700">
            Gentle check-ins
          </h2>
          <div className="flex items-center gap-1 rounded-full border border-mauve-200/70 bg-white/80 p-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
            <button
              type="button"
              onClick={() => setActiveTab("mine")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeTab === "mine" ? "bg-mauve-500 text-white shadow-blush-pill" : "",
              ].join(" ")}
              aria-pressed={activeTab === "mine"}
            >
              Mine
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={[
                "rounded-full px-3 py-1.5 transition",
                activeTab === "community" ? "bg-mauve-500 text-white shadow-blush-pill" : "",
              ].join(" ")}
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

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
          <span>Share mode</span>
          <button
            type="button"
            onClick={() => setShareMode("named")}
            className={`rounded-full border px-3 py-1.5 transition ${
              shareMode === "named" ? "border-mauve-500 text-mauve-600" : "border-transparent"
            }`}
            aria-pressed={shareMode === "named"}
          >
            Named
          </button>
          <button
            type="button"
            onClick={() => setShareMode("anonymous")}
            className={`rounded-full border px-3 py-1.5 transition ${
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
            className="grid gap-3"
          >
            {displayList.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-mauve-200/70 bg-white/80 p-4 text-sm leading-relaxed text-charcoal-400">
                {activeTab === "mine"
                  ? "You haven’t captured a reflection yet. Open the journal to jot down today’s thought or feeling."
                  : "Community highlights will appear here once members choose to share. Check back soon for tender snippets."}
              </div>
            ) : (
              displayList.map((entry) => (
                <article
                  key={entry.id}
                  className="flex flex-col gap-2 rounded-[1.5rem] border border-mauve-200/70 bg-white/90 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-mauve-card"
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
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 md:flex-col md:items-stretch md:justify-start md:gap-4">
        <Link
          href={MEMBER_DASHBOARD_ROUTES.journal as Route}
          className="inline-flex items-center justify-center rounded-full bg-mauve-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-mauve-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-300/60"
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
