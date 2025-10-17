"use client";

import { useEffect, useState } from "react";

export function JournalPrompt({ moduleCode, prompt }: { moduleCode: string; prompt: string }) {
  const storageKey = `tm-journal-${moduleCode}`;
  const [entry, setEntry] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setEntry(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, entry);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [entry, storageKey]);

  return (
    <div className="card-surface bg-white/95 px-6 py-7 space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve/70">
          Reflect &amp; integrate
        </p>
        <h3 className="text-lg font-semibold text-tmCharcoal">Journal Prompt</h3>
        <p className="text-sm text-tmCharcoal/75">{prompt}</p>
      </div>
      <textarea
        value={entry}
        onChange={(event) => setEntry(event.target.value)}
        placeholder="Capture reflections or ideas here—saved only on this device."
        rows={6}
        className="w-full rounded-2xl border border-transparent bg-tmBlush/35 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/70 focus:bg-tmBlush/45 focus:outline-none focus:ring-2 focus:ring-tmGold/40"
      />
      <p className="text-xs text-tmCharcoal/50">Saved locally · no one else can see this.</p>
    </div>
  );
}
