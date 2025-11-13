"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard/member", label: "Home", icon: "🏠" },
  { href: "/dashboard/member/learn", label: "Learn", icon: "🎓" },
  { href: "/dashboard/member/plan", label: "Plan", icon: "🍼" },
  { href: "/dashboard/member/registry", label: "Registry", icon: "🎯" },
  { href: "/dashboard/member/journal", label: "Journal", icon: "📔" },
  { href: "/dashboard/member/events", label: "Events", icon: "📅" },
  { href: "/dashboard/member/community", label: "Community", icon: "💬" },
] as const;

export default function MobileFooterNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="md:hidden max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 border-t border-blush-300/60 bg-white/95 py-2 shadow-[0_-12px_25px_rgba(200,161,180,0.18)]">
      <div className="mx-auto flex max-w-[420px] gap-2 overflow-x-auto px-4 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-charcoal-400">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[4.25rem] flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1 transition ${
                active ? "bg-blush-200/70 text-charcoal-700" : "hover:text-charcoal-600"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
