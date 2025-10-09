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
import { H1, P } from "../design-system/Typography";
import api from "../lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please share your name so we know who to reply to.")
    .max(120, "Could you shorten your name slightly for us?"),
  email: z
    .string()
    .email("Please enter a valid email address so we can respond.")
    .max(160, "This email looks longer than our system supports."),
  phone: z
    .string()
    .trim()
    .optional(),
  dueDate: z
    .string()
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, "A little more detail will help Taylor tailor her reply.")
    .max(1200, "Feel free to trim a few words so we can read it quickly."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

let hasContactResponseWarning = false;

const createIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const Contact: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dueDate: "",
      message: "",
    },
  });

  const [formAlert, setFormAlert] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = (message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormAlert(null);

    try {
      const response = await api.post(
        "/api/contact",
        {
          name: values.name,
          email: values.email,
          phone: values.phone?.trim() || "",
          due_date: values.dueDate?.trim() || "",
          message: values.message,
        },
        {
          headers: {
            "Idempotency-Key": createIdempotencyKey(),
          },
        }
      );

      const payload = response?.data;
      if (!payload && process.env.NODE_ENV !== "production" && !hasContactResponseWarning) {
        console.warn("Contact form: unexpected response shape", response);
        hasContactResponseWarning = true;
      }

      const ok = payload?.ok;
      const message = payload?.message;
      const fieldErrors = payload?.fieldErrors;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
          setError(field as keyof ContactFormValues, {
            type: "server",
            message: fieldMessage as string,
          });
        });
        setFormAlert(message || payload?.error || "Please review the highlighted fields.");
        return;
      }

      if (ok === false) {
        setFormAlert(message || payload?.error || "We couldn’t send your note. Please try again shortly.");
        return;
      }

      reset({
        name: "",
        email: "",
        phone: "",
        dueDate: "",
        message: "",
      });
      showToast(message || "Thank you! Taylor will be in touch within one business day.");
    } catch (error: any) {
      const payload = error?.response?.data;
      const message = payload?.message || payload?.error;
      const fieldErrors = payload?.fieldErrors;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.entries(fieldErrors).forEach(([field, fieldMessage]) => {
          setError(field as keyof ContactFormValues, {
            type: "server",
            message: fieldMessage as string,
          });
        });
        setFormAlert(message || "Please review the highlighted fields.");
        return;
      }

      setFormAlert(
        message || "We couldn’t send your request just yet. Email RegistryWithTaylor@gmail.com and we’ll take care of you."
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
          eyebrow="Contact Taylor"
          title="Ready to bring calm to your baby planning?"
          description="Share a few details below and we’ll schedule a concierge consultation designed around your ideal timeline. Expect a warm reply within one business day."
        />
      </motion.div>

      <CardSection variant="plain">
        <motion.div
          className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          <Card className="bg-white/95">
            <form className="space-y-5" noValidate onSubmit={onSubmit}>
              {alertMessage && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-600">
                  {alertMessage}
                </div>
              )}

              <Input
                id="contact-name"
                label="Name"
                placeholder="Your full name"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                id="contact-email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                id="contact-phone"
                label="Phone"
                type="tel"
                placeholder="(480) 555-0100"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                id="contact-due-date"
                label="Due date or celebration date"
                placeholder="MM/DD/YYYY"
                error={errors.dueDate?.message}
                {...register("dueDate")}
              />
              <Controller
                control={control}
                name="message"
                render={({ field }) => (
                  <label className="flex flex-col gap-2 font-body text-sm text-ink/90">
                    <span className="text-xs uppercase tracking-[0.3em] text-ink/70">How can we help?</span>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className={`rounded-2xl border border-primary/50 bg-cream px-4 py-3 text-ink shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                        errors.message ? "border-rose-300 focus:border-rose-400 focus-visible:ring-rose-300" : ""
                      }`}
                      placeholder="Tell Taylor about your registry, nursery, or celebration goals."
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {errors.message && <span className="text-xs text-rose-500">{errors.message.message}</span>}
                  </label>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Book Your Consultation"}
              </Button>
            </form>
          </Card>

          <Card className="bg-white/95">
            <div className="space-y-4">
              <H1 className="text-3xl">Concierge details</H1>
              <P>Email: hello@taylormadebaby.co</P>
              <P>Consultation hours: Monday – Thursday, 9am – 4pm MST.</P>
              <P>
                Prefer a private introduction? Request an invite with your preferred contact method and we’ll
                reach out personally.
              </P>
              <Button as="a" href="/request-invite" variant="ghost">
                Request Invite
              </Button>
            </div>
          </Card>
        </motion.div>
      </CardSection>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-8 left-1/2 z-30 w-[min(90%,320px)] -translate-x-1/2 rounded-[1.75rem] border px-6 py-3 text-sm shadow-soft transition ${
            toast.tone === "success"
              ? "border-softMint/70 bg-softMint/90 text-blueberry"
              : "border-rose-200 bg-rose-50/90 text-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </PageWrapper>
  );
};

export default Contact;
