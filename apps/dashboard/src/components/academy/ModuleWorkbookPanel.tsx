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
    <div className="space-y-6 rounded-3xl border border-[#EED6D3] bg-white p-6 text-sm text-[#3E2F35]">
      <header className="space-y-2 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Workbook · Private</p>
        <h3 className="font-serif text-2xl text-[#3E2F35]">My reflections for {moduleTitle}</h3>
        <p className="text-[15px] leading-relaxed text-[#3E2F35]/75">
          Only you can see your workbook entries — this is your safe space to track progress and capture what matters most.
        </p>
      </header>

      <div className="space-y-3 rounded-2xl border border-[#EED6D3] bg-[#F8F6F3] p-5">
        {prompt ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Module prompt</p>
            <p className="mt-2 font-sans text-[17px] leading-[1.7] text-[#3E2F35]/85">{prompt}</p>
          </div>
        ) : null}
        {playfulPrompt ? (
          <div className="rounded-xl border border-[#EED6D3] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Daily spark {HUMOR_EMOJI}</p>
            <p className="mt-2 font-sans text-[16px] leading-[1.7] text-[#3E2F35]/85">{playfulPrompt.text}</p>
          </div>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Your entry</label>
        <textarea
          value={text}
          onChange={(event) => handleChange(event.target.value)}
          rows={6}
          className="mt-3 w-full rounded-2xl border border-[#EED6D3] bg-white px-4 py-3 font-sans text-[16px] leading-relaxed text-[#3E2F35] focus:border-[#C8A6B6] focus:outline-none focus:ring-1 focus:ring-[#C8A6B6]"
          placeholder="Write what’s true today..."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
        <div>
          {error ? (
            <span className="text-[#C8A6B6]">{error}</span>
          ) : status === "saved" ? (
            <span className="text-[#C8A6B6]">Saved</span>
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
          className="inline-flex items-center rounded-full bg-[#EED6D3] px-4 py-2 text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white disabled:cursor-not-allowed disabled:bg-[#EED6D3]/70"
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
