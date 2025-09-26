import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-softBeige via-white to-babyBlue/25 text-blueberry">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,218,221,0.4),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(167,199,231,0.35),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(216,191,216,0.35),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="surface-panel order-1 flex-1 text-blueberry lg:max-w-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">Private Sign-In</p>
              <h2 className="text-2xl font-heading sm:text-3xl">Welcome Back</h2>
              <p className="text-xs text-midnight/70">
                Use the credentials shared by your concierge lead. Access adjusts instantly based on your role.
              </p>
            </div>
            <div aria-live="polite" className="space-y-2">
              {(status.error || authError) && (
                <p className="rounded-2xl border border-babyPink/60 bg-babyPink/25 px-4 py-3 text-sm text-midnight/75">
                  {status.error || authError}
                </p>
              )}
              {status.success && (
                <p className="rounded-2xl border border-babyBlue/60 bg-babyBlue/25 px-4 py-3 text-sm text-midnight/75">
                  Signed in successfully. Redirecting to your tailored workspace…
                </p>
              )}
            </div>
            <label className="block text-sm text-midnight/75">
              Email Address
              <input
                type="email"
                value={login.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                required
              />
            </label>
            <label className="block text-sm text-midnight/75">
              Password
              <input
                type="password"
                value={login.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                required
              />
            </label>
            <button
              type="submit"
              disabled={status.loading || authLoading}
              className={`w-full rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition-transform duration-200 ${
                status.loading || authLoading ? "cursor-wait opacity-70" : "hover:-translate-y-1 hover:shadow-dreamy"
              }`}
            >
              {status.loading || authLoading ? "Signing In…" : "Sign In"}
            </button>
            <p className="text-center text-[0.7rem] text-midnight/60">
              Experiencing trouble? Contact your concierge lead for a password reset or temporary access link.
            </p>
          </form>
        </aside>

        <section className="surface-panel order-2 flex-1 space-y-6 text-left text-blueberry">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/60">Taylor-Made Baby Co.</p>
              <h1 className="mt-2 text-3xl font-heading sm:text-4xl">Concierge Portal Access</h1>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-babyBlue/25 bg-babyBlue/15 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
              Secure
            </span>
          </div>
          <p className="text-sm leading-relaxed text-midnight/75 sm:text-base">
            Welcome to your private planning lounge. Sign in to view bespoke registries, concierge touchpoints, family messages, and upcoming celebrations curated just for you.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CTA_CARDS.map(({ title, description, icon }) => (
              <div key={title} className="surface-card h-full text-left text-blueberry">
                <span className="text-2xl">{icon}</span>
                <h3 className="mt-3 text-sm font-heading uppercase tracking-[0.25em]">{title}</h3>
                <p className="mt-2 text-xs text-midnight/70">{description}</p>
              </div>
            ))}
          </div>
          <div className="surface-card bg-babyPink/15">
            <p className="text-sm leading-relaxed text-midnight/75">
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
