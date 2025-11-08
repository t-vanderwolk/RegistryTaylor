"use client";

import type { WorkbookEntry, WorkbookSectionState } from "@/types/workbook";

type WorkbookEntryCardProps = {
  entry: WorkbookEntry;
  moduleTitle?: string;
};

export default function WorkbookEntryCard({ entry, moduleTitle }: WorkbookEntryCardProps) {
  const sections = extractSections(entry.content?.sections ?? {});

  return (
    <article className="space-y-4 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Workbook entry</p>
          <h2 className="font-serif text-xl text-[#3E2F35] sm:text-2xl">
            {moduleTitle ?? formatModuleSlug(entry.moduleSlug)}
          </h2>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">
          <p>{new Date(entry.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
          <p>{entry.shared ? "Shared with mentor" : "Private"}</p>
        </div>
      </header>

      {sections.length === 0 ? (
        <p className="rounded-[1.75rem] border border-dashed border-[#C8A1B4]/40 bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]/70">
          No written reflections were captured for this module yet. Encourage your member to jot a quick note in the
          workbook drawer.
        </p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-[1.5rem] border border-[#C8A1B4]/30 bg-white/90 p-4 text-sm text-[#3E2F35]/75 shadow-inner"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">{section.label}</p>
              <p className="mt-2 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function extractSections(sections: Record<string, WorkbookSectionState>): Array<{ id: string; label: string; text: string }> {
  return Object.entries(sections)
    .map(([id, state], index) => {
      const text = extractText(state);
      if (!text) {
        return null;
      }
      return {
        id,
        label: `Reflection ${index + 1}`,
        text,
      };
    })
    .filter((entry): entry is { id: string; label: string; text: string } => Boolean(entry));
}

function extractText(state: WorkbookSectionState | undefined): string | null {
  if (!state) return null;
  if (state.reflection && state.reflection.trim()) {
    return state.reflection.trim();
  }
  if (state.text && state.text.trim()) {
    return state.text.trim();
  }
  if (state.checklist) {
    const entries = Object.entries(state.checklist);
    const completed = entries.filter(([, value]) => Boolean(value)).length;
    if (completed > 0) {
      return `Completed ${completed} of ${entries.length} checklist items.`;
    }
    if (entries.length > 0) {
      return "Checklist saved for later.";
    }
  }
  return state.completed ? "Marked as complete." : null;
}

function formatModuleSlug(slug: string): string {
  return slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
