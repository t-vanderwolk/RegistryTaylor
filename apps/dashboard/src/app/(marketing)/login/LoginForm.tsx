"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

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
      const payload = await apiFetch<{ token?: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (payload?.token) {
        // Store the token in localStorage for subsequent requests.
        localStorage.setItem("tmbc.token", payload.token);
      }

      const destination = "/dashboard" as const;
      router.push(destination);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
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
