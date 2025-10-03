import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import PageHero from "../components/UI/PageHero";
import Button from "../components/UI/Button";
import SectionDivider from "../components/UI/SectionDivider";

import portalIllustration from "../assets/video-chat.jpeg";

const CTA_CARDS = [
  {
    title: "Members",
    description: "Review curated plans, RSVP to private events, and bookmark bespoke recommendations.",
    icon: "🌸",
  },
  {
    title: "Mentors",
    description: "Share concierge insight, respond to families, and coordinate specialty support.",
    icon: "🕊️",
  },
  {
    title: "Admin",
    description: "Oversee invites, concierge requests, and premium add-ons with graceful precision.",
    icon: "✨",
  },
];

const cardClass =
  "flex h-full flex-col gap-3 rounded-3xl border border-primary/20 bg-white/95 p-6 text-blueberry shadow-soft transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-dreamy";

const fadeInClass = "motion-safe:animate-fade-in-up";

const Portal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginUser, loading: authLoading, error: authError } = useAuth();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (field) => (event) => {
    setLogin((current) => ({ ...current, [field]: event.target.value }));
    setStatus((current) => ({ ...current, error: null, success: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    const result = await loginUser(login.email.trim(), login.password);
    if (!result.success) {
      setStatus({ loading: false, error: result.error || authError || "Unable to sign in.", success: false });
      return;
    }

    const user = result.user;
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = location.state?.redirectTo || searchParams.get("redirect");
    const destinations = {
      admin: "/admin-portal",
      mentor: "/mentor-portal",
      client: "/client-portal",
    };

    if (redirectTo) {
      setStatus({ loading: false, error: null, success: true });
      navigate(redirectTo, { replace: true });
      return;
    }

    if (user?.role && destinations[user.role]) {
      setStatus({ loading: false, error: null, success: true });
      navigate(destinations[user.role], { replace: true });
      return;
    }

    setStatus({ loading: false, error: null, success: true });
  };

  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24">
      <PageHero
        backgroundImage={portalIllustration}
        eyebrow="Concierge Portal"
        subtitle="Portal Access"
        description="Sign in to your pastel planning lounge. Tailored registries, nursery roadmaps, and celebration checklists stay polished here for your family and mentors."
        primaryCta={{ label: "Need an Invite?", to: "/request-invite", className: "px-9 py-3" }}
        secondaryCta={{ label: "Contact Taylor", to: "/contact", className: "px-9 py-3" }}
      />

      <section
        className={`mx-auto grid max-w-[1200px] gap-8 rounded-[3.25rem] border border-primary/25 bg-white/95 px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:grid-cols-[0.95fr,1fr] md:px-16 ${fadeInClass}`}
      >
        <aside className="flex flex-col gap-6">
          <header className="space-y-3 text-center md:text-left">
            <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Private Sign-In</p>
            <h2 className="text-3xl font-heading text-blueberry sm:text-4xl">Welcome Back</h2>
            <p className="text-sm leading-relaxed text-blueberry/70">
              Use the credentials shared by your concierge lead. Access adjusts instantly based on your role.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div aria-live="polite" className="space-y-2">
              {(status.error || authError) && (
                <p className="rounded-3xl border border-primary/35 bg-softPink/40 px-4 py-3 text-sm text-blueberry/75">
                  {status.error || authError}
                </p>
              )}
              {status.success && (
                <p className="rounded-3xl border border-primary/35 bg-softMint/40 px-4 py-3 text-sm text-blueberry/75">
                  Signed in successfully. Redirecting to your tailored workspace…
                </p>
              )}
            </div>

            <label className="block text-sm text-blueberry/70">
              Email Address
              <input
                type="email"
                value={login.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-full border border-primary/25 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>

            <label className="block text-sm text-blueberry/70">
              Password
              <input
                type="password"
                value={login.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-full border border-primary/25 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>

            <Button
              type="submit"
              size="md"
              className={`w-full bg-primary !text-white px-6 py-3 ${status.loading || authLoading ? "opacity-75" : ""}`}
              disabled={status.loading || authLoading}
            >
              {status.loading || authLoading ? "Signing In…" : "Sign In"}
            </Button>

            <p className="text-center text-[0.7rem] text-blueberry/60">
              Experiencing trouble? Contact your concierge lead for a password reset or temporary access link.
            </p>
          </form>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="space-y-4 text-left">
            <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Taylor-Made Baby Co.</p>
            <h2 className="text-3xl font-heading text-blueberry sm:text-4xl">Concierge Portal Access</h2>
            <SectionDivider className="my-4" />
            <p className="text-sm leading-relaxed text-blueberry/75 sm:text-base">
              Welcome to your private planning lounge. Sign in to view bespoke registries, concierge touchpoints, family messages, and upcoming celebrations curated just for you.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2.75rem] border border-primary/20 shadow-soft">
            <img src={portalIllustration} alt="Concierge video call" className="h-56 w-full object-cover" loading="lazy" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CTA_CARDS.map(({ title, description, icon }) => (
              <article key={title} className={cardClass}>
                <span className="text-2xl">{icon}</span>
                <h3 className="text-sm font-heading uppercase tracking-[0.35em] text-primary/80">{title}</h3>
                <p className="text-xs text-blueberry/70 leading-relaxed">{description}</p>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-primary/25 bg-softPink/45 p-6 text-left shadow-soft">
            <p className="text-sm leading-relaxed text-blueberry/75">
              Need concierge attention before logging in? Email
              {" "}
              <a className="font-heading text-primary underline decoration-babyPink/60" href="mailto:RegistryWihTaylor@gmail.com">
                RegistryWihTaylor@gmail.com
              </a>
              {" "}or text the private hotline and Taylor will reply within 24 hours.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Portal;
