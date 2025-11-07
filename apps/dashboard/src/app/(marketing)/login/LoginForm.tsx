"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import api from "@/lib/apiClient";
import { isAxiosError } from "axios";
import type { UserRole } from "@/lib/auth";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab] disabled:cursor-not-allowed disabled:opacity-70";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: payload } = await api.post<{
        id: string;
        email: string;
        role: UserRole;
        redirectTo?: string;
      }>("/api/auth/login", { email, password });
      const roleToRoute: Record<UserRole, Route> = {
        ADMIN: "/dashboard/admin",
        MENTOR: "/dashboard/mentor",
        MEMBER: "/dashboard/member",
      };
      const fallbackRole: UserRole = payload?.role ?? "MEMBER";
      const destination: Route =
        (payload?.redirectTo as Route | undefined) ?? roleToRoute[fallbackRole];

      router.push(destination);
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Invalid credentials. Please double-check your email and password.");
          return;
        }
        setError(error.response?.data?.message ?? "Unable to login. Please try again.");
        return;
      }
      setError(error instanceof Error ? error.message : "Unexpected error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="space-y-2 text-sm text-[#3E2F35]/75">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="w-full rounded-[1.5rem] border border-[#D9C48E]/30 bg-white px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]"
        />
      </label>

      <label className="space-y-2 text-sm text-[#3E2F35]/75">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Password</span>
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full rounded-[1.5rem] border border-[#D9C48E]/30 bg-white px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]"
        />
      </label>

      {error ? <p className="text-sm text-[#b05f71]">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className={PRIMARY_BUTTON_CLASSES}
      >
        {submitting ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
