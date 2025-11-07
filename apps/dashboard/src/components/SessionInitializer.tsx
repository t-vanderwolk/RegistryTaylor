"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { STORED_TOKEN_KEY, STORED_USER_KEY } from "@/lib/sessionKeys";

type StoredUser = {
  role?: string | null;
};

export default function SessionInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    const token = localStorage.getItem(STORED_TOKEN_KEY);
    const storedUserValue = localStorage.getItem(STORED_USER_KEY);
    let user: StoredUser | null = null;

    if (storedUserValue) {
      try {
        user = JSON.parse(storedUserValue) as StoredUser;
      } catch {
        localStorage.removeItem(STORED_USER_KEY);
      }
    }

    if (token && user && pathname === "/login") {
      console.log("🟢 Session restored");
      router.replace(`/dashboard/${String(user.role).toLowerCase()}`);
    } else if (!token && pathname.startsWith("/dashboard")) {
      console.log("🚫 No session — redirecting to /login");
      router.replace("/login");
    }
  }, [hydrated, pathname, router]);

  return null;
}
