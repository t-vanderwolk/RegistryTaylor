"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { DashboardTab } from "@/types/academy";
import type { AppRoute } from "@/types/routes";

type DashboardNavProps = {
  orientation?: "horizontal" | "vertical";
};

type NavItem = { label: string; href: AppRoute; tab: DashboardTab };

const NAV_ITEMS = [
  { label: "Learn", href: "/dashboard/member/learn", tab: "learn" },
  { label: "Plan & Registry", href: "/dashboard/member/plan", tab: "plan" },
  { label: "Community", href: "/dashboard/member/community", tab: "connect" },
  { label: "Journal", href: "/dashboard/member/journal", tab: "journal" },
] satisfies ReadonlyArray<NavItem & { href: Route }>;

function getCurrentTab(pathname: string): DashboardTab | null {
  if (pathname.startsWith("/dashboard/member/learn")) {
    return "learn";
  }

  const direct = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  if (direct) {
    return direct.tab;
  }

  if (
    pathname.startsWith("/dashboard/academy") ||
    pathname.startsWith("/dashboard/member/learn")
  ) {
    return "learn";
  }

  if (
    pathname.startsWith("/dashboard/member/plan") ||
    pathname.startsWith("/dashboard/member/registry")
  ) {
    return "plan";
  }

  if (
    pathname.startsWith("/dashboard/member/community") ||
    pathname.startsWith("/dashboard/member/events")
  ) {
    return "connect";
  }

  if (pathname.startsWith("/dashboard/concierge")) {
    return "concierge";
  }

  if (pathname.startsWith("/dashboard/member/journal")) {
    return "journal";
  }

  return null;
}

export default function DashboardNav({ orientation = "vertical" }: DashboardNavProps) {
  const pathname = usePathname() ?? "";
  const current = getCurrentTab(pathname);

  if (orientation === "horizontal") {
    return (
      <nav className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-full border border-mauve-100 bg-white/90 px-2 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-500 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const active = current === item.tab;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "min-w-[8rem] snap-center rounded-full px-3 py-1 text-center transition",
                active ? "bg-mauve-500/15 text-mauve-600" : "hover:text-mauve-600",
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
    <nav className="grid gap-1 text-sm font-semibold text-charcoal-700">
      {NAV_ITEMS.map((item) => {
        const active = current === item.tab;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 transition-colors",
              active
                ? "border-mauve-500 bg-white text-mauve-700"
                : "bg-white text-charcoal-700 hover:text-mauve-700",
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
