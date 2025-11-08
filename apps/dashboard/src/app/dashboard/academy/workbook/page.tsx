import Link from "next/link";
import { getAcademyModules } from "@/lib/academy";
import { apiFetch } from "@/lib/apiClient";
import { getSession, requireMember } from "@/lib/auth";
import type { WorkbookEntry } from "@/types/workbook";
import WorkbookEntryCard from "./WorkbookEntryCard";

export const metadata = {
  title: "Workbook Studio",
  description: "Capture reflections, organize checklists, and share updates with your mentor team.",
};

export default async function WorkbookStudioPage() {
  await requireMember();
  const session = await getSession();
  const modules = await getAcademyModules();

  let entries: WorkbookEntry[] = [];
  if (session?.token) {
    try {
      const data = await apiFetch<{ entries?: WorkbookEntry[] }>("/api/workbook?limit=8", {
        cache: "no-store",
        credentials: "include",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      entries = data.entries ?? [];
    } catch (error) {
      console.error("Unable to load workbook entries", error);
    }
  }

  const moduleTitleMap = new Map(modules.map((module) => [module.slug, module.title]));
  const highlightedModules = modules.slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Reflection Studio</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Save rituals, aha moments, and concierge notes
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Each academy chapter unlocks guided prompts. Capture what resonates, then decide if it stays private or flows to
          your mentor. This space keeps everything organized when life feels anything but.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="rounded-[2.5rem] border border-dashed border-[#C8A1B4]/40 bg-white/90 p-8 text-sm text-[#3E2F35]/70 shadow-inner">
              No saved reflections yet. Open an academy module and the workbook drawer will follow you with prompts tailored
              to that lesson.
            </div>
          ) : (
            entries.map((entry) => (
              <WorkbookEntryCard
                key={entry.id}
                entry={entry}
                moduleTitle={moduleTitleMap.get(entry.moduleSlug)}
              />
            ))
          )}
        </div>

        <aside className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Modules in bloom</p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Where to journal next</h2>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              Dive back into these concierge chapters—the workbook drawer saves automatically every time you type.
            </p>
          </div>

          <div className="space-y-4">
            {highlightedModules.map((module) => (
              <Link
                key={module.slug}
                href={`/dashboard/learn/${module.slug}`}
                className="block rounded-[1.75rem] border border-[#C8A1B4]/30 bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]/80 transition hover:-translate-y-0.5 hover:border-[#C8A1B4]/60 hover:shadow-[0_18px_38px_rgba(200,161,180,0.18)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/70">
                  {module.category ?? "Module"}
                </p>
                <p className="mt-1 font-serif text-lg text-[#3E2F35]">{module.title}</p>
                {module.summary ? <p className="mt-2 text-xs leading-relaxed text-[#3E2F35]/60">{module.summary}</p> : null}
              </Link>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-[#C8A1B4]/50 bg-[#FFFAF8] p-5 text-xs text-[#3E2F35]/70">
            Workbook entries auto-save every few seconds. Toggle “Share with mentor” inside the drawer to surface updates in
            mentor dashboards instantly.
          </div>
        </aside>
      </section>
    </div>
  );
}
