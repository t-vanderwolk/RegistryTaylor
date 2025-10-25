import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/taylor-made-logo.png";

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
    <footer className="mt-24 bg-ivory text-charcoal" aria-labelledby="site-footer">
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1.2fr,1fr,1fr]">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-4" aria-label="Taylor-Made Baby Co. home">
            <img
              src={logoImage}
              srcSet={`${logoImage} 1x, ${logoImage} 2x`}
              alt="Taylor-Made Baby Co. crest"
              className="h-14 w-auto rounded-full border border-mauve/25 bg-white p-3 shadow-soft"
            />
            <div className="leading-tight">
              <p className="font-heading text-xl text-charcoal">Taylor-Made Baby Co.</p>
              <p className="text-[0.65rem] font-heading uppercase tracking-[0.35em] text-charcoal/70">
                Invite-only baby planning concierge
              </p>
            </div>
          </Link>
          <p className="max-w-sm text-sm text-charcoal/70">
            Personalized registry styling, nursery design, and celebration planning crafted to keep every milestone calm,
            intimate, and beautifully choreographed.
          </p>
        </div>

        <div className="space-y-4 text-sm text-charcoal/75">
          <h2 id="site-footer" className="text-xs font-heading uppercase tracking-[0.4em] text-charcoal/60">
            Concierge Contact
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:RegistryWithTaylor@gmail.com"
                className="transition hover:text-mauve"
                aria-label="Email Taylor-Made Baby Co."
              >
                RegistryWithTaylor@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+14805551234" className="transition hover:text-mauve" aria-label="Call Taylor-Made Baby Co.">
                +1 (505) 660-5436
              </a>
            </li>
            <li className="text-sm text-charcoal/60">Scottsdale · Phoenix · Remote</li>
          </ul>
          <nav aria-label="Footer navigation">
            <ul className="grid gap-2 text-[0.75rem] font-heading uppercase tracking-[0.32em] text-charcoal/65">
              <li>
                <Link to="/" className="transition hover:text-charcoal">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="transition hover:text-charcoal">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/membership" className="transition hover:text-charcoal">
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition hover:text-charcoal">
                  Concierge Notes
                </Link>
              </li>
              <li>
                <Link to="/request-invite" className="transition hover:text-charcoal">
                  Request Invite
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="space-y-4 text-sm text-charcoal/75">
          <h3 className="text-xs font-heading uppercase tracking-[0.4em] text-charcoal/60">Monthly Journal</h3>
          <p>
            Receive pastel mood boards, registry edit notes, and concierge openings delivered with a soft touch once a month.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/60">
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
                className="rounded-2xl border border-mauve/35 bg-white px-4 py-3 font-body text-sm text-charcoal shadow-inner focus:border-mauve focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
            >
              {status === "submitted" ? "Welcome in" : "Join the list"}
            </button>
          </form>
          <p className="text-xs text-charcoal/60" aria-live="polite">
            {status === "submitted" ? "You’re on the list—expect gentle updates soon." : "We never spam. Unsubscribe anytime."}
          </p>
        </div>
      </div>

      <div className="border-t border-gold/30 bg-ivory/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs font-heading uppercase tracking-[0.35em] text-charcoal/65 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Taylor-Made Baby Co.</p>
          <div className="flex items-center gap-3 text-mauve">
            <a href="https://instagram.com" className="transition hover:text-charcoal" aria-label="Instagram">
              Instagram
            </a>
            <span aria-hidden="true">•</span>
            <a href="https://pinterest.com" className="transition hover:text-charcoal" aria-label="Pinterest">
              Pinterest
            </a>
            <span aria-hidden="true">•</span>
            <a href="mailto:RegistryWithTaylor@gmail.com" className="transition hover:text-charcoal" aria-label="Email Taylor">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
