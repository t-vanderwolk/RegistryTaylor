"use client";

import { useMemo } from "react";
import type { WorkbookEntry } from "@/types/workbook";
import WorkbookEntryCard from "@/app/dashboard/academy/workbook/WorkbookEntryCard";

type MentorWorkbookViewProps = {
  entries: WorkbookEntry[];
  memberName?: string;
};

export default function MentorWorkbookView({ entries, memberName }: MentorWorkbookViewProps) {
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [entries]
  );

  return (
    <section className="space-y-8">
      <header className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor view</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Workbook reflections{memberName ? ` · ${memberName}` : ""}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Review shared entries to tailor concierge sessions. Add notes below each reflection to capture follow-up ideas or
          next steps for your mentee.
        </p>
      </header>

      {sortedEntries.length === 0 ? (
        <div className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/90 p-8 text-sm text-[#3E2F35]/70 shadow-inner">
          No shared workbook entries yet. Encourage your member to mark reflections as “Share with mentor” inside their
          academy workbook.
        </div>
      ) : (
        <div className="space-y-8">
          {sortedEntries.map((entry) => (
            <div key={entry.id} className="space-y-4">
              <WorkbookEntryCard entry={entry} moduleTitle={entry.moduleSlug} />
              <label className="block space-y-2 rounded-[1.5rem] border border-[#C8A1B4]/35 bg-[#FFFAF8] p-4 text-xs text-[#3E2F35]/65">
                <span className="font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Mentor notes</span>
                <textarea
                  rows={3}
                  placeholder="Coming soon — add notes for follow-up during concierge sessions."
                  className="w-full rounded-[1rem] border border-[#C8A1B4]/40 bg-white/95 px-3 py-2 text-sm text-[#3E2F35]/75 outline-none"
                  disabled
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
