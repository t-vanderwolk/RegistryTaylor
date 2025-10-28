"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

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
      <label className="space-y-2 text-sm text-[#3E2F35]/70">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
        />
      </label>

      <label className="space-y-2 text-sm text-[#3E2F35]/70">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Password</span>
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
        />
      </label>

      {error ? <p className="text-sm text-[#8C3B52]">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-1 hover:bg-[#B88FA6] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
