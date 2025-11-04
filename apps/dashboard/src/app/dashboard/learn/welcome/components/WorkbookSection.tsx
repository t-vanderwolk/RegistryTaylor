import Link from "next/link";
import type { AcademyModule } from "@/types/academy";

type WorkbookSectionProps = {
  modules: AcademyModule[];
};

function collectHighlights(modules: AcademyModule[]) {
  return modules
    .map((module) => {
      const sections = module.content.workbook ?? [];
      const prompt = module.workbookPrompt ?? module.content.journalPrompt ?? "";

      if (!prompt && sections.length === 0) {
        return null;
      }

      return {
        slug: module.slug,
        title: module.title,
        prompt,
        sectionCount: sections.length,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .slice(0, 4);
}

export default function WorkbookSection({ modules }: WorkbookSectionProps) {
  const highlights = collectHighlights(modules);

  return (
    <section className="grid gap-6 rounded-[2.75rem] border border-[#EED6D3] bg-white/95 p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:p-10">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35]/60">Workbook in motion</p>
        <h3 className="font-serif text-2xl text-[#3E2F35] md:text-[2rem]">
          Capture reflections that sync with your concierge team
        </h3>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75">
          Every lesson includes guided prompts to store in your dashboard. Attach inspiration, log decisions, and celebrate
          milestones—your mentor sees the updates instantly and keeps the concierge plan aligned.
        </p>
        <Link
          href="/dashboard/academy/workbook"
          className="inline-flex w-max items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/20"
        >
          View full workbook →
        </Link>
      </div>

      <div className="space-y-4">
        {highlights.length ? (
          highlights.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-[#EED6D3]/50 bg-[#FFFAF8] px-5 py-4 text-sm text-[#3E2F35]/80 shadow-[0_10px_25px_rgba(200,161,180,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Workbook prompt</p>
              <h4 className="mt-2 font-serif text-lg text-[#3E2F35]">{item.title}</h4>
              {item.prompt ? <p className="mt-2 text-sm text-[#3E2F35]/70">{item.prompt}</p> : null}
              {item.sectionCount > 0 ? (
                <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#3E2F35]/55">
                  {item.sectionCount} guided sections inside
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-[#EED6D3]/60 bg-[#FFFAF8] px-5 py-4 text-sm text-[#3E2F35]/70">
            Workbook reflections unlock as you explore modules—start a lesson to see prompts populate here in real time.
          </div>
        )}
      </div>
    </section>
  );
}
