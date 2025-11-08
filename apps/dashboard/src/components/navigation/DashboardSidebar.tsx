"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import { useDashboardNav } from "@/hooks/useDashboardNav";

type DashboardSidebarProps = {
  role: UserRole;
};

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = useDashboardNav(role);

  return (
    <nav className="space-y-2 rounded-2xl border border-tm-gold/30 bg-white p-4 shadow-soft">
      {items.map((item) => {
        const active =
          pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition",
              active
                ? "bg-tm-blush/60 text-tm-charcoal shadow-inner"
                : "text-tm-charcoal/80 hover:bg-tm-blush/40",
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
