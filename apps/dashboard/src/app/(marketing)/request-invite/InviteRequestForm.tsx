"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab] disabled:cursor-not-allowed disabled:opacity-70";

export default function InviteRequestForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      dueDate: formData.get("dueDate")?.toString().trim() ?? "",
      message: formData.get("message")?.toString().trim() ?? "",
    };

    if (!payload.name || !payload.email) {
      setError("Please share your name and email so our concierge team can respond.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/invites/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || "Unable to submit invite request.");
      }

      const redirectTo = "/thank-you" as const;
      router.push(redirectTo);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-[#3E2F35]/75">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Name</span>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            className="w-full rounded-[1.5rem] border border-[#D9C48E]/30 bg-white px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]"
          />
        </label>
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
      </div>

      <label className="space-y-2 text-sm text-[#3E2F35]/75">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
          Estimated due date
        </span>
        <input
          type="date"
          name="dueDate"
          className="w-full rounded-[1.5rem] border border-[#D9C48E]/30 bg-white px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]"
        />
      </label>

      <label className="space-y-2 text-sm text-[#3E2F35]/75">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
          Tell us about your journey
        </span>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-[1.5rem] border border-[#D9C48E]/30 bg-white px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#C8A1B4] focus:shadow-[0_0_0_3px_rgba(200,161,180,0.25)]"
          placeholder="Nursery inspirations, priorities, or support needs you want us to know."
        />
      </label>

      {error ? <p className="text-sm text-[#b05f71]">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className={PRIMARY_BUTTON_CLASSES}
      >
        {submitting ? "Sending…" : "Request Invite"}
      </button>
    </form>
  );
}
