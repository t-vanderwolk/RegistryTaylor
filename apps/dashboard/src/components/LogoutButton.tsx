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
      await api.post("/api/auth/logout");
    } catch (error) {
      console.warn("Failed to call /api/auth/logout", error);
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
