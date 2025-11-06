"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type { AcademyModule } from "@/types/academy";
import WorkbookEntryCard from "./WorkbookEntryCard";
import type { WorkbookContent, WorkbookEntry } from "./workbookApi";
import { fetchWorkbookEntries, upsertWorkbookEntry, updateShareState } from "./workbookApi";

type WorkbookSectionProps = {
  memberId: string;
  modules: AcademyModule[];
  initialEntries: WorkbookEntry[];
  initialModuleSlug?: string;
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

function statusLabel(state: SaveState) {
  switch (state) {
    case "dirty":
      return "Unsaved changes";
    case "saving":
      return "Saving…";
    case "saved":
      return "Saved";
    case "error":
      return "Unable to save";
    default:
      return "Up to date";
  }
}

export default function WorkbookSection({
  memberId,
  modules,
  initialEntries,
  initialModuleSlug,
}: WorkbookSectionProps) {
  const [entries, setEntries] = useState<WorkbookEntry[]>(initialEntries);
  const validInitialSlug = useMemo(
    () =>
      initialModuleSlug && modules.some((module) => module.slug === initialModuleSlug)
        ? initialModuleSlug
        : modules[0]?.slug ?? "",
    [initialModuleSlug, modules]
  );
  const [selectedSlug, setSelectedSlug] = useState<string>(validInitialSlug);
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  const [status, setStatus] = useState<SaveState>("idle");

  useEffect(() => {
    setSelectedSlug(validInitialSlug);
  }, [validInitialSlug]);

  const moduleOptions = useMemo(
    () =>
      modules.map((module) => ({
        slug: module.slug,
        label: module.title,
      })),
    [modules]
  );

  const entryForSelectedModule = useMemo(
    () => entries.find((entry) => entry.moduleSlug === selectedSlug) ?? null,
    [entries, selectedSlug]
  );

  useEffect(() => {
    if (!selectedSlug) return;
    if (entryForSelectedModule) {
      setText(entryForSelectedModule.content.text ?? "");
      setImages(entryForSelectedModule.content.images ?? []);
      setShared(entryForSelectedModule.shared);
      setStatus("idle");
    } else {
      setText("");
      setImages([]);
      setShared(false);
      setStatus("idle");
    }
  }, [entryForSelectedModule, selectedSlug]);

  useEffect(() => {
    if (status !== "saved") return;
    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImages((current) => [...current, reader.result as string]);
        setStatus("dirty");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, idx) => idx !== index));
    setStatus("dirty");
  };

  const handleSave = async () => {
    if (!selectedSlug) {
      setStatus("error");
      return;
    }

    setStatus("saving");
    const content: WorkbookContent = {
      text: text.trim() ? text : undefined,
      images: images.length ? images : undefined,
    };

    try {
      const entry = await upsertWorkbookEntry({
        moduleSlug: selectedSlug,
        content,
        shared,
      });
      setEntries((current) => {
        const existingIndex = current.findIndex((item) => item.moduleSlug === selectedSlug);
        if (existingIndex === -1) {
          return [entry, ...current];
        }
        const updated = [...current];
        updated[existingIndex] = entry;
        return updated;
      });
      setStatus("saved");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleShareToggle = async (nextShared: boolean) => {
    setShared(nextShared);
    setStatus("dirty");

    if (!entryForSelectedModule) {
      return;
    }

    try {
      const updated = await updateShareState(entryForSelectedModule.id, nextShared);
      setEntries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setStatus("saved");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const refreshEntries = async () => {
    const fresh = await fetchWorkbookEntries(memberId);
    setEntries(fresh);
  };

  return (
    <section className="space-y-10">
      <header className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Academy Workbook</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Capture reflections & inspiration
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Save notes, upload mood boards, and decide when to share with your mentor. Workbook entries keep concierge sessions
          focused on what matters most right now.
        </p>
      </header>

      <div className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Module</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
              {moduleOptions.find((module) => module.slug === selectedSlug)?.label ?? "Select a module"}
            </h2>
          </div>
          <button
            type="button"
            onClick={refreshEntries}
            className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Refresh entries
          </button>
        </div>

        <label className="space-y-2 text-sm text-[#3E2F35]/70">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Choose module</span>
          <select
            value={selectedSlug}
            onChange={(event) => {
              setSelectedSlug(event.target.value);
            }}
            className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
          >
            {moduleOptions.map((module) => (
              <option key={module.slug} value={module.slug}>
                {module.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-[#3E2F35]/70">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Reflection</span>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setStatus("dirty");
            }}
            rows={6}
            className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
            placeholder="Describe what resonated most, what still feels unclear, or the vibe you’re curating."
          />
        </label>

        <div className="space-y-2 text-sm text-[#3E2F35]/70">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Inspiration uploads</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]">
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <span className="text-xs text-[#3E2F35]/60">
              Add mood boards, product photos, or nursery sketches (stored securely in your workbook).
            </span>
          </div>
          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative h-48 overflow-hidden rounded-[1.5rem] border border-[#EAC9D1]/60 bg-[#FFFAF8]/70"
                >
                  <Image
                    src={src}
                    alt={`Workbook inspiration ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-3 top-3 rounded-full bg-[#FFFAF8]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 shadow"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <label className="flex items-center justify-between rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35]/75">
          <span className="font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Share with mentor</span>
          <input
            type="checkbox"
            checked={shared}
            onChange={(event) => handleShareToggle(event.target.checked)}
            className="h-5 w-5 rounded border-[#C8A1B4]/50 text-[#C8A1B4] focus:ring-[#D9C48E]"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <span
            className={[
              "text-xs font-semibold uppercase tracking-[0.3em]",
              status === "error"
                ? "text-red-600"
                : status === "dirty"
                ? "text-[#D9C48E]"
                : status === "saving"
                ? "text-[#C8A1B4]"
                : "text-[#3E2F35]/60",
            ].join(" ")}
          >
            {statusLabel(status)}
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-1 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
            disabled={status === "saving"}
          >
            Save workbook entry
          </button>
        </div>
      </div>

      <section className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Entries</p>
            <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Your workbook timeline</h2>
          </div>
          <span className="rounded-full bg-[#FFFAF8] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">
            {entries.length} saved
          </span>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#C8A1B4]/25 bg-[#FFFAF8] p-6 text-sm text-[#3E2F35]/70 shadow-inner">
            Begin with the module that’s top of mind. Your saved reflections will appear here and keep mentors in the loop
            ahead of concierge sessions.
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const moduleTitle =
                modules.find((module) => module.slug === entry.moduleSlug)?.title ?? entry.moduleSlug;
              return <WorkbookEntryCard key={entry.id} entry={entry} moduleTitle={moduleTitle} />;
            })}
          </div>
        )}
      </section>
    </section>
  );
}
