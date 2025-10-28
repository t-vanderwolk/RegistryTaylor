"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { AppRoute } from "@/types/routes";

type NavOrientation = "horizontal" | "vertical";

type AdminDashboardNavProps = {
  orientation?: NavOrientation;
};

type NavItem = {
  label: string;
  href: AppRoute;
};

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Invites", href: "/dashboard/admin/invites" },
  { label: "Mentors", href: "/dashboard/admin/mentors" },
  { label: "Registry", href: "/dashboard/admin/registry" },
  { label: "Settings", href: "/dashboard/admin/settings" },
] satisfies ReadonlyArray<NavItem & { href: Route }>;

export default function AdminDashboardNav({ orientation = "vertical" }: AdminDashboardNavProps) {
  const pathname = usePathname();

  if (orientation === "horizontal") {
    return (
      <nav className="flex items-center gap-2 overflow-x-auto rounded-full bg-white px-3 py-2 text-sm text-charcoal-700 shadow-sm">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "whitespace-nowrap rounded-full px-3 py-1 transition-colors",
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
