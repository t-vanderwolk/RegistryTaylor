"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getWorkbookEntry, upsertWorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import type { WorkbookContent, WorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import { journalPrompts } from "@/data/journalPrompts";

const HUMOR_EMOJI = "🍼";

type ModuleWorkbookPanelProps = {
  moduleSlug: string;
  moduleTitle: string;
  prompt?: string;
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export default function ModuleWorkbookPanel({ moduleSlug, moduleTitle, prompt }: ModuleWorkbookPanelProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<WorkbookEntry | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const playfulPrompt = useMemo(() => {
    if (journalPrompts.length === 0) return null;
    const index = Math.abs(hashString(moduleSlug)) % journalPrompts.length;
    return journalPrompts[index];
  }, [moduleSlug]);

  useEffect(() => {
    let cancelled = false;
    async function loadEntry() {
      const existing = await getWorkbookEntry(moduleSlug);
      if (cancelled) return;
      setEntry(existing);
      const content = (existing?.content as WorkbookContent | undefined) ?? {};
      const initialText = content.text ?? "";
      setText(initialText);
      setStatus(initialText ? "saved" : "idle");
    }

    loadEntry().catch(() => {
      if (!cancelled) {
        setError("We couldn’t load your workbook entry. Try refreshing the page.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [moduleSlug]);

  const handleChange = (value: string) => {
    setText(value);
    setStatus("dirty");
    setError(null);
  };

  const handleSave = async () => {
    if (status === "saving") return;
    setStatus("saving");
    setError(null);

    try {
      const updated = await upsertWorkbookEntry({
        moduleSlug,
        content: { text: text.trim() } satisfies WorkbookContent,
        shared: false,
      });
      setEntry(updated);
      setStatus("saved");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("We couldn’t save your workbook entry. Please try again.");
      setStatus("error");
    }
  };

  const lastSavedAt = entry ? new Date(entry.updatedAt) : null;

  return (
    <div className="space-y-6 rounded-2xl bg-taupe p-6 text-sm text-charcoal-500 shadow-sm">
      <header className="space-y-2 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-700">Workbook · Private</p>
        <h3 className="font-serif text-2xl text-charcoal-700">My reflections for {moduleTitle}</h3>
        <p className="text-[15px] leading-relaxed text-charcoal-500">
          Only you can see your workbook entries — this is your safe space to track progress and capture what matters most.
        </p>
      </header>

      <div className="space-y-3 rounded-2xl border border-gold/40 bg-ivory p-5">
        {prompt ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-700">Module prompt</p>
            <p className="mt-2 font-sans text-[17px] leading-[1.7] text-charcoal-500">{prompt}</p>
          </div>
        ) : null}
        {playfulPrompt ? (
          <div className="rounded-xl bg-white p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve-700">Daily spark {HUMOR_EMOJI}</p>
            <p className="mt-2 font-sans text-[16px] leading-[1.7] text-charcoal-500">{playfulPrompt.text}</p>
          </div>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-mauve-700">Your entry</label>
        <textarea
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          rows={6}
          className="mt-3 w-full rounded-2xl border border-mauve-100 bg-white px-4 py-3 font-sans text-[16px] leading-relaxed text-charcoal-700 focus:border-mauve-500 focus:outline-none focus:ring-1 focus:ring-mauve-500"
          placeholder="Write what’s true today..."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-500">
        <div>
          {error ? (
            <span className="text-mauve-700">{error}</span>
          ) : status === "saved" ? (
            <span className="text-mauve-700">Saved</span>
          ) : status === "saving" ? (
            <span>Saving…</span>
          ) : status === "dirty" ? (
            <span>Unsaved changes</span>
          ) : lastSavedAt ? (
            <span>Last saved {lastSavedAt.toLocaleString()}</span>
          ) : (
            <span>Draft in progress</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center rounded-full bg-mauve-500 px-4 py-2 text-white transition hover:bg-mauve-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "saving"}
        >
          Save entry
        </button>
      </div>
    </div>
  );
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
