import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";
import expectingDetail from "../assets/belly-upclose.jpeg";
import Card from "../design-system/Card";
import Input from "../design-system/Input";
import Button from "../design-system/Button";
import { P } from "../design-system/Typography";

const inviteFormSchema = z.object({
  name: z
    .string()
    .min(2, "Please share your name so Taylor can personalise the reply.")
    .max(120, "That name feels a little long — could you shorten it for us?"),
  email: z
    .string()
    .email("Please enter a valid email so we can reach you.")
    .max(160, "This email looks longer than we can support — try a shorter address."),
  note: z
    .string()
    .max(800, "Feel free to trim a few words — 800 characters or less keeps things concise.")
    .optional(),
});

const defaultValues = {
  name: "",
  email: "",
  note: "",
};

let hasInviteResponseWarning = false;

const createIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const InviteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(inviteFormSchema),
    defaultValues,
  });

  const [formAlert, setFormAlert] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormAlert(null);

    try {
      const response = await api.post(
        "/api/v1/invite-requests",
        {
          name: values.name,
          email: values.email,
          optional_note: values.note ?? "",
          requested_role: "client",
          zip_code: "",
          package_choice: "",
        },
        {
          headers: {
            "Idempotency-Key": createIdempotencyKey(),
          },
        }
      );

      const payload = response?.data;
      const ok = payload?.ok;
      const message = payload?.message;
      const fieldErrors = payload?.fieldErrors;

      if (!payload && process.env.NODE_ENV !== "production" && !hasInviteResponseWarning) {
        console.warn("InviteForm: unexpected response shape", response);
        hasInviteResponseWarning = true;
      }

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          setError(field, {
            type: "server",
            message: errorMessage,
          });
        });
        setFormAlert(message || "Please review the highlighted fields.");
        return;
      }

      if (ok === false) {
        setFormAlert(message || payload?.error || "We couldn’t send your request. Please try again.");
        return;
      }

      showToast(message || "Thank you! We’ll review your request and get back to you soon.");
      reset(defaultValues);
    } catch (error) {
      const data = error?.response?.data;
      const message = data?.message || data?.error;
      const fieldErrors = data?.fieldErrors;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          setError(field, {
            type: "server",
            message: errorMessage,
          });
        });
        setFormAlert(message || "Please review the highlighted fields.");
        return;
      }

      setFormAlert(
        message ||
          "We couldn’t send your request just yet. Email RegistryWithTaylor@gmail.com and we’ll take care of you."
      );
    }
  });

  const alertMessage = useMemo(() => formAlert, [formAlert]);

  return (
    <section
      id="request-invite"
      tabIndex="-1"
      className="relative mx-auto mt-24 max-w-5xl overflow-hidden rounded-[3rem] border border-gold/25 bg-gradient-to-br from-ivory via-cream to-shell px-6 py-16 shadow-elevated-md backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-blush/35 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-mauve/25 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/45 to-transparent" aria-hidden="true" />

      <div className="relative grid gap-12 md:grid-cols-[1fr,1.2fr] md:items-center">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-heading uppercase tracking-[0.34em] text-charcoal/60">Concierge Applications</p>
          <h2 className="text-4xl font-heading text-charcoal">Request Your Invite</h2>
          <span className="mx-auto block h-[2px] w-16 rounded-full bg-gold md:ml-0" aria-hidden="true" />
          <P className="mx-auto max-w-md text-base leading-relaxed text-charcoal/70 md:mx-0">
            Taylor personally reviews each request and only takes on a few families at a time. Tell us about your plans
            below and we’ll reply within two business days.
          </P>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30">
            <img src={expectingDetail} alt="Close-up of a serene maternity moment" className="h-48 w-full object-cover" loading="lazy" />
          </div>
        </header>

        <Card className="bg-white/95 shadow-elevated-sm sm:p-8">
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {alertMessage && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-600">
                {alertMessage}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="invite-name"
                label="Name"
                placeholder="Your full name"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                id="invite-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <label className="flex flex-col gap-2 font-body text-sm text-charcoal/80">
              <span className="text-xs uppercase tracking-[0.3em] text-charcoal/60">Optional Note</span>
              <textarea
                rows={4}
                placeholder="Share your due date, design wishes, or concierge hopes."
                className={`rounded-2xl border border-charcoal/15 bg-white/90 px-4 py-3 text-sm text-charcoal shadow-elevated-sm transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                  errors.note ? "border-rose-300 focus:border-rose-400 focus:ring-rose-300" : ""
                }`}
                {...register("note")}
              />
              {errors.note && <span className="text-xs text-rose-500">{errors.note.message}</span>}
            </label>

            <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-gold/25 bg-white/85 px-5 py-4 text-xs font-body uppercase tracking-[0.35em] text-charcoal/70 sm:flex-row">
              <span className="normal-case tracking-normal">
                Questions? Email{" "}
                <a className="font-semibold text-mauve underline" href="mailto:RegistryWithTaylor@gmail.com">
                  RegistryWithTaylor@gmail.com
                </a>
              </span>
              <Button type="submit" className="px-8" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Submit Request"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-8 left-1/2 z-30 w-[min(90%,320px)] -translate-x-1/2 rounded-[1.75rem] border px-6 py-3 text-sm shadow-elevated-sm transition ${
            toast.tone === "success"
              ? "border-softMint/70 bg-softMint/90 text-charcoal"
              : "border-rose-200 bg-rose-50/90 text-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default InviteForm;
