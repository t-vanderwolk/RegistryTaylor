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
    <section className="academy-card grid gap-8 p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:p-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">
          Workbook in motion
        </p>
        <h3 className="font-serif text-2xl text-charcoal-700 md:text-[2rem]">
          Capture reflections that sync with your concierge team
        </h3>
        <p className="text-sm leading-relaxed text-charcoal-500">
          Every lesson includes guided prompts to store in your dashboard. Attach inspiration, log decisions, and celebrate
          milestones—your mentor sees the updates instantly and keeps the concierge plan aligned.
        </p>
        <Link
          href="/dashboard/academy/workbook"
          className="academy-outline-button w-max gap-2 px-5 py-2"
        >
          View full workbook →
        </Link>
      </div>

      <div className="space-y-4">
        {highlights.length ? (
          highlights.map((item) => (
            <div
              key={item.slug}
              className="rounded-academy border border-blush-300/60 bg-white/90 px-5 py-4 text-sm text-charcoal-500 shadow-blush-soft"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-mauve-500">Workbook prompt</p>
              <h4 className="mt-2 font-serif text-lg text-charcoal-700">{item.title}</h4>
              {item.prompt ? <p className="mt-2 text-sm text-charcoal-400">{item.prompt}</p> : null}
              {item.sectionCount > 0 ? (
                <p className="mt-3 text-xs uppercase tracking-[0.28em] text-charcoal-300">
                  {item.sectionCount} guided sections inside
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-academy border border-blush-300/60 bg-white/80 px-5 py-4 text-sm text-charcoal-400">
            Workbook reflections unlock as you explore modules—start a lesson to see prompts populate here in real time.
          </div>
        )}
      </div>
    </section>
  );
}
