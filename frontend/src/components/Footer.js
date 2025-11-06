import React, { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
import logoImage from "../assets/taylor-made-logo.png";
>>>>>>> heroku/main

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) return;
<<<<<<< HEAD
=======

>>>>>>> heroku/main
    setStatus("submitted");
    setEmail("");
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> heroku/main
                RegistryWithTaylor@gmail.com
              </a>
            </li>
            <li>
<<<<<<< HEAD
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
=======
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
>>>>>>> heroku/main
                  Home
                </Link>
              </li>
              <li>
<<<<<<< HEAD
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
=======
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
>>>>>>> heroku/main
              </li>
            </ul>
          </nav>
        </div>

<<<<<<< HEAD
        <div className="space-y-4 text-sm">
          <h3 className="font-serif text-base text-charcoal-700">Concierge dispatch</h3>
          <p>Receive Academy highlights, mentor reflections, and invitation windows once a month.</p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
=======
        <div className="space-y-4 text-sm text-midnight/70">
          <h3 className="text-lg font-heading text-blueberry">Stay in the loop</h3>
          <p>Receive pastel-perfect nursery mood boards and concierge openings once a month.</p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry/70">
>>>>>>> heroku/main
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
<<<<<<< HEAD
                className="rounded-lg border border-mauve-100 bg-white px-4 py-3 text-sm text-charcoal-700 focus:border-mauve-500 focus:outline-none focus:ring-1 focus:ring-mauve-500"
=======
                className="rounded-2xl border border-babyBlue/40 bg-white/90 px-4 py-3 font-body text-sm text-midnight shadow-inner focus:border-babyBlue focus:outline-none focus:ring-2 focus:ring-babyBlue/70"
>>>>>>> heroku/main
              />
            </label>
            <button
              type="submit"
<<<<<<< HEAD
              className="w-full rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-700"
            >
              {status === "submitted" ? "You're on the list" : "Join the circle"}
            </button>
          </form>
          <p className="text-xs text-charcoal-500" aria-live="polite">
            {status === "submitted"
              ? "Expect gentle updates filled with mentorship notes and seasonal guidance."
              : "We never spam. Unsubscribe anytime."}
=======
              className="w-full rounded-full border border-babyBlue/40 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
            >
              Join the list
            </button>
          </form>
          <p className="text-xs" aria-live="polite">
            {status === "submitted" ? "You're on the list!" : "We respect your inbox—unsubscribe anytime."}
>>>>>>> heroku/main
          </p>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      <div className="border-t border-babyBlue/25 px-6 py-6 text-center text-[0.7rem] font-heading uppercase tracking-[0.35em] text-blueberry/70">
        © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
>>>>>>> heroku/main
      </div>
    </footer>
  );
};

export default Footer;
