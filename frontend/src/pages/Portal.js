import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Portal = () => {
  const navigate = useNavigate();
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

      setStatus({ loading: false, error: null, success: true });

      const user = payload?.data?.user;
      if (user?.role === "mentor") {
        navigate("/mentor-portal", { replace: true });
      }
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Unable to sign in. Please try again.",
        success: false,
      });
    }
  };

  return (
    <main className="min-h-screen bg-cream text-darkText px-6 py-20">
      <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-10 text-center shadow-soft backdrop-blur-sm">
        <h1 className="font-playful text-3xl mb-4 text-babyBlue">Member Portal</h1>
        <p className="text-sm leading-relaxed text-darkText/75 font-body">
          Taylor-Made’s private portal is coming soon. Approved members will be able to review their packages, add-ons, Mentor Circle messages, and upcoming concierge touchpoints here.
        </p>
        <p className="mt-4 text-sm text-darkText/60 font-body">
          Need support right now? Email{' '}
          <a
            href="mailto:concierge@taylormadebaby.com"
            className="text-blueberry underline decoration-babyPink/60"
          >
            concierge@taylormadebaby.com
          </a>{' '}
          and Taylor will be in touch within 24 hours.
        </p>
        <form
          className="mt-10 space-y-4 text-left"
          onSubmit={handleSubmit}
        >
          <h2 className="font-playful text-xl text-blueberry text-center">Member Login</h2>
          <div aria-live="polite" className="space-y-2">
            {status.error && (
              <p className="rounded-2xl border border-babyPink/60 bg-babyPink/30 px-4 py-3 text-sm font-body text-darkText/80">
                {status.error}
              </p>
            )}
            {status.success && (
              <p className="rounded-2xl border border-babyBlue/60 bg-babyBlue/30 px-4 py-3 text-sm font-body text-darkText/80">
                Signed in successfully. Concierge tools will unlock shortly.
              </p>
            )}
          </div>
          <label className="block text-sm text-darkText/75 font-body">
            Email
            <input
              type="email"
              value={login.email}
              onChange={handleChange("email")}
              placeholder="you@taylormadebabyco.com"
              className="mt-2 w-full rounded-2xl border border-babyBlue/50 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              required
            />
          </label>
          <label className="block text-sm text-darkText/75 font-body">
            Password
            <input
              type="password"
              value={login.password}
              onChange={handleChange("password")}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-babyBlue/50 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              required
            />
          </label>
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition-transform duration-200 ${
              status.loading ? "opacity-70" : "hover:-translate-y-1 hover:shadow-dreamy"
            }`}
          >
            {status.loading ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Portal;
