"use client";

import { useState } from "react";
import WorkbookInput from "./WorkbookInput";

type WorkbookReflectionProps = {
  prompt: string;
  value: string;
  onChange: (_next: string) => void;
  onSave?: (_value: string) => Promise<void>;
};

export default function WorkbookReflection({ prompt, value, onChange, onSave }: WorkbookReflectionProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = async () => {
    if (!onSave) return;
    setStatus("saving");
    try {
      await onSave(value);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[#EED6D3] bg-[#F8F6F3] p-4">
      <p className="font-sans text-sm italic text-[#3E2F35]/75">{prompt}</p>
      <WorkbookInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (status === "saved" || status === "error") {
            setStatus("idle");
          }
        }}
        rows={4}
        placeholder="Capture your observation…"
      />
      {onSave ? (
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-[#EED6D3] px-4 py-2 text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white"
            disabled={status === "saving"}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          <span>{status === "saved" ? "Saved" : status === "error" ? "Try again" : ""}</span>
        </div>
      ) : null}
    </div>
  );
}
