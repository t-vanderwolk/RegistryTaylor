"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { API_BASE } from "../lib/api";

type NavItem = {
  href: string;
  label: string;
};

const baseNav: NavItem[] = [
  { href: "/dashboard/academy", label: "Academy" },
  { href: "/dashboard/registry", label: "Registry" },
  { href: "/dashboard/mentor", label: "Mentor" },
  { href: "/dashboard/community", label: "Community" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const json = await response.json();
        if (!json.success) return;
        if (!cancelled && json.data?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to resolve user role", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    return isAdmin
      ? [...baseNav, { href: "/dashboard/admin", label: "Admin" }]
      : baseNav;
  }, [isAdmin]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Unable to log out", error);
    } finally {
      setLoggingOut(false);
      router.replace("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-tmMauve/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/dashboard/academy"
          className="font-display text-2xl text-tmMauve transition hover:text-tmGold"
        >
          Taylor-Made Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition duration-200",
                  isActive
                    ? "bg-tmBlush text-tmMauve shadow-soft"
                    : "text-tmCharcoal/70 hover:bg-tmBlush/60 hover:text-tmMauve"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "inline-flex items-center rounded-full border border-tmMauve/30 px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
              loggingOut && "opacity-60"
            )}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
}
