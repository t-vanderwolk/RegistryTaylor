"use client";

import { useState, useEffect } from "react";

type MentorNotesPanelProps = {
  initialNote: string;
  onSave: (value: string) => Promise<void>;
  onClose: () => void;
  saving: boolean;
};

export default function MentorNotesPanel({ initialNote, onSave, onClose, saving }: MentorNotesPanelProps) {
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNote(initialNote);
    setError(null);
  }, [initialNote]);

  const handleSave = async () => {
    try {
      setError(null);
      await onSave(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save note right now.");
    }
  };

  return (
    <div className="mt-4 space-y-3 rounded-3xl border border-[#C8A1B4]/40 bg-white/95 p-4 shadow-[0_18px_40px_rgba(200,161,180,0.18)]">
      <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">
        Mentor notes
      </label>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-[#C8A1B4]/30 bg-[#FFFAF8] p-3 text-sm text-[#3E2F35] shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A1B4]"
        placeholder="Capture concierge guidance, delivery timing, or gifting context…"
      />
      {error ? <p className="text-xs text-[#9F3D3D]">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFFAF8] shadow-[0_12px_28px_rgba(200,161,180,0.3)] transition hover:-translate-y-0.5 hover:bg-[#B98BA5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save note"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
