import React, { useState } from "react";
import api from "../lib/api";
import expectingDetail from "../assets/belly-upclose.jpeg";

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
      className="relative mx-auto mt-24 max-w-5xl overflow-hidden rounded-[3.5rem] border border-babyPink/40 bg-softMint/50 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-babyPink/35 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-babyPink/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-babyPink/45 to-transparent" aria-hidden="true" />

      <div className="relative grid gap-12 md:grid-cols-[1fr,1.2fr] md:items-center">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">
            Concierge Applications
          </p>
          <h2 className="text-4xl font-serif font-heading text-blueberry">Request Your Invite</h2>
          <span className="gold-divider md:ml-0" aria-hidden="true" />
          <p className="mx-auto max-w-md text-base leading-relaxed text-neutral-600 md:mx-0">
            Taylor personally reviews each request and only takes on a few families at a time. Tell us about your plans below and we’ll reply within two business days.
          </p>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-babyPink/45">
            <img src={expectingDetail} alt="Close-up of a serene maternity moment" className="h-48 w-full object-cover" loading="lazy" />
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange("name")}
                required
                placeholder="Your full name"
                className="rounded-2xl border border-babyBlue/35 bg-white/90 px-4 py-3 font-body text-sm text-neutral-600 shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                placeholder="you@example.com"
                className="rounded-2xl border border-babyBlue/35 bg-white/90 px-4 py-3 font-body text-sm text-neutral-600 shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/60"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-left text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
            Optional Note
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange("note")}
              placeholder="Share your due date, design wishes, or concierge hopes."
              rows={4}
              className="rounded-2xl border border-babyBlue/35 bg-white/90 px-4 py-3 font-body text-sm text-neutral-600 shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/60"
            />
          </label>
          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-babyPink/35 bg-white/85 px-5 py-4 text-xs font-body uppercase tracking-[0.35em] text-neutral-600 sm:flex-row">
            <span className="normal-case tracking-normal">
              Questions? Email <a className="font-semibold text-blueberry underline" href="mailto:RegistryWihTaylor@gmail.com">RegistryWihTaylor@gmail.com</a>
            </span>
            <button
              type="submit"
              className={`inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-xs font-heading uppercase tracking-[0.4em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isSubmitting ? "cursor-wait opacity-80" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Submit Request"}
            </button>
          </div>
          <div role="status" aria-live="polite" className="min-h-[1.5rem] text-center text-sm font-body">
            {status.state === "success" && <span className="text-primary">{status.message}</span>}
            {status.state === "error" && <span className="text-red-400">{status.message}</span>}
            {status.state === "loading" && <span className="text-primary/80">{status.message}</span>}
          </div>
        </form>
      </div>
    </section>
  );
};

export default InviteForm;
