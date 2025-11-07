"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { AuthenticatedUser } from "@/lib/auth";

const STORAGE_KEY = "tm_user";

type DashboardRoute = Extract<
  Route,
  "/login" | "/dashboard/member" | "/dashboard/mentor" | "/dashboard/admin"
>;

function getDashboardPath(user: AuthenticatedUser | null): DashboardRoute {
  switch (user?.role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    case "MEMBER":
      return "/dashboard/member";
    default:
      return "/login";
  }
}

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;

    try {
      const user = stored ? (JSON.parse(stored) as AuthenticatedUser) : null;
      router.replace(getDashboardPath(user));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-tm-ivory text-tm-charcoal">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-tm-mauve/70">
        Redirecting…
      </p>
    </div>
  );
}
