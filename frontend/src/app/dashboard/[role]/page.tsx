"use client";
import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

export default function RoleDashboardFallback() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return;
    try {
      setUser(JSON.parse(stored) as AuthenticatedUser);
    } catch {
      localStorage.removeItem("tm_user");
    }
  }, []);

  return (
    <main className="p-10 text-[#3E2F35]">
      <h1 className="text-2xl font-semibold">
        {user ? `Welcome, ${user.role}!` : "Loading your dashboard..."}
      </h1>
      <p className="mt-2 text-sm text-[#3E2F35]/70">
        We could not determine a specific dashboard for this route, so we loaded your saved profile.
      </p>
    </main>
  );
}
