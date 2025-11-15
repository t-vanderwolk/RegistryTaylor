"use client";

import { useState } from "react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { STORED_SESSION_USER_KEY, STORED_TOKEN_KEY } from "@/lib/sessionKeys";

const INPUT_CLASSES =
  "w-full rounded-lg border border-[#D9C48E]/40 bg-white p-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]";
const BUTTON_CLASSES =
  "inline-flex w-full items-center justify-center rounded-full bg-[#C8A1B4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    type LoginFormFields = HTMLFormElement & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const form = event.currentTarget as LoginFormFields;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { user, token } = await loginUser(email, password);
      const dashboardPath = `/dashboard/${user.role.toLowerCase()}`;

      if (token) {
        localStorage.setItem(STORED_TOKEN_KEY, token);
        sessionStorage.setItem(STORED_SESSION_USER_KEY, JSON.stringify(user));
      }

      router.replace(dashboardPath as Route);
    } catch (err) {
      console.error("❗ LoginForm.tsx:52 handleSubmit error", err);
      const message = err instanceof Error ? err.message : "Unable to login. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="email" type="email" placeholder="Email" className={INPUT_CLASSES} autoComplete="email" />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className={INPUT_CLASSES}
        autoComplete="current-password"
      />
      {error ? <p className="text-sm text-[#b05f71]">{error}</p> : null}
      <button disabled={loading} type="submit" className={BUTTON_CLASSES}>
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
