"use client";

import type { Route } from "next";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_DASHBOARD_ROUTES } from "@/constants/memberDashboardRoutes";

const NAV_ITEMS = [
  { href: MEMBER_DASHBOARD_ROUTES.home as Route, label: "Home", icon: "🏠" },
  { href: MEMBER_DASHBOARD_ROUTES.learnRoot as Route, label: "Learn", icon: "🎓" },
  { href: MEMBER_DASHBOARD_ROUTES.plan as Route, label: "Plan", icon: "🍼" },
  { href: MEMBER_DASHBOARD_ROUTES.journal as Route, label: "Journal", icon: "📔" },
  { href: MEMBER_DASHBOARD_ROUTES.events as Route, label: "Events", icon: "📅" },
  { href: MEMBER_DASHBOARD_ROUTES.community as Route, label: "Community", icon: "💬" },
] as const;

export default function MobileFooterNav() {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState(true);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    setExpanded(true);
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div
        className={[
          "pointer-events-auto px-4 transition-transform duration-300 ease-out",
          expanded ? "translate-y-0" : "translate-y-[calc(100%-4.5rem)]",
        ].join(" ")}
      >
        <nav
          aria-label="Primary mobile navigation"
          className="rounded-[2rem] border border-mauve-200/70 bg-ivory/95 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-mauve-card backdrop-blur"
        >
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-label="Toggle footer navigation"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-mauve-200/70 bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-charcoal-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-500/40"
            >
              <span>{expanded ? "Close" : "Open"}</span>
              <span aria-hidden>{expanded ? "▾" : "▴"}</span>
            </button>
          </div>

          <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-charcoal-500">
            {NAV_ITEMS.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-2xl px-3 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mauve-500/40",
                    active ? "bg-mauve-500/20 text-charcoal-700 shadow-soft" : "bg-white/60 hover:text-mauve-600",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <span aria-hidden className="text-lg">
                    {item.icon}
                  </span>
                  <span className={expanded ? "block" : "sr-only"}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
