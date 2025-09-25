import React, { useState } from "react";
import api from "../lib/api";

const InviteForm = () => {
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (status.state !== "idle") {
      setStatus({ state: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ state: "loading", message: "Submitting your request…" });

    try {
      await api.post("/api/v1/invite-requests", {
        name: form.name,
        email: form.email,
        optional_note: form.note,
        requested_role: "client",
        zip_code: "",
        package_choice: "",
      });

      setForm({ name: "", email: "", note: "" });
      setStatus({
        state: "success",
        message: "Thank you! We’ll review your request and get back to you soon.",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "We couldn’t send your request just yet. Email RegistryWihTaylor@gmail.com and we’ll take care of you.";
      setStatus({ state: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="request-invite"
      tabIndex="-1"
      className="mx-auto mt-20 max-w-4xl surface-panel p-8"
    >
      <header className="text-center">
        <p className="text-xs font-heading uppercase tracking-[0.5em] text-blueberry/70">
          Concierge Applications
        </p>
        <h2 className="mt-3 text-3xl font-heading text-blueberry">Request Your Invite</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-midnight/70">
          Apply now — no payment required. Taylor personally reviews every request and replies with next steps within two business days.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.35em] text-blueberry/70">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange("name")}
              required
              placeholder="Your full name"
              className="rounded-2xl border border-babyBlue/40 bg-white/80 px-4 py-3 font-body text-sm text-midnight shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/70"
            />
          </label>
          <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.35em] text-blueberry/70">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              placeholder="you@example.com"
              className="rounded-2xl border border-babyBlue/40 bg-white/80 px-4 py-3 font-body text-sm text-midnight shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/70"
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.35em] text-blueberry/70">
          Optional Note
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange("note")}
            placeholder="Share your due date, dream nursery aesthetic, or concierge wishes."
            rows={4}
            className="rounded-2xl border border-babyBlue/40 bg-white/80 px-4 py-3 font-body text-sm text-midnight shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/70"
          />
        </label>
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-babyBlue/15 bg-softBeige/70 px-5 py-4 text-xs font-body text-midnight/70 sm:flex-row">
          <span>Questions before applying? Email <a className="font-semibold text-blueberry underline" href="mailto:RegistryWihTaylor@gmail.com">RegistryWihTaylor@gmail.com</a>.</span>
          <button
            type="submit"
            className={`inline-flex items-center justify-center rounded-full bg-babyPink px-8 py-3 text-xs font-heading uppercase tracking-[0.4em] text-midnight shadow-toy transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-babyBlue/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige ${
              isSubmitting ? "cursor-wait opacity-75" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Submit Request"}
          </button>
        </div>
        <div role="status" aria-live="polite" className="min-h-[1.5rem] text-center text-sm font-body">
          {status.state === "success" && <span className="text-blueberry">{status.message}</span>}
          {status.state === "error" && <span className="text-red-400">{status.message}</span>}
          {status.state === "loading" && <span className="text-blueberry/80">{status.message}</span>}
        </div>
      </form>
    </section>
  );
};

export default InviteForm;
