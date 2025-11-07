"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { clearStoredToken, clearStoredUser } from "@/lib/auth";

type LogoutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export default function LogoutButton({ className = "", children = "Logout" }: LogoutButtonProps) {
  const router = useRouter();

  const logout = () => {
    try {
      clearStoredUser();
      clearStoredToken();
      fetch("/logout", { method: "POST" }).catch(() => {
        // ignore failures; cookie will expire eventually
      });
    } finally {
      console.log("🚪 Logged out");
      router.replace("/login");
    }
  };

  return (
    <button type="button" onClick={logout} className={className}>
      {children}
    </button>
  );
}
