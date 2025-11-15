"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { AcademyModule } from "@/types/academy";

type SectionAnchor = {
  id: string;
  label: string;
};

type ModuleSidebarProps = {
  modules: AcademyModule[];
  activeSlug?: string | null;
  sectionAnchors?: SectionAnchor[];
  title?: string;
};

function getActiveSlug(pathname: string, provided?: string | null) {
  if (provided) {
    return provided;
  }
  const segments = pathname.split("/").filter(Boolean);
  return segments.at(-1) ?? null;
}

export default function ModuleSidebar({
  modules,
  activeSlug,
  sectionAnchors,
  title = "Academy modules",
}: ModuleSidebarProps) {
  const pathname = usePathname() ?? "";
  const currentSlug = getActiveSlug(pathname, activeSlug);

  return (
    <aside className="hidden md:block md:w-64 lg:w-72">
      <div className="md:sticky md:top-28 space-y-6 rounded-[2rem] border border-blush-300/70 bg-white/90 p-5 shadow-mauve-card">
        <div className="space-y-1">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-300">{title}</p>
          <h2 className="font-serif text-2xl text-charcoal-700">Journeys</h2>
        </div>

        <nav className="max-h-[50vh] overflow-y-auto pr-2">
          <ul className="space-y-1 text-sm text-charcoal-500">
            {modules.map((module) => {
              const href = `/dashboard/member/learn/${module.slug}` as Route;
              const active = currentSlug === module.slug;
              return (
                <li key={module.slug}>
                  <Link
                    href={href}
                    className={[
                      "flex flex-col rounded-2xl border px-3 py-2 transition duration-200",
                      active
                        ? "border-mauve-500/80 bg-mauve-500/10 text-charcoal-700 shadow-blush-soft"
                        : "border-transparent hover:border-blush-300 hover:bg-ivory/80",
                    ].join(" ")}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-300">
                      {module.journey ?? module.category ?? "Module"}
                    </span>
                    <span className="font-serif text-base">{module.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {sectionAnchors && sectionAnchors.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-300">
              On this page
            </p>
            <div className="space-y-2 text-sm text-charcoal-500">
              {sectionAnchors.map((anchor) => (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 transition hover:border-mauve-500/40 hover:bg-mauve-500/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-mauve-500/70" aria-hidden />
                  {anchor.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
