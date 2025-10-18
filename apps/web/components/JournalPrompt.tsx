"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getReflection, saveReflection, shareReflection } from "../lib/api";
import { MentorFeedback } from "../lib/types";
import { cn } from "../lib/utils";

const SAVE_DEBOUNCE_MS = 600;

type JournalPromptProps = {
  moduleCode: string;
  prompt: string;
};

export function JournalPrompt({ moduleCode, prompt }: JournalPromptProps) {
  const [content, setContent] = useState("");
  const [reflectionId, setReflectionId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [feedback, setFeedback] = useState<MentorFeedback[]>([]);
  const [savingState, setSavingState] = useState<"idle" | "saving" | "saved">("idle");
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "shared" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceRef = useRef<number>();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const payload = await getReflection(moduleCode);
        if (!isMounted) return;
        if (payload?.reflection) {
          const current = payload.reflection;
          setContent(current.content);
          setIsAnonymous(current.is_anonymous);
          setIsShared(current.is_shared);
          setReflectionId(current.id);
          setFeedback(payload.feedback ?? []);
        }
      } catch (error) {
        console.error("Unable to load reflection", error);
      } finally {
        if (isMounted) {
          hasLoadedRef.current = true;
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [moduleCode]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    window.clearTimeout(debounceRef.current);
    setSavingState("saving");
    debounceRef.current = window.setTimeout(async () => {
      try {
        const reflection = await saveReflection({
          moduleCode,
          content,
          isAnonymous,
        });
        setReflectionId(reflection.id);
        setIsShared(reflection.is_shared);
        setSavingState("saved");
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to save reflection", error);
        setSavingState("idle");
        setErrorMessage("Unable to save reflection right now.");
      }
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(debounceRef.current);
  }, [content, isAnonymous, moduleCode]);

  useEffect(() => {
    if (savingState === "saved") {
      const timeout = window.setTimeout(() => setSavingState("idle"), 1200);
      return () => window.clearTimeout(timeout);
    }
    return () => undefined;
  }, [savingState]);

  const handleShare = async () => {
    setShareStatus("sharing");
    try {
      let targetId = reflectionId;
      if (!targetId) {
        const reflection = await saveReflection({
          moduleCode,
          content,
          isAnonymous,
        });
        setReflectionId(reflection.id);
        targetId = reflection.id;
      }
      if (!targetId) {
        throw new Error("Reflection not ready");
      }
      await shareReflection(targetId);
      setIsShared(true);
      setShareStatus("shared");
    } catch (error) {
      console.error("Unable to share reflection", error);
      setShareStatus("error");
    }
  };

  const shareLabel = useMemo(() => {
    if (shareStatus === "shared") return "Shared with community";
    if (shareStatus === "sharing") return "Sharing…";
    if (shareStatus === "error") return "Try sharing again";
    return isShared ? "Shared with community" : "Share to community";
  }, [shareStatus, isShared]);

  return (
    <section className="space-y-4 rounded-3xl border border-tmBlush/60 bg-white/95 px-6 py-7 shadow-soft md:px-10 md:py-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
          Reflect &amp; integrate
        </p>
        <h3 className="text-lg font-heading text-tmCharcoal md:text-xl">Journal Prompt</h3>
        <p className="text-sm text-tmCharcoal/75 md:max-w-2xl">{prompt}</p>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Capture reflections or ideas here."
        rows={6}
        className="w-full rounded-2xl border border-transparent bg-tmBlush/35 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/70 focus:bg-tmBlush/45 focus:outline-none focus:ring-2 focus:ring-tmGold/40"
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <input
            id="anonymous-toggle"
            type="checkbox"
            className="h-4 w-4 rounded border-tmMauve/40 text-tmMauve focus:ring-tmGold"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
          />
          <label htmlFor="anonymous-toggle" className="text-sm text-tmCharcoal/80">
            Share anonymously if posted to the community
          </label>
        </div>
        <p className="text-xs text-tmCharcoal/50">
          {savingState === "saving" && "Saving…"}
          {savingState === "saved" && "Saved"}
          {savingState === "idle" && "Auto-saves every few seconds."}
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={handleShare}
        disabled={shareStatus === "sharing" || isShared}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition",
            isShared
              ? "border border-transparent bg-tmBlush/50 text-tmMauve"
              : "border border-tmMauve/40 bg-white text-tmMauve hover:border-tmGold hover:text-tmGold",
            shareStatus === "sharing" && "opacity-60"
          )}
        >
          {shareLabel}
        </button>
        {shareStatus === "error" && (
          <span className="text-xs text-red-500/80">
            We couldn&apos;t share that just now. Please try again.
          </span>
        )}
      </div>

      {feedback.length > 0 ? (
        <div className="rounded-2xl bg-tmIvory/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Mentor reflections
          </p>
          <ul className="mt-3 space-y-3">
            {feedback.map((entry) => (
              <li key={entry.id} className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-tmCharcoal/85">
                {entry.content}
                <span className="mt-2 block text-xs text-tmCharcoal/50">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {errorMessage && <p className="text-xs text-red-500/80">{errorMessage}</p>}
    </section>
  );
}
