import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
    setStatus("submitted");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-gold/30 bg-ivory text-charcoal-500">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 py-16 md:grid-cols-[1.2fr,1fr,1fr] md:px-10">
        <div className="space-y-4">
          <Link to="/" className="inline-flex flex-col text-left" aria-label="Taylor-Made Baby Co. home">
            <span className="font-script text-3xl text-mauve-700 leading-none">Taylor-Made</span>
            <span className="font-serif text-lg text-charcoal-700 leading-none">Baby Co.</span>
          </Link>
          <p className="max-w-sm text-sm">
            A concierge-led registry, academy, and community guiding calm beginnings. Membership is curated by invitation and rooted in mentorship.
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <h2 className="font-serif text-base text-charcoal-700">Concierge contact</h2>
          <ul className="space-y-2">
            <li>
              <a href="mailto:RegistryWithTaylor@gmail.com" className="hover:text-mauve-700">
                RegistryWithTaylor@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+14805551234" className="hover:text-mauve-700">
                +1 (505) 660-5436
              </a>
            </li>
            <li>Scottsdale · Phoenix · Remote</li>
          </ul>
          <nav aria-label="Footer navigation">
            <ul className="grid gap-2 text-sm">
              <li>
                <Link to="/" className="hover:text-mauve-700">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-mauve-700">
                  Learn · Plan · Connect
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-mauve-700">
                  Membership Journey
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-mauve-700">
                  Concierge Journal
                </Link>
              </li>
              <li>
                <Link to="/request-invite" className="hover:text-mauve-700">
                  Request Your Invite
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="space-y-4 text-sm">
          <h3 className="font-serif text-base text-charcoal-700">Concierge dispatch</h3>
          <p>Receive Academy highlights, mentor reflections, and invitation windows once a month.</p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                required
                placeholder="you@example.com"
                className="rounded-lg border border-mauve-100 bg-white px-4 py-3 text-sm text-charcoal-700 focus:border-mauve-500 focus:outline-none focus:ring-1 focus:ring-mauve-500"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-700"
            >
              {status === "submitted" ? "You're on the list" : "Join the circle"}
            </button>
          </form>
          <p className="text-xs text-charcoal-500" aria-live="polite">
            {status === "submitted"
              ? "Expect gentle updates filled with mentorship notes and seasonal guidance."
              : "We never spam. Unsubscribe anytime."}
          </p>
        </div>
      </div>

      <div className="border-t border-gold/30 bg-ivory">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm md:flex-row md:px-10">
          <p className="text-charcoal-500">&copy; {new Date().getFullYear()} Taylor-Made Baby Co.</p>
          <div className="flex items-center gap-4 text-mauve-700">
            <a href="https://instagram.com" className="transition hover:text-gold/40" aria-label="Instagram">
              Instagram
            </a>
            <a href="https://pinterest.com" className="transition hover:text-gold/40" aria-label="Pinterest">
              Pinterest
            </a>
            <a href="mailto:RegistryWithTaylor@gmail.com" className="transition hover:text-gold/40" aria-label="Email Taylor">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
