import Link from "next/link";
import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";

type PDFDownloadsProps = {
  modules: AcademyModule[];
};

const PDF_KEYWORDS = ["pdf", "download", "print", "worksheet"];

function collectDownloads(modules: AcademyModule[]) {
  return modules.flatMap((module) => {
    const resources = module.content.resources ?? [];
    return resources
      .map((resource) => {
        const lower = resource.toLowerCase();
        const matchesKeyword = PDF_KEYWORDS.some((keyword) => lower.includes(keyword));
        if (!matchesKeyword) {
          return null;
        }
        return {
          moduleTitle: module.title,
          slug: module.slug,
          description: resource,
        };
      })
      .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource));
  });
}

export default function PDFDownloads({ modules }: PDFDownloadsProps) {
  const downloads = collectDownloads(modules);

  if (!downloads.length) {
    return null;
  }

  return (
    <section className="academy-card space-y-6 px-8 py-8 md:px-12 md:py-10">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-mauve-500/80">Printable support</p>
        <h3 className="font-serif text-2xl text-charcoal-700 md:text-[2rem]">
          Download concierge checklists and rituals for offline moments
        </h3>
        <p className="text-sm leading-relaxed text-charcoal-500">
          Save PDFs to bring into coaching sessions, stick on the fridge, or share with your partner. They stay synced to
          your concierge record when you log reflections after each ritual.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {downloads.map((item) => (
          <div
            key={`${item.slug}-${item.description}`}
            className="rounded-academy border border-blush-300/60 bg-white px-5 py-4 text-sm text-charcoal-500 shadow-blush-soft"
          >
            <h4 className="font-semibold text-charcoal-600">{item.moduleTitle}</h4>
            <p className="mt-2 text-sm text-charcoal-400">{item.description}</p>
            <Link
              href={`/dashboard/member/learn/${item.slug}` as Route}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-mauve-500 transition hover:text-charcoal-500"
            >
              Open module →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
