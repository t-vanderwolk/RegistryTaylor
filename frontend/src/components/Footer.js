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
    <footer className="mt-24 bg-gradient-to-b from-softBeige via-white to-white text-midnight" aria-labelledby="site-footer">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-4" aria-label="Taylor-Made Baby Co. home">
            <img
              src={logoImage}
              srcSet={`${logoImage} 1x, ${logoImage} 2x`}
              alt="Taylor-Made Baby Co. crest"
              className="h-14 w-auto rounded-full border border-babyBlue/25 bg-white p-3 shadow-soft"
            />
            <div className="leading-tight">
              <p className="font-heading text-xl text-blueberry">Taylor-Made Baby Co.</p>
              <p className="text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blueberry/70">
                Invite-Only Baby Planning Concierge
              </p>
            </div>
          </Link>
          <p className="max-w-xs text-sm text-midnight/70">
            Personalized registry styling, nursery design, and event planning for modern parents seeking joy over overwhelm.
          </p>
        </div>

        <div className="space-y-4 text-sm text-midnight/70">
          <h2 id="site-footer" className="text-lg font-heading text-blueberry">
            Concierge Contact
          </h2>
          <p>Ready to chat with Taylor? Reach out directly.</p>
          <ul className="space-y-2">
            <li>
              <a href="mailto:RegistryWithTaylor@gmail.com" className="text-blueberry transition hover:text-babyBlue" aria-label="Email Taylor-Made Baby Co.">
                RegistryWithTaylor@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+14805551234" className="text-blueberry transition hover:text-babyBlue" aria-label="Call Taylor-Made Baby Co.">
                +1 (505) 660-5436
              </a>
            </li>
            <li className="text-sm">
              Scottsdale · Phoenix · Remote
            </li>
          </ul>
          <nav aria-label="Footer">
            <ul className="grid gap-2 text-[0.75rem] font-heading uppercase tracking-[0.3em] text-blueberry/70">
              <li>
                <Link to="/" className="hover:text-blueberry">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-blueberry">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/membership" className="hover:text-blueberry">
                  Membership
                </Link>
              </li>
              <li>
                <a href="/#request-invite" className="hover:text-blueberry">
                  Request Invite
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="space-y-4 text-sm text-midnight/70">
          <h3 className="text-lg font-heading text-blueberry">Stay in the loop</h3>
          <p>Receive pastel-perfect nursery mood boards and concierge openings once a month.</p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry/70">
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
                className="rounded-2xl border border-babyBlue/40 bg-white/90 px-4 py-3 font-body text-sm text-midnight shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/70"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full border border-babyBlue/40 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
            >
              Join the list
            </button>
          </form>
          <p className="text-xs" aria-live="polite">
            {status === "submitted" ? "You're on the list!" : "We respect your inbox—unsubscribe anytime."}
          </p>
        </div>
      </div>

      <div className="border-t border-babyBlue/25 px-6 py-6 text-center text-[0.7rem] font-heading uppercase tracking-[0.35em] text-blueberry/70">
        © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
