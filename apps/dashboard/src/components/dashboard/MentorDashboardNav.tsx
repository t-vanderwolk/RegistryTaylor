"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { AppRoute } from "@/types/routes";

type NavOrientation = "horizontal" | "vertical";

type MentorDashboardNavProps = {
  orientation?: NavOrientation;
};

type NavItem = {
  label: string;
  href: AppRoute;
};

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/mentor" },
  { label: "Mentees", href: "/dashboard/mentor/mentees" },
  { label: "Events", href: "/dashboard/mentor/events" },
  { label: "Analytics", href: "/dashboard/mentor/analytics" },
] satisfies ReadonlyArray<NavItem & { href: Route }>;

export default function MentorDashboardNav({ orientation = "vertical" }: MentorDashboardNavProps) {
  const pathname = usePathname() ?? "";

  if (orientation === "horizontal") {
    return (
      <nav className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-charcoal-700 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-3 py-1 transition-colors",
                active
                  ? "text-mauve-700 underline decoration-2 decoration-mauve-700 underline-offset-4"
                  : "text-charcoal-700 hover:text-mauve-700",
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
    <nav className="grid gap-2 text-sm font-semibold text-charcoal-700">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition-colors",
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
