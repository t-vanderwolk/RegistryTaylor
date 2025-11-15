"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ReflectBlockProps = {
  prompt: string;
  heading?: string;
  initialValue?: string;
  onSave?: (_value: string) => Promise<void>;
};

export default function ReflectBlock({ prompt, heading, initialValue = "", onSave }: ReflectBlockProps) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = async () => {
    if (!onSave) return;
    const trimmed = value.trim();
    if (!trimmed) {
      setStatus("idle");
      return;
    }
    setStatus("saving");
    try {
      await onSave(trimmed);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="space-y-3 rounded-3xl border border-[#C8A6B6] bg-white p-5">
      <header className="flex items-start gap-3 text-[#3E2F35]">
        <span className="font-serif text-xl">{heading ?? "Reflect"}</span>
      </header>
      <p className="border-l-2 border-[#C8A6B6] pl-4 font-sans italic text-[#3E2F35]/75">{prompt}</p>
      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (status === "saved" || status === "error") {
            setStatus("idle");
          }
        }}
        rows={4}
        className="w-full rounded-2xl border border-[#EED6D3] bg-[#F8F6F3] px-4 py-3 font-sans text-sm text-[#3E2F35] focus:border-[#C8A6B6] focus:outline-none focus:ring-1 focus:ring-[#C8A6B6]"
        placeholder="Capture what surfaced for you…"
      />
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/60">
        <motion.button
          type="button"
          onClick={handleSave}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#EED6D3] px-4 py-2 text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Save reflection"}
        </motion.button>
        <span>
          {status === "saved" ? "Saved" : status === "error" ? "Try again" : ""}
        </span>
      </div>
    </section>
  );
}
