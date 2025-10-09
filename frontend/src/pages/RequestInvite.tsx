import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "../components/Layout/PageWrapper";
import PageHeader from "../components/Layout/PageHeader";
import CardSection from "../components/Layout/CardSection";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import Input from "../design-system/Input";
import { H2, P } from "../design-system/Typography";
import InviteForm from "../components/InviteForm";
import api from "../lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const verifyCodeSchema = z.object({
  code: z
    .string()
    .transform((value) => value.trim().toUpperCase())
    .refine((value) => value.length > 0, {
      message: "Please enter your invitation code.",
    }),
});

type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;

let hasRedeemResponseWarning = false;

const createIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const RequestInvite: React.FC = () => {
  const [inviteInfo, setInviteInfo] = useState<null | Record<string, unknown>>(null);
  const [formAlert, setFormAlert] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = (message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  };

  const onSubmit = handleSubmit(async ({ code }) => {
    setInviteInfo(null);
    setFormAlert(null);

    try {
      const response = await api.post(
        "/api/invites/redeem",
        { code },
        {
          headers: {
            "Idempotency-Key": createIdempotencyKey(),
          },
        }
      );

      const payload = response?.data;
      if (!payload && process.env.NODE_ENV !== "production" && !hasRedeemResponseWarning) {
        console.warn("RequestInvite: unexpected response shape", response);
        hasRedeemResponseWarning = true;
      }

      const ok = payload?.ok;
      const message = payload?.message;
      const errorMessage = payload?.error;
      const fieldErrors = payload?.fieldErrors;
      const data = payload?.data ?? payload?.invite ?? payload?.result;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
          setError(field as keyof VerifyCodeForm, {
            type: "server",
            message: fieldMessage as string,
          });
        });
        setFormAlert(message || errorMessage || "Please double-check your code.");
        return;
      }

      if (ok === false || !data) {
        const fallback = message || errorMessage || "We couldn’t locate that invitation. Please confirm with Taylor.";
        setFormAlert(fallback);
        if (!data) {
          return;
        }
      }

      setInviteInfo(data as Record<string, unknown>);
      reset({ code: "" });
      showToast(message || "Invite verified — welcome inside!");
    } catch (error: any) {
      const payload = error?.response?.data;
      const message = payload?.message || payload?.error;
      const fieldErrors = payload?.fieldErrors;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
          setError(field as keyof VerifyCodeForm, {
            type: "server",
            message: fieldMessage as string,
          });
        });
        setFormAlert(message || "Please double-check your code.");
        return;
      }

      setFormAlert(
        message || "We couldn’t locate that invitation. Please confirm with Taylor."
      );
    }
  });

  const alertMessage = useMemo(() => formAlert, [formAlert]);

  return (
    <PageWrapper>
      <motion.div
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.9 }}
      >
        <PageHeader
          eyebrow="Concierge applications"
          title="Apply for a Taylor-Made invitation"
          description="We welcome a limited number of expecting parents each season so every detail stays personal. Share your story below—or confirm an invitation code if Taylor has already reserved your spot."
        />
      </motion.div>

      <CardSection
        title="Verify your invitation"
        align="left"
        variant="plain"
        wrapperClassName="space-y-10"
      >
        <motion.div
          className="grid gap-10 lg:grid-cols-[1fr,1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          <Card className="bg-white/95">
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <H2 className="text-2xl">Already have a code?</H2>
              <P>Enter the concierge code you received to unlock your tailored onboarding experience.</P>
              {alertMessage && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-600">
                  {alertMessage}
                </div>
              )}

              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <Input
                    id="invite-code"
                    label="Invitation code"
                    placeholder="e.g. CLIENT-VIP-001"
                    autoComplete="one-time-code"
                    error={errors.code?.message}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying…" : "Verify Code"}
              </Button>

              {inviteInfo && (
                <dl className="rounded-2xl border border-gold/30 bg-shell px-5 py-4 text-left">
                  <div className="flex justify-between text-sm text-charcoal/80">
                    <dt className="uppercase tracking-[0.25em] text-charcoal/60">Role</dt>
                    <dd>{String(inviteInfo.role).toUpperCase()}</dd>
                  </div>
                  {inviteInfo.assigned_email && (
                    <div className="mt-2 flex justify-between text-sm text-charcoal/80">
                      <dt className="uppercase tracking-[0.25em] text-charcoal/60">Email</dt>
                      <dd>{String(inviteInfo.assigned_email)}</dd>
                    </div>
                  )}
                  {inviteInfo.expires_at && (
                    <div className="mt-2 flex justify-between text-sm text-charcoal/80">
                      <dt className="uppercase tracking-[0.25em] text-charcoal/60">Expires</dt>
                      <dd>{new Date(String(inviteInfo.expires_at)).toLocaleDateString()}</dd>
                    </div>
                  )}
                </dl>
              )}
            </form>
          </Card>

          <Card className="bg-white/95">
            <H2 className="text-2xl">Need a fresh invitation?</H2>
            <P className="mt-3">
              Share a glimpse into your celebration plans and we’ll reply with availability, next steps, and a
              handcrafted welcome.
            </P>
            <div className="mt-6">
              <InviteForm />
            </div>
          </Card>
        </motion.div>
      </CardSection>

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
    </PageWrapper>
  );
};

export default RequestInvite;
