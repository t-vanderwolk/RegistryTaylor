import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-softPink/30 via-white to-softMint/35 text-blueberry">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,218,221,0.45),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(197,220,216,0.35),transparent_55%),radial-gradient(circle_at_55%_85%,rgba(211,228,247,0.35),transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="surface-panel order-1 flex-1 text-blueberry motion-safe:animate-fade-in-up lg:max-w-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">Private Sign-In</p>
              <h2 className="text-3xl font-serif sm:text-4xl">Welcome Back</h2>
              <p className="text-xs text-neutral-600">
                Use the credentials shared by your concierge lead. Access adjusts instantly based on your role.
              </p>
            </div>
            <div aria-live="polite" className="space-y-2">
              {(status.error || authError) && (
                <p className="rounded-2xl border border-primary/40 bg-softPink/50 px-4 py-3 text-sm text-neutral-600">
                  {status.error || authError}
                </p>
              )}
              {status.success && (
                <p className="rounded-2xl border border-primary/40 bg-softMint/45 px-4 py-3 text-sm text-neutral-600">
                  Signed in successfully. Redirecting to your tailored workspace…
                </p>
              )}
            </div>
            <label className="block text-sm text-neutral-600">
              Email Address
              <input
                type="email"
                value={login.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-primary/25 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>
            <label className="block text-sm text-neutral-600">
              Password
              <input
                type="password"
                value={login.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-primary/25 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </label>
            <button
              type="submit"
              disabled={status.loading || authLoading}
              className={`w-full rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition-transform duration-200 ${
                status.loading || authLoading ? "cursor-wait opacity-75" : "hover:-translate-y-1 hover:scale-105 hover:shadow-md"
              }`}
            >
              {status.loading || authLoading ? "Signing In…" : "Sign In"}
            </button>
            <p className="text-center text-[0.7rem] text-neutral-500">
              Experiencing trouble? Contact your concierge lead for a password reset or temporary access link.
            </p>
          </form>
        </aside>

        <section className="surface-panel order-2 flex-1 space-y-6 text-left text-blueberry motion-safe:animate-fade-in-up">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">Taylor-Made Baby Co.</p>
              <h1 className="mt-2 text-3xl font-serif sm:text-4xl">Concierge Portal Access</h1>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-softMint/45 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-primary shadow-soft">
              Secure
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr] lg:items-start">
            <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
              Welcome to your private planning lounge. Sign in to view bespoke registries, concierge touchpoints, family messages, and upcoming celebrations curated just for you.
            </p>
            <div className="hidden overflow-hidden rounded-[2.5rem] border border-primary/20 shadow-soft lg:block">
              <img
                src={portalIllustration}
                alt="Concierge video call for Taylor-Made clients"
                className="h-56 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CTA_CARDS.map(({ title, description, icon }) => (
              <div key={title} className="surface-card h-full text-left text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-3 text-sm font-heading uppercase tracking-[0.25em] text-primary/80">{title}</h3>
                <p className="mt-2 text-xs text-neutral-600">{description}</p>
              </div>
            ))}
          </div>
          <div className="surface-card border border-primary/25 bg-softPink/45">
            <p className="text-sm leading-relaxed text-neutral-600">
              Need concierge attention before logging in? Email
              {' '}
              <a className="font-heading text-blueberry underline decoration-babyPink/60" href="mailto:RegistryWihTaylor@gmail.com">
                RegistryWihTaylor@gmail.com
              </a>
              {' '}or text the private hotline and Taylor will reply within 24 hours.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Portal;
