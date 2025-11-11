"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { clearStoredToken, clearStoredUser } from "@/lib/auth";
import api from "@/lib/apiClient";

type LogoutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export default function LogoutButton({ className = "", children = "Logout" }: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    try {
      await Promise.allSettled([
        api.post("/api/auth/logout"),
        fetch("/api/session", { method: "DELETE", credentials: "include" }),
      ]);
    } finally {
      clearStoredUser();
      clearStoredToken();
      console.log("🚪 Logged out");
      router.replace("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void logout();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
