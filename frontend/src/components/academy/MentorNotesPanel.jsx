import React, { useEffect, useMemo, useState } from "react";

const extractNote = (notes) => {
  if (!notes) return "";
  if (typeof notes === "string") return notes;
  return notes.note ?? notes.text ?? "";
};

const MentorNotesPanel = ({
  entry,
  onSave,
  isSaving = false,
  disabled = false,
}) => {
  const [draft, setDraft] = useState(extractNote(entry?.mentor_notes));
  const [status, setStatus] = useState("idle");

  const lastUpdatedLabel = useMemo(() => {
    if (!entry?.updated_at) return null;
    try {
      const updatedDate = new Date(entry.updated_at);
      return updatedDate.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  }, [entry?.updated_at]);

  useEffect(() => {
    setDraft(extractNote(entry?.mentor_notes));
  }, [entry?.id, entry?.mentor_notes]);

  useEffect(() => {
    if (isSaving) {
      setStatus("saving");
    }
  }, [isSaving]);

  const handleBlur = async () => {
    if (!onSave || disabled) return;
    const original = extractNote(entry?.mentor_notes);
    if (draft.trim() === original.trim()) {
      setStatus(original ? "saved" : "idle");
      return;
    }
    try {
      setStatus("saving");
      await onSave({
        note: draft.trim(),
      });
      setStatus("saved");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section className="rounded-[1.75rem] border border-gold/20 bg-gold/10 p-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-gold">Mentor Notes</p>
          <p className="text-sm font-body text-charcoal/70">Leave a reflection for this prompt</p>
        </div>
        {lastUpdatedLabel && (
          <span className="text-[0.6rem] font-heading uppercase tracking-[0.28em] text-charcoal/40">
            Updated {lastUpdatedLabel}
          </span>
        )}
      </header>
      <textarea
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setStatus("editing");
        }}
        onBlur={handleBlur}
        placeholder="Capture concierge cues, upcoming actions, or tone notes for this journal entry."
        className="min-h-[120px] w-full rounded-2xl border border-gold/30 bg-white/80 px-4 py-3 text-sm font-body text-charcoal shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/20"
        disabled={disabled || isSaving}
      />
      <footer className="mt-2 flex items-center justify-between text-[0.65rem] font-heading uppercase tracking-[0.32em]">
        <span
          className={
            status === "error"
              ? "text-red-400"
              : status === "saved"
              ? "text-mauve"
              : status === "saving"
              ? "text-charcoal/50"
              : "text-charcoal/40"
          }
        >
          {status === "error"
            ? "Save failed. Retry?"
            : status === "saving"
            ? "Saving..."
            : status === "saved"
            ? "Saved"
            : status === "editing"
            ? "Unsaved changes"
            : "Auto-save ready"}
        </span>
        {isSaving && (
          <span className="text-charcoal/50">⌛</span>
        )}
      </footer>
    </section>
  );
};

export default MentorNotesPanel;
