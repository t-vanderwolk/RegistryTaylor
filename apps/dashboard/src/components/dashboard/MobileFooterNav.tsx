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
    <nav
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 gap-2 overflow-x-auto rounded-3xl border border-blush-300/70 bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-400 shadow-mauve-glow backdrop-blur md:hidden"
      aria-label="Primary navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-[5rem] flex-col items-center gap-1 rounded-full px-2 py-1 transition duration-200 ease-bloom ${
              active ? "bg-blush-200/70 text-charcoal-700 shadow-blush-pill" : "hover:text-charcoal-500"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
