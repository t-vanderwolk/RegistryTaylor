"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function HeroInviteForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();

    if (!normalized) {
      setError("Enter your invite code to continue.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/invites/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalized }),
      });

      if (!response.ok) {
        throw new Error("Invite invalid");
      }

      router.push(`/login?invite=${encodeURIComponent(normalized)}` as Route);
    } catch {
      setSubmitting(false);
      setError("That invite code isn’t recognized. Please try again or request an invite.");
    }
  };

  return (
    <div className="w-full max-w-sm rounded-[2.5rem] border border-gold/60 bg-blush/80 p-6 shadow-[0_12px_32px_rgba(177,132,153,0.25)] backdrop-blur">
      <h2 className="font-serif text-2xl text-mauve-500">Already invited?</h2>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
        Enter your Taylor-Made code to confirm your access, then sign in to continue your journey.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block text-sm font-semibold uppercase tracking-[0.28em] text-charcoal/70">
          Invite code
          <input
            type="text"
            inputMode="text"
            autoComplete="one-time-code"
            maxLength={16}
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="mt-2 w-full rounded-full border border-mauve-300/60 bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-mauve-500 focus:outline-none focus:ring-2 focus:ring-tm-focus"
            placeholder="e.g. TMB-ALPHA"
          />
        </label>
        {error ? <p className="text-sm text-mauve-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-rose px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-charcoal shadow-blush-soft transition hover:-translate-y-0.5 hover:bg-tm-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Verifying…" : "Continue to login"}
        </button>
      </form>
    </div>
  );
}
