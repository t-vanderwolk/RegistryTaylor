import Link from "next/link";
import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";

type ModuleToolsSidebarProps = {
  module: AcademyModule;
  workbookHref: Route;
  reflectionHref?: Route;
};

const PDF_KEYWORDS = ["pdf", "download", "print", "worksheet"];

function collectDownloads(module: AcademyModule) {
  const resources = module.content.resources ?? [];
  return resources.filter((resource) =>
    PDF_KEYWORDS.some((keyword) => resource.toLowerCase().includes(keyword)),
  );
}

export default function ModuleToolsSidebar({
  module,
  workbookHref,
  reflectionHref = "/dashboard/member/journal" as Route,
}: ModuleToolsSidebarProps) {
  const downloads = collectDownloads(module).slice(0, 4);
  const mentorNote = module.content.mentorNote ?? null;

  return (
    <aside className="hidden md:block md:w-72 lg:w-80">
      <div className="md:sticky md:top-24 space-y-5 rounded-[2rem] border border-blush-300/70 bg-ivory/95 p-5 shadow-mauve-card">
        <div className="space-y-1">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-300">Tools</p>
          <h3 className="font-serif text-2xl text-charcoal-700">Chapter kit</h3>
        </div>

        <div className="space-y-3 rounded-2xl border border-blush-300/70 bg-white/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">Workbook</p>
          <p className="text-sm leading-relaxed text-charcoal-500">
            Capture prompts while the insight is fresh. Entries sync with mentors instantly.
          </p>
          <Link
            href={workbookHref}
            className="academy-button w-full justify-center gap-2 bg-mauve-500/90 text-white"
          >
            Open workbook
          </Link>
        </div>

        <div className="space-y-3 rounded-2xl border border-blush-300/70 bg-white/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">Reflection</p>
          <p className="text-sm leading-relaxed text-charcoal-500">
            Leave a two-minute note for yourself or your mentor.
          </p>
          <Link
            href={reflectionHref}
            className="academy-outline-button w-full justify-center gap-2 text-xs uppercase tracking-[0.32em]"
          >
            Open reflections
          </Link>
        </div>

        {downloads.length ? (
          <div className="space-y-3 rounded-2xl border border-blush-300/70 bg-white/95 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">Downloads</p>
            <ul className="space-y-2 text-sm text-charcoal-500">
              {downloads.map((item) => (
                <li key={item} className="rounded-2xl border border-blush-200/70 bg-ivory/90 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.32em] text-charcoal-300">PDF</p>
                  <p>{item}</p>
                  <Link
                    href={workbookHref}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-mauve-500"
                  >
                    View module →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-2 rounded-2xl border border-blush-300/70 bg-white/95 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">Mentor note</p>
          <p className="text-sm leading-relaxed text-charcoal-500">
            {mentorNote?.text ??
              "Leave a note for your mentor to review before the next salon. They’ll weave it into your concierge brief."}
          </p>
        </div>
      </div>
    </aside>
  );
}
