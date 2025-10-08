import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroBackdrop from "../assets/video-chat.jpeg";
import PageTitle from "../components/UI/PageTitle";

const portalDestinations = {
  admin: "/admin",
  mentor: "/mentor",
  client: "/dashboard",
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
    <div className="space-y-20 bg-[#FFF8F2] pb-24 pt-16 text-[#4A3B2E] sm:space-y-24">
      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#F7E5EE] via-[#FFF8F2] to-[#E4CFDA] p-6 text-center shadow-md sm:p-12">
        <img
          src={heroBackdrop}
          alt="Concierge video chat"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
        />
        <div className="relative space-y-4">
          <PageTitle eyebrow="Private Member Portal" subtitle="Member Login" />
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
            Lifetime concierge access begins here. Sign in to reach your registries, celebration plans, community, and concierge messaging.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-10 rounded-2xl border border-[#E3CAD6]/50 bg-white/85 p-6 shadow-md backdrop-blur-sm sm:grid-cols-[1.1fr,0.9fr] sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <header className="space-y-3 text-left">
            <h2 className="text-xl font-serif text-[#4A3B2E]">Member Login</h2>
            <p className="text-sm leading-relaxed text-[#5E5873]">
              Enter the credentials shared by your concierge lead. Access adjusts instantly based on your membership tier.
            </p>
          </header>

          {(status.error || authError) && (
            <p className="rounded-2xl border border-[#E9CADB] bg-[#FCECF4] px-4 py-3 text-sm text-[#7F6B74]" aria-live="polite">
              {status.error || authError}
            </p>
          )}

          <label className="block text-sm text-[#5E5873]">
            Email Address
            <input
              type="email"
              value={credentials.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-full border border-[#C17BA5]/40 bg-white px-4 py-3 text-sm text-[#4A3B2E] shadow-inner focus:border-[#C17BA5] focus:outline-none focus:ring-2 focus:ring-[#C17BA5]/40"
            />
          </label>

          <label className="block text-sm text-[#5E5873]">
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={handleChange("password")}
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-full border border-[#C17BA5]/40 bg-white px-4 py-3 text-sm text-[#4A3B2E] shadow-inner focus:border-[#C17BA5] focus:outline-none focus:ring-2 focus:ring-[#C17BA5]/40"
            />
          </label>

          <button
            type="submit"
            className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#C17BA5] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 ${
              status.loading || authLoading ? "cursor-not-allowed opacity-75" : ""
            }`}
            disabled={status.loading || authLoading}
          >
            {status.loading || authLoading ? "Signing In…" : "Sign In"}
          </button>

          <p className="text-xs text-[#7F6B74]">
            Trouble logging in? Email{' '}
            <a className="font-semibold text-[#AF7C9D] underline" href="mailto:RegistryWithTaylor@gmail.com">
              RegistryWithTaylor@gmail.com
            </a>{' '}
            for a refreshed link.
          </p>
        </form>

        <aside className="flex flex-col gap-5 rounded-2xl border border-[#E3CAD6]/40 bg-white/90 p-6 text-left shadow-inner">
          <div className="space-y-3">
            <h3 className="text-lg font-serif text-[#4A3B2E]">Not a member yet?</h3>
            <p className="text-sm leading-relaxed text-[#5E5873]">
              Taylor serves a limited number of families each season. Request an invite or explore membership tiers to secure lifetime access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/request-invite"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C17BA5] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              Request Invite
            </Link>
            <Link
              to="/membership"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#C17BA5]/60 bg-white/85 px-6 py-3 text-sm font-semibold text-[#5E5873] shadow-md transition hover:scale-105"
            >
              Explore Memberships
            </Link>
          </div>
          <ul className="space-y-3 text-xs uppercase tracking-[0.4em] text-[#7F6B74]">
            <li>Private clientele · lifetime concierge access</li>
            <li>Design footprint · Tempe · Phoenix · Scottsdale · Cape Cod</li>
            <li>Celebrations · Registries · Nursery Styling</li>
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default Portal;
