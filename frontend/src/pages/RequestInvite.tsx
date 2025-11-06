import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
=======
import MarketingLayout from "../layouts/MarketingLayout";
>>>>>>> heroku/main
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import Input from "../design-system/Input";
import { H1, H2, P } from "../design-system/Typography";
import InviteForm from "../components/InviteForm";
import api from "../lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const RequestInvite: React.FC = () => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteInfo, setInviteInfo] = useState<null | Record<string, unknown>>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const message = useMemo(() => {
    if (status === "success" && inviteInfo) {
      return `Welcome back! Code ${inviteInfo.code} is authorized for the ${inviteInfo.role} circle.`;
    }
    if (status === "error") {
      return errorMessage;
    }
    return "";
  }, [status, inviteInfo, errorMessage]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Please enter an invitation code to verify.");
      setInviteInfo(null);
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      const response = await api.get(`/api/v1/auth/invites/${encodeURIComponent(trimmed)}`);
      const data = response.data?.data;
      if (!data) {
        throw new Error("We couldn’t locate that invitation. Please confirm with Taylor.");
      }
      setInviteInfo(data);
      setStatus("success");
    } catch (err: any) {
      const fallback =
        err?.response?.data?.error?.message ||
        err?.message ||
        "We couldn’t locate that invitation. Please confirm with Taylor.";
      setInviteInfo(null);
      setErrorMessage(fallback);
      setStatus("error");
    }
  };

  return (
<<<<<<< HEAD
    <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
=======
    <MarketingLayout>
      <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
>>>>>>> heroku/main
        <Section>
          <motion.div
            className="space-y-6 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9 }}
          >
<<<<<<< HEAD
            <span className="inline-flex items-center justify-center rounded-full bg-mauve/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-charcoal">
              Invitation Request
            </span>
            <H1 className="mx-auto max-w-4xl text-mauve">
              Begin your Member → Mentor journey
            </H1>
            <P className="mx-auto max-w-3xl">
              Taylor-Made Baby Co. welcomes a limited number of families each season so every relationship stays personal. Share your details—or confirm a reserved invitation—to step into a journey that teaches, plans, and connects with calm intention.
=======
            <span className="inline-flex items-center justify-center rounded-full bg-primary/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-ink">
              Concierge applications
            </span>
            <H1 className="mx-auto max-w-4xl">
              Apply for a Taylor-Made invitation
            </H1>
            <P className="mx-auto max-w-3xl">
              We welcome a limited number of expecting parents each season so every detail stays personal. Share
              your story below—or confirm an invitation code if Taylor has already reserved your spot.
>>>>>>> heroku/main
            </P>
          </motion.div>
        </Section>

        <Section title="Verify your invitation">
          <motion.div
            className="grid gap-10 lg:grid-cols-[1fr,1fr]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <Card className="bg-white/95">
              <form onSubmit={handleVerify} className="space-y-4">
<<<<<<< HEAD
                <H2 className="text-2xl text-mauve">Already have a code?</H2>
                <P>Enter your concierge code to unlock the next steps in the Academy and meet your mentor.</P>
=======
                <H2 className="text-2xl">Already have a code?</H2>
                <P>Enter the concierge code you received to unlock your tailored onboarding experience.</P>
>>>>>>> heroku/main
                <Input
                  id="invite-code"
                  label="Invitation code"
                  placeholder="e.g. CLIENT-VIP-001"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value.toUpperCase());
                    if (status !== "idle") {
                      setStatus("idle");
                      setInviteInfo(null);
                      setErrorMessage("");
                    }
                  }}
                />
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Verifying…" : "Verify Code"}
                </Button>
                <p
                  className={[
                    "min-h-[1.25rem] font-body text-sm",
                    message
                      ? status === "success"
<<<<<<< HEAD
                        ? "text-charcoal/90"
                        : status === "error"
                        ? "text-rose-500"
                        : "text-charcoal/70"
                      : "text-charcoal/60",
=======
                        ? "text-ink/90"
                        : status === "error"
                        ? "text-rose-500"
                        : "text-ink/70"
                      : "text-ink/60",
>>>>>>> heroku/main
                  ].join(" ")}
                  aria-live="polite"
                >
                  {message}
                </p>
                {inviteInfo && (
<<<<<<< HEAD
                  <dl className="rounded-2xl border border-mauve/40 bg-ivory px-5 py-4 text-left">
                    <div className="flex justify-between text-sm text-charcoal/80">
                      <dt className="uppercase tracking-[0.25em] text-charcoal/60">Role</dt>
                      <dd>{String(inviteInfo.role).toUpperCase()}</dd>
                    </div>
                    {inviteInfo.assigned_email && (
                      <div className="mt-2 flex justify-between text-sm text-charcoal/80">
                        <dt className="uppercase tracking-[0.25em] text-charcoal/60">Email</dt>
=======
                  <dl className="rounded-2xl border border-primary/40 bg-cream px-5 py-4 text-left">
                    <div className="flex justify-between text-sm text-ink/80">
                      <dt className="uppercase tracking-[0.25em] text-ink/60">Role</dt>
                      <dd>{String(inviteInfo.role).toUpperCase()}</dd>
                    </div>
                    {inviteInfo.assigned_email && (
                      <div className="mt-2 flex justify-between text-sm text-ink/80">
                        <dt className="uppercase tracking-[0.25em] text-ink/60">Email</dt>
>>>>>>> heroku/main
                        <dd>{String(inviteInfo.assigned_email)}</dd>
                      </div>
                    )}
                    {inviteInfo.expires_at && (
<<<<<<< HEAD
                      <div className="mt-2 flex justify-between text-sm text-charcoal/80">
                        <dt className="uppercase tracking-[0.25em] text-charcoal/60">Expires</dt>
=======
                      <div className="mt-2 flex justify-between text-sm text-ink/80">
                        <dt className="uppercase tracking-[0.25em] text-ink/60">Expires</dt>
>>>>>>> heroku/main
                        <dd>{new Date(String(inviteInfo.expires_at)).toLocaleDateString()}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </form>
            </Card>

            <Card className="bg-white/95">
<<<<<<< HEAD
              <H2 className="text-2xl text-mauve">Request an invitation</H2>
              <P className="mt-3">
                Share a glimpse into your growing family. We’ll respond with availability, a curated welcome, and guidance for moving from member to mentor.
=======
              <H2 className="text-2xl">Need a fresh invitation?</H2>
              <P className="mt-3">
                Share a glimpse into your celebration plans and we’ll reply with availability, next steps, and a
                handcrafted welcome.
>>>>>>> heroku/main
              </P>
              <div className="mt-6">
                <InviteForm />
              </div>
            </Card>
          </motion.div>
        </Section>
<<<<<<< HEAD
    </div>
=======
      </div>
    </MarketingLayout>
>>>>>>> heroku/main
  );
};

export default RequestInvite;
