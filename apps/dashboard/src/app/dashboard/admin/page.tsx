"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <main className="p-10 text-[#3E2F35]">
      <h1 className="text-2xl font-semibold">
        {user ? `Welcome, ${user.role}!` : "Loading your dashboard..."}
      </h1>
    </main>
  );
}
