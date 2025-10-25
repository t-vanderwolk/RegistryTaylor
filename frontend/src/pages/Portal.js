import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H1, H2, P } from "../design-system/Typography";
import Input from "../design-system/Input";
import heroBackdrop from "../assets/video-chat.jpeg";

const portalDestinations = {
  admin: "/admin",
  mentor: "/mentor",
  client: "/dashboard",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Portal = () => {
  const { login: loginUser, loading: authLoading, error: authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (field) => (event) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus({ loading: false, error: null, success: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    const result = await loginUser(credentials.email.trim(), credentials.password);
    if (!result.success) {
      setStatus({ loading: false, error: result.error || authError || "Unable to sign in.", success: false });
      return;
    }

    const user = result.user;
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = location.state?.redirectTo || searchParams.get("redirect");

    if (redirectTo) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (user?.role && portalDestinations[user.role]) {
      navigate(portalDestinations[user.role], { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="space-y-20 bg-ivory pb-24 pt-16 sm:space-y-28">
        <Section>
          <motion.div
            className="relative overflow-hidden rounded-[3rem] border border-mauve/40 bg-white/90 px-6 py-16 text-center shadow-[0_28px_70px_-30px_rgba(62,58,71,0.3)] sm:px-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <img
              src={heroBackdrop}
              alt="Concierge video chat"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
            />
            <div className="relative space-y-4">
              <span className="inline-flex items-center justify-center rounded-full bg-mauve/40 px-5 py-2 text-xs font-heading uppercase tracking-[0.35em] text-charcoal">
                Private Member Portal
              </span>
              <H1>Welcome back, concierge member</H1>
              <P className="mx-auto max-w-2xl">
                Sign in to access your registries, celebration plans, concierge messaging, and exclusive lounge notes.
              </P>
            </div>
          </motion.div>
        </Section>

        <Section>
          <motion.div
            className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <Card className="space-y-6 bg-white/95 shadow-soft">
              <header className="space-y-3">
                <H2 className="text-xl">Member login</H2>
                <P>
                  Enter the credentials shared by your concierge lead. Access adjusts instantly based on your membership tier.
                </P>
              </header>
              {(status.error || authError) && (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500" aria-live="polite">
                  {status.error || authError}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="portal-email"
                  label="Email Address"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  id="portal-password"
                  label="Password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange("password")}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="submit"
                  disabled={status.loading || authLoading}
                  className="w-full bg-mauve text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] hover:brightness-105"
                >
                  {status.loading || authLoading ? "Signing In…" : "Sign In"}
                </Button>
                <P className="text-xs text-charcoal/60">
                  Trouble logging in? Email{' '}
                  <a className="font-semibold text-mauve underline" href="mailto:RegistryWithTaylor@gmail.com">
                    RegistryWithTaylor@gmail.com
                  </a>{' '}
                  for a refreshed link.
                </P>
              </form>
            </Card>

            <Card className="space-y-6 bg-white/95 shadow-soft">
              <div className="space-y-3">
                <H2 className="text-xl">Not a member yet?</H2>
                <P>
                  Taylor serves a limited number of families each season. Request an invite or explore membership tiers to secure lifetime access.
                </P>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/request-invite"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-mauve px-6 py-3 text-sm font-heading uppercase tracking-[0.35em] text-white shadow-soft transition hover:brightness-105"
                >
                  Request Invite
                </Link>
                <Link
                  to="/membership"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-mauve/60 bg-white/90 px-6 py-3 text-sm font-heading uppercase tracking-[0.35em] text-charcoal shadow-soft transition hover:bg-mauve/10"
                >
                  Membership Overview
                </Link>
              </div>
              <ul className="space-y-3 text-xs uppercase tracking-[0.35em] text-charcoal/60">
                <li>Private clientele · lifetime concierge access</li>
                <li>Design footprint · Tempe · Phoenix · Scottsdale · Cape Cod</li>
                <li>Celebrations · Registries · Nursery Styling</li>
              </ul>
            </Card>
          </motion.div>
        </Section>
    </div>
  );
};

export default Portal;
