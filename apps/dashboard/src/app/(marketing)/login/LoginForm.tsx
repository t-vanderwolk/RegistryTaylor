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

const DEFAULT_SITE_URL = "http://localhost:5050";

function resolveSiteBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    } catch {
      return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    }
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
}

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionRetrying, setSessionRetrying] = useState(false);

  const persistSessionCookie = async (token: string | null) => {
    if (!token) {
      console.warn("⚠️ Missing token from login response. Skipping session sync.");
      return;
    }

    const MAX_ATTEMPTS = 3;
    const payload = JSON.stringify({ token });
    const sessionUrl = `${resolveSiteBaseUrl()}/api/session`;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetch(sessionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: payload,
        });

        if (response.ok) {
          setSessionRetrying(false);
          return;
        }

        if (response.status === 404 && attempt < MAX_ATTEMPTS) {
          setSessionRetrying(true);
          await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
          continue;
        }

        const data = await response.json().catch(() => null);
        const message =
          (data && typeof data === "object" && "message" in data ? (data as Record<string, string>).message : null) ??
          "Session sync failed";
        throw new Error(message);
      } catch (syncError) {
        if (attempt >= MAX_ATTEMPTS) {
          setSessionRetrying(false);
          console.warn("⚠️ Unable to persist session state to storage.", syncError);
          return;
        }
        setSessionRetrying(true);
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
      }
    }
  };

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

      try {
        console.log("🔐 TOKEN CHECK:", token);
        if (token) {
          localStorage.setItem(STORED_TOKEN_KEY, token);
          sessionStorage.setItem(STORED_SESSION_USER_KEY, JSON.stringify(user));
          await persistSessionCookie(token);
        }
      } catch (syncError) {
        console.warn("⚠️ Session sync failed after retries.", syncError);
      }

      console.log("✅ LOGIN SUCCESS:", user);
      console.log("🔀 Redirecting to:", dashboardPath);
      router.push(dashboardPath as Route);
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
      {sessionRetrying ? (
        <p className="flex items-center text-xs font-medium text-[#C8A1B4]">
          <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#C8A1B4] border-t-transparent" />
          Finalizing your session…
        </p>
      ) : null}
    </form>
  );
}
