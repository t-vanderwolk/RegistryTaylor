import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import api from "../lib/api";
import { membershipTiers } from "../data/membership";

const emptyForm = {
  name: "",
  email: "",
  zip_code: "",
  package_choice: "",
};

const RequestInvite = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const packageOptions = useMemo(
    () =>
      membershipTiers.map((tier) => ({
        value: tier.name,
        label: tier.name,
      })),
    []
  );

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setStatus({ state: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus({ state: "loading", message: "" });

    try {
      await api.post("/api/v1/invite-requests", form);
      setForm(emptyForm);
      setStatus({
        state: "success",
        message:
          "Thank you! Taylor will review your concierge request and respond with next steps soon.",
      });
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        "We couldn’t send your request. Please try again or email RegistryWihTaylor@gmail.com.";
      setStatus({ state: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-babyBlue/20 text-darkText">
      <Section title="Request Your Invitation" center compact>
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-center text-sm font-body leading-relaxed text-darkText/70">
            Share a few details about your family and the concierge support you are exploring. Taylor personally reviews each submission and will hand-answer every request as soon as possible.
          </p>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm space-y-5"
          >
            <Field label="Name" required>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                required
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="Your full name"
              />
            </Field>

            <Field label="Email Address" required>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                placeholder="you@example.com"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ZIP Code">
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={handleChange("zip_code")}
                  className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                  placeholder="85251"
                />
              </Field>
              <Field label="Package Interest">
                <select
                  value={form.package_choice}
                  onChange={handleChange("package_choice")}
                  className="w-full rounded-2xl border border-babyBlue/30 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                >
                  <option value="">Select concierge tier</option>
                  {packageOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {status.state !== "idle" && (
              <p
                className={`rounded-2xl border px-4 py-3 text-sm font-body ${
                  status.state === "success"
                    ? "border-babyBlue/40 bg-babyBlue/15 text-blueberry"
                    : status.state === "error"
                    ? "border-babyPink/50 bg-babyPink/20 text-babyPink/90"
                    : "border-babyBlue/30 bg-babyBlue/10 text-blueberry"
                }`}
                aria-live="polite"
              >
                {status.message || "Sending your concierge request…"}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                submitting ? "cursor-wait opacity-75" : "hover:-translate-y-1 hover:shadow-dreamy"
              }`}
            >
              {submitting ? "Submitting…" : "Send Invitation Request"}
            </button>
          </form>

          <p className="text-center text-xs font-heading uppercase tracking-[0.35em] text-darkText/50">
            Already have a private invite? <Link to="/portal" className="text-blueberry underline">Access the portal</Link>
          </p>
        </div>
      </Section>
    </main>
  );
};

const Field = ({ label, required, children }) => (
  <label className="block text-sm font-heading uppercase tracking-[0.3em] text-darkText/60">
    {label}
    {required ? " *" : ""}
    <div className="mt-2">{children}</div>
  </label>
);

export default RequestInvite;
