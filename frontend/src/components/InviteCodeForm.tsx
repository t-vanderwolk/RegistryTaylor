"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

const InviteCodeForm = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Please enter your invite code.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/invites/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });

      if (!response.ok) {
        throw new Error("Invalid invite code");
      }

      router.push(`/onboarding/create-profile?code=${encodeURIComponent(normalizedCode)}` as Route);
    } catch {
      setError("That invite code isn’t recognized — please try again or request a new invite.");
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold/40 bg-taupe/60 p-6 shadow-md">
      <h2 className="font-serif text-2xl text-charcoal-700">Already received an invite?</h2>
      <p className="mt-2 font-sans text-[17px] text-charcoal-500 leading-[1.7]">
        Enter your Taylor-Made invite code to continue with onboarding.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-charcoal-700">
          Invite code
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="mt-2 w-full rounded-lg border border-mauve-100 bg-white px-4 py-3 font-sans text-[17px] text-charcoal-700 focus:border-mauve-500 focus:outline-none focus:ring-1 focus:ring-mauve-500"
            placeholder="e.g. TMB-ALPHA"
            autoComplete="one-time-code"
            maxLength={16}
          />
        </label>
        {error ? <p className="text-sm text-mauve-700">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-700 disabled:cursor-not-allowed disabled:opacity-75"
          disabled={submitting}
        >
          {submitting ? "Verifying…" : "Enter invite code"}
        </button>
      </form>
    </div>
  );
};

export default InviteCodeForm;
