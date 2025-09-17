import React, { useState } from "react";

const Portal = () => {
  const [login, setLogin] = useState({ email: "", password: "" });

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
          onSubmit={(event) => event.preventDefault()}
        >
          <h2 className="font-playful text-xl text-blueberry text-center">Member Login</h2>
          <label className="block text-sm text-darkText/75 font-body">
            Email
            <input
              type="email"
              value={login.email}
              onChange={(event) => setLogin({ ...login, email: event.target.value })}
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
              onChange={(event) => setLogin({ ...login, password: event.target.value })}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-babyBlue/50 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
};

export default Portal;
