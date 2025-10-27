"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardTab } from "@/types/academy";

type DashboardNavProps = {
  orientation?: "horizontal" | "vertical";
};

const NAV_ITEMS: Array<{ label: string; href: string; tab: DashboardTab }> = [
  { label: "My Academy", href: "/dashboard/academy", tab: "academy" },
  { label: "My Registry", href: "/dashboard/registry", tab: "registry" },
  { label: "Community", href: "/dashboard/community", tab: "community" },
  { label: "Journal", href: "/dashboard/journal", tab: "journal" },
  { label: "Concierge", href: "/dashboard/concierge", tab: "concierge" },
];

function getCurrentTab(pathname: string): DashboardTab | null {
  const entry = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
  return entry?.tab ?? null;
}

export default function DashboardNav({ orientation = "vertical" }: DashboardNavProps) {
  const pathname = usePathname();
  const current = getCurrentTab(pathname);

  if (orientation === "horizontal") {
    return (
      <nav className="flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/75 shadow-inner">
        {NAV_ITEMS.map((item) => {
          const active = current === item.tab;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-3 py-1 transition",
                active
                  ? "bg-gradient-to-r from-[#C8A1B4] to-[#EAC9D1] text-[#3E2F35]"
                  : "hover:bg-[#FFFAF8] hover:text-[#3E2F35]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="grid gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
      {NAV_ITEMS.map((item) => {
        const active = current === item.tab;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-[1.5rem] px-4 py-3 transition",
              active
                ? "bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#FFFAF8] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.32)]"
                : "bg-white/70 text-[#3E2F35]/70 shadow-inner hover:bg-white hover:text-[#3E2F35]",
            ].join(" ")}
          >
            <span>{item.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        );
      })}
    </nav>
  );
}
