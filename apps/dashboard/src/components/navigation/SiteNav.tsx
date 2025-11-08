"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items: ReadonlyArray<SiteNavItem>;
  cta?: {
    label: string;
    href: string;
  } | null;
};

export default function SiteNav({ items, cta }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#EAD6DE]/60 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-semibold tracking-[0.2em] text-[#3E2F35]">
          Taylor-Made
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-6 text-sm font-semibold uppercase tracking-[0.3em] text-[#7A5A60]">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "transition",
                  active ? "text-[#3E2F35]" : "hover:text-[#3E2F35]/80",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          {cta ? (
            <Link
              href={cta.href}
              className="rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] transition hover:bg-[#C8A1B4]/15"
            >
              {cta.label}
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
