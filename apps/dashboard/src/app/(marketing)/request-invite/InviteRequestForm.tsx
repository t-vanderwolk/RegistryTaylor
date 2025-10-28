"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

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
      await apiFetch("/api/invites/request", {
        method: "POST",
        body: JSON.stringify(payload),
      });

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
        <label className="space-y-2 text-sm text-[#3E2F35]/70">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Name</span>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
          />
        </label>
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
      </div>

      <label className="space-y-2 text-sm text-[#3E2F35]/70">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Estimated due date</span>
        <input
          type="date"
          name="dueDate"
          className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
        />
      </label>

      <label className="space-y-2 text-sm text-[#3E2F35]/70">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Tell us about your journey</span>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
          placeholder="Nursery inspirations, priorities, or support needs you want us to know."
        />
      </label>

      {error ? <p className="text-sm text-[#8C3B52]">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-1 hover:bg-[#B88FA6] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Request Invite"}
      </button>
    </form>
  );
}
