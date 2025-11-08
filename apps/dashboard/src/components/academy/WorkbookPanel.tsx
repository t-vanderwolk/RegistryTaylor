"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, NotebookPen, PanelsTopLeft } from "lucide-react";
import WorkbookSection from "@/components/academy/workbook/WorkbookSection";
import WorkbookSubmit from "@/components/academy/workbook/WorkbookSubmit";
import type { WorkbookSection as WorkbookSectionDefinition } from "@/types/academy";
import { getWorkbookEntry, upsertWorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import type { WorkbookContent, WorkbookEntry, WorkbookSectionState } from "@/types/workbook";

type WorkbookPanelProps = {
  moduleSlug: string;
  moduleTitle: string;
  sections: WorkbookSectionDefinition[];
};

const AUTO_SAVE_DELAY = 800;

export default function WorkbookPanel({ moduleSlug, moduleTitle, sections }: WorkbookPanelProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [entry, setEntry] = useState<WorkbookEntry | null>(null);
  const [sectionState, setSectionState] = useState<Record<string, WorkbookSectionState>>({});
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const existing = await getWorkbookEntry(moduleSlug);
      if (cancelled) return;
      setEntry(existing);
      const storedSections = (existing?.content as WorkbookContent | undefined)?.sections ?? {};
      const nextState: Record<string, WorkbookSectionState> = {};
      sections.forEach((section, index) => {
        const id = section.id ?? `section-${index}`;
        nextState[id] = storedSections[id] ?? defaultStateForSection(section);
      });
      setSectionState(nextState);
      if (existing?.updatedAt) {
        setLastSavedAt(new Date(existing.updatedAt));
      }
    }

    hydrate().catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, [moduleSlug, sections]);

  useEffect(() => {
    if (!hasChanges) {
      return;
    }
    setSaving(true);
    const timeout = window.setTimeout(async () => {
      try {
        const content: WorkbookContent = {
          sections: sectionState,
          lastSavedAt: new Date().toISOString(),
        };
        const saved = await upsertWorkbookEntry({
          moduleSlug,
          content,
          shared: entry?.shared ?? false,
        });
        setEntry(saved);
        setLastSavedAt(new Date(saved.updatedAt));
        setToast("Workbook saved ✨ — You’re one step closer!");
        setTimeout(() => setToast(null), 2500);
        setHasChanges(false);
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    }, AUTO_SAVE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [sectionState, hasChanges, moduleSlug, entry]);

  const progress = useMemo(() => {
    if (sections.length === 0) return 0;
    const actionable = sections.filter((section) => isActionableSection(section.type));
    if (actionable.length === 0) return 0;
    const completed = actionable.filter((section, index) => {
      const id = section.id ?? `section-${index}`;
      return isSectionComplete(section, sectionState[id]);
    }).length;
    return Math.round((completed / actionable.length) * 100);
  }, [sections, sectionState]);

  const handleSectionChange = useCallback(
    (sectionId: string, next: WorkbookSectionState) => {
      setSectionState((current) => ({
        ...current,
        [sectionId]: next,
      }));
      setHasChanges(true);
    },
    []
  );

  const requestImmediateSave = useCallback(() => {
    setSectionState((current) => ({ ...current }));
    setHasChanges(true);
  }, []);

  const handleExport = () => {
    const printable = window.open("", "_blank");
    if (!printable) return;
    const contentHtml = sections
      .map((section, index) => {
        const id = section.id ?? `section-${index}`;
        const state = sectionState[id] ?? {};
        const value =
  section.type === "checklist" && Array.isArray(section.items)
    ? section.items
        .map((item, idx) => `${state.checklist?.[String(idx)] ? "☑" : "☐"} ${item}`)
        .join("<br/>")
    : section.type === "text"
    ? state.text
    : "";
        return `<section style='margin-bottom:24px;font-family:"Nunito",sans-serif;color:#3E2F35;'>
          <h2 style='font-family:"Playfair Display",serif;font-size:20px;margin-bottom:8px;'>${section.title}</h2>
          <div style='white-space:pre-wrap;'>${value || "—"}</div>
        </section>`;
      })
      .join("\n");

    printable.document.write(`
      <html>
        <head>
          <title>${moduleTitle} · Workbook</title>
          <style>
            body { background:#F8F6F3; padding:32px; }
            h1 { font-family:"Playfair Display",serif; color:#3E2F35; }
            section { border-bottom:1px solid #EED6D3; padding-bottom:16px; }
          </style>
        </head>
        <body>
          <h1>${moduleTitle} · Workbook</h1>
          ${contentHtml}
        </body>
      </html>
    `);
    printable.document.close();
    printable.focus();
    printable.print();
  };

  const handleReflectSave = useCallback(async (value: string) => {
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleSlug, content: value }),
      });
    } catch (error) {
      console.error(error);
    }
  }, [moduleSlug]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-[#C8A6B6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-lg lg:hidden"
      >
        <PanelsTopLeft className="h-4 w-4" aria-hidden />
        Workbook
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col bg-[#F8F6F3] shadow-2xl lg:static lg:h-auto lg:max-w-full lg:bg-transparent lg:shadow-none"
          >
            <div className="flex items-center justify-between border-b border-[#C9B37B]/40 bg-[#EED6D3] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/60">Workbook</p>
                <h2 className="font-serif text-xl text-[#3E2F35]">{moduleTitle}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-xs uppercase tracking-[0.3em] text-[#3E2F35]/70">
                  <span>{progress}% complete</span>
                  {lastSavedAt ? <span>Saved {lastSavedAt.toLocaleTimeString()}</span> : null}
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A6B6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:bg-[#C8A6B6] hover:text-white"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Export
                </button>
                <button
                  type="button"
                  className="hidden rounded-full border border-[#C8A6B6] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#3E2F35] lg:inline-flex"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#3E2F35]">
                <NotebookPen className="h-4 w-4 text-[#C8A6B6]" aria-hidden />
                <span>Let’s put ideas into motion.</span>
              </div>

              <div className="space-y-5">
                {sections.map((section, index) => {
                  const id = section.id ?? `section-${index}`;
                  const state = sectionState[id] ?? defaultStateForSection(section);

                  if (section.type === "submit") {
                    return (
                  <WorkbookSubmit
                    key={id}
                    label={section.ctaLabel ?? "Save workbook"}
                    onClick={requestImmediateSave}
                    saving={saving}
                    saved={!hasChanges && !saving}
                  />
                    );
                  }

                  return (
                    <WorkbookSection
                      key={id}
                      section={section}
                      state={state}
                      onChange={(next) => handleSectionChange(id, next)}
                      onReflectSave={section.type === "reflection" ? handleReflectSave : undefined}
                    />
                  );
                })}
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#C8A6B6] bg-white px-5 py-3 text-sm font-semibold text-[#3E2F35] shadow-lg"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function defaultStateForSection(section: WorkbookSectionDefinition): WorkbookSectionState {
 if (section.type === "checklist" && Array.isArray(section.items)) {
  return {
    checklist: section.items.reduce<Record<string, boolean>>((acc, _item, index) => {
      acc[String(index)] = false;
      return acc;
    }, {}),
  };
}
  return {};
}

function isActionableSection(type: WorkbookSectionDefinition["type"]): boolean {
  return type === "checklist" || type === "text" || type === "reflection";
}

function isSectionComplete(
  section: WorkbookSectionDefinition,
  state: WorkbookSectionState | undefined
): boolean {
  if (!state) return false;

  switch (section.type) {
    case "checklist":
      if (!Array.isArray(section.items) || section.items.length === 0) return false;
      return section.items.every((_item, index) =>
        Boolean(state.checklist?.[String(index)])
      );

    case "text":
      return Boolean(state.text && state.text.trim().length > 0);

    case "reflection":
      return Boolean(state.reflection && state.reflection.trim().length > 0);

    default:
      return Boolean(state.completed);
  }
}
