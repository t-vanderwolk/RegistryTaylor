import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Portal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setLogin((current) => ({ ...current, [field]: value }));
    setStatus((current) => ({ ...current, error: null, success: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login.email.trim(), password: login.password }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload?.error?.message || "Unable to sign in. Please try again.";
        throw new Error(message);
      }

      if (payload?.data?.token) {
        localStorage.setItem("tm_token", payload.data.token);
      }
      if (payload?.data?.user) {
        localStorage.setItem("tm_user", JSON.stringify(payload.data.user));
      }

      const user = payload?.data?.user;
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
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Unable to sign in. Please try again.",
        success: false,
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-babyPink/20 to-babyBlue/30 text-darkText">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,210,0.35),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(167,216,247,0.35),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(220,198,246,0.3),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-start">
        <section className="flex-1 space-y-8">
          <div className="flex flex-col gap-6 rounded-[2.5rem] border border-babyPink/40 bg-white/85 p-10 shadow-soft backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-left">
                <p className="text-xs uppercase tracking-[0.45em] text-darkText/50 font-heading">Taylor-Made Baby Co.</p>
                <h1 className="font-playful text-3xl text-blueberry sm:text-4xl">Concierge Portal</h1>
              </div>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-babyBlue/40 bg-babyBlue/20 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
                Secure Access
              </span>
            </div>
            <p className="font-body text-sm leading-relaxed text-darkText/75">
              Your personal planning cockpit. Members, mentors, and concierge admin teams gather here to review bespoke registries, design touchpoints, upcoming events, and private messages.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{
                title: "Members",
                copy: "Peek at curated plans, RSVPs, and concierge requests in a single glance.",
                icon: "💛",
              }, {
                title: "Mentors",
                copy: "Track circle updates, message families, and log bespoke recommendations.",
                icon: "📝",
              }, {
                title: "Admin",
                copy: "Oversee events, invitations, and premium add-ons with concierge precision.",
                icon: "🗂️",
              }].map(({ title, copy, icon }) => (
                <div
                  key={title}
                  className="h-full rounded-3xl border border-babyBlue/30 bg-white/90 p-5 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy"
                >
                  <span className="text-2xl">{icon}</span>
                  <h3 className="mt-3 font-heading text-sm uppercase tracking-[0.25em] text-blueberry">{title}</h3>
                  <p className="mt-2 text-xs font-body leading-relaxed text-darkText/70">{copy}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-babyPink/40 bg-babyPink/15 p-6 text-sm font-body leading-relaxed text-darkText/75">
              <p>
                Need concierge attention before logging in? Email
                {' '}
                <a className="font-heading text-blueberry underline decoration-babyPink/60" href="mailto:RegistryWihTaylor@gmail.com">
                  RegistryWihTaylor@gmail.com
                </a>
                {' '}or text the private hotline and Taylor will respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <aside className="max-w-xl flex-1 rounded-[2.5rem] border border-babyPink/40 bg-white/92 p-10 shadow-soft backdrop-blur-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-darkText/50 font-heading">Private Sign-In</p>
              <h2 className="font-playful text-2xl text-blueberry">Welcome Back</h2>
              <p className="text-xs font-body text-darkText/60">
                Use the credentials shared by your concierge lead. Access adjusts instantly based on your role.
              </p>
            </div>
            <div aria-live="polite" className="space-y-2">
              {status.error && (
                <p className="rounded-2xl border border-babyPink/60 bg-babyPink/25 px-4 py-3 text-sm font-body text-darkText/80">
                  {status.error}
                </p>
              )}
              {status.success && (
                <p className="rounded-2xl border border-babyBlue/60 bg-babyBlue/25 px-4 py-3 text-sm font-body text-darkText/80">
                  Signed in successfully. Redirecting to your tailored workspace…
                </p>
              )}
            </div>
            <label className="block text-sm font-body text-darkText/75">
              Email Address
              <input
                type="email"
                value={login.email}
                onChange={handleChange("email")}
                placeholder="RegistryWihTaylor@gmail.com"
                className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                required
              />
            </label>
            <label className="block text-sm font-body text-darkText/75">
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
              disabled={status.loading}
              className={`w-full rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition-transform duration-200 ${
                status.loading ? "cursor-wait opacity-70" : "hover:-translate-y-1 hover:shadow-dreamy"
              }`}
            >
              {status.loading ? "Signing In…" : "Sign In"}
            </button>
            <p className="text-center text-[0.7rem] font-body text-darkText/50">
              Experiencing trouble? Contact your concierge lead for a password reset or temporary access link.
            </p>
          </form>
        </aside>
      </div>
    </main>
  );
};

export default Portal;
