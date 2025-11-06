'use client';

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

type RequestSessionFormProps = {
  mentorId: string;
  mentorName: string;
  memberName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RequestSessionForm({
  mentorId,
  mentorName,
  memberName,
  onClose,
  onSuccess,
}: RequestSessionFormProps) {
  const [focusArea, setFocusArea] = useState("");
  const [preferredTiming, setPreferredTiming] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mentorId) {
      setErrorMessage("Unable to identify your mentor. Please try again shortly.");
      return;
    }

    setPending(true);
    setErrorMessage(null);

    const content = [
      `Session request from ${memberName}`,
      focusArea ? `Focus: ${focusArea}` : null,
      preferredTiming ? `Preferred timing: ${preferredTiming}` : null,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: mentorId,
          content: content || "I'd love to schedule a new mentor session.",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Unable to send your request.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your request.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3E2F35]/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg rounded-[2.2rem] border border-[#EAD6DE] bg-[#FFFAF8]/95 p-8 shadow-[0_32px_70px_rgba(200,161,180,0.28)]"
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/55">
            Request a mentor session
          </p>
          <h2 className="text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
            Coordinate with {mentorName}
          </h2>
          <p className="text-sm text-[#3E2F35]/65">
            Share the focus for your next concierge touchpoint and your preferred timing. The team
            will follow up inside Messages.
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm text-[#3E2F35]">
            <span className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/60">
              Focus for this session
            </span>
            <input
              value={focusArea}
              onChange={(event) => setFocusArea(event.target.value)}
              placeholder="Registry curation, nursery flow, postpartum planning…"
              className="mt-2 w-full rounded-[1.5rem] border border-[#D9C48E]/50 bg-[#FFFAF8]/90 px-4 py-3 text-sm text-[#3E2F35] shadow-inner focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]/60"
            />
          </label>

          <label className="block text-sm text-[#3E2F35]">
            <span className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/60">
              Preferred timing
            </span>
            <input
              value={preferredTiming}
              onChange={(event) => setPreferredTiming(event.target.value)}
              placeholder="Next week, weekday evenings, ASAP…"
              className="mt-2 w-full rounded-[1.5rem] border border-[#D9C48E]/50 bg-[#FFFAF8]/90 px-4 py-3 text-sm text-[#3E2F35] shadow-inner focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]/60"
            />
          </label>

          <label className="block text-sm text-[#3E2F35]">
            <span className="text-xs uppercase tracking-[0.32em] text-[#3E2F35]/60">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Anything you’d like your mentor team to prep. Links, photos, or rituals you’re exploring…"
              className="mt-2 w-full resize-none rounded-[1.5rem] border border-[#D9C48E]/50 bg-[#FFFAF8]/90 px-4 py-3 text-sm text-[#3E2F35] shadow-inner focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]/60"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-[1.4rem] border border-[#D97373]/35 bg-[#FFF5F4] px-4 py-2 text-xs text-[#5C2E2E]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-tm-rose px-5 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover disabled:translate-y-0 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
            >
              {pending ? "Sending…" : "Send Request"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4]/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#3E2F35] transition hover:bg-[#FFFAF8]"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
