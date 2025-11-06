import React from "react";
import { Link } from "react-router-dom";
import { P, H2 } from "../design-system/Typography";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
<<<<<<< HEAD
    <footer className="border-t border-mauve/30 bg-ivory/95">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 text-charcoal">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mauve/40 bg-mauve/30 shadow-inner">
=======
    <footer className="border-t border-primary/30 bg-cream/95">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 text-ink">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/30 shadow-inner">
>>>>>>> heroku/main
                <span className="font-script text-lg" style={{ color: "rgb(166, 138, 178)" }}>
                  TM
                </span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-script text-lg" style={{ color: "rgb(166, 138, 178)" }}>
                  Taylor-Made
                </span>
<<<<<<< HEAD
                <span className="text-[0.55rem] font-heading uppercase tracking-[0.4em] text-charcoal/70">
=======
                <span className="text-[0.55rem] font-heading uppercase tracking-[0.4em] text-ink/70">
>>>>>>> heroku/main
                  Baby Co.
                </span>
              </div>
            </Link>
<<<<<<< HEAD
            <P className="text-sm text-charcoal/70">
=======
            <P className="text-sm text-ink/70">
>>>>>>> heroku/main
              Boutique concierge for registries, nursery styling, and celebration planning with a pastel-elegant touch.
            </P>
          </div>

          <div className="space-y-3">
<<<<<<< HEAD
            <H2 className="text-sm uppercase tracking-[0.35em] text-charcoal/60">Explore</H2>
            <ul className="space-y-2 text-sm text-charcoal/70">
=======
            <H2 className="text-sm uppercase tracking-[0.35em] text-ink/60">Explore</H2>
            <ul className="space-y-2 text-sm text-ink/70">
>>>>>>> heroku/main
              {[
                { label: "Home", to: "/" },
                { label: "How It Works", to: "/#how-it-works" },
                { label: "Membership", to: "/membership" },
                { label: "Mentors", to: "/mentors" },
              ].map((item) => (
                <li key={item.label}>
<<<<<<< HEAD
                  <Link to={item.to} className="transition hover:text-charcoal">
=======
                  <Link to={item.to} className="transition hover:text-ink">
>>>>>>> heroku/main
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
<<<<<<< HEAD
            <H2 className="text-sm uppercase tracking-[0.35em] text-charcoal/60">Resources</H2>
            <ul className="space-y-2 text-sm text-charcoal/70">
=======
            <H2 className="text-sm uppercase tracking-[0.35em] text-ink/60">Resources</H2>
            <ul className="space-y-2 text-sm text-ink/70">
>>>>>>> heroku/main
              {[
                { label: "Blog", to: "/blog" },
                { label: "Request Invite", to: "/request-invite" },
                { label: "Contact", to: "/contact" },
                { label: "Client Portal", to: "/portal" },
              ].map((item) => (
                <li key={item.label}>
<<<<<<< HEAD
                  <Link to={item.to} className="transition hover:text-charcoal">
=======
                  <Link to={item.to} className="transition hover:text-ink">
>>>>>>> heroku/main
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <H2 className="text-sm uppercase tracking-[0.35em] text-charcoal/60">Concierge Notes</H2>
            <P className="text-sm text-charcoal/70">
=======
            <H2 className="text-sm uppercase tracking-[0.35em] text-ink/60">Concierge Notes</H2>
            <P className="text-sm text-ink/70">
>>>>>>> heroku/main
              Subscribe for quarterly planning guides, nursery styling inspiration, and celebration etiquette from Taylor’s desk.
            </P>
            <form className="flex max-w-sm gap-2">
              <input
                type="email"
<<<<<<< HEAD
                className="flex-1 rounded-full border border-mauve/40 bg-white px-4 py-2 text-sm text-charcoal focus:border-mauve focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/40"
=======
                className="flex-1 rounded-full border border-primary/40 bg-white px-4 py-2 text-sm text-ink focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
>>>>>>> heroku/main
                placeholder="you@example.com"
                aria-label="Email address"
              />
              <button
                type="submit"
<<<<<<< HEAD
                className="rounded-full border border-mauve/40 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal transition hover:bg-mauve/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/40"
=======
                className="rounded-full border border-primary/40 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-ink transition hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
>>>>>>> heroku/main
              >
                Join
              </button>
            </form>
<<<<<<< HEAD
            <div className="flex items-center gap-3 text-sm text-charcoal/70">
              <button
                type="button"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-mauve/50 text-charcoal transition hover:bg-mauve/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
=======
            <div className="flex items-center gap-3 text-sm text-ink/70">
              <button
                type="button"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-primary/50 text-ink transition hover:bg-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
>>>>>>> heroku/main
              >
                IG
              </button>
              <button
                type="button"
                aria-label="Pinterest"
<<<<<<< HEAD
                className="h-9 w-9 rounded-full border border-mauve/50 text-charcoal transition hover:bg-mauve/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
=======
                className="h-9 w-9 rounded-full border border-primary/50 text-ink transition hover:bg-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
>>>>>>> heroku/main
              >
                Pin
              </button>
              <button
                type="button"
                aria-label="Email Taylor-Made Baby Co."
<<<<<<< HEAD
                className="h-9 w-9 rounded-full border border-mauve/50 text-charcoal transition hover:bg-mauve/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
=======
                className="h-9 w-9 rounded-full border border-primary/50 text-ink transition hover:bg-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
>>>>>>> heroku/main
              >
                ✉️
              </button>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-10 border-t border-mauve/20 pt-6 text-sm text-charcoal/60 sm:flex sm:items-center sm:justify-between">
          <p>© {year} Taylor-Made Baby Co. All rights reserved.</p>
          <div className="mt-3 flex gap-4 sm:mt-0">
            <Link to="/privacy" className="transition hover:text-charcoal">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-charcoal">
=======
        <div className="mt-10 border-t border-primary/20 pt-6 text-sm text-ink/60 sm:flex sm:items-center sm:justify-between">
          <p>© {year} Taylor-Made Baby Co. All rights reserved.</p>
          <div className="mt-3 flex gap-4 sm:mt-0">
            <Link to="/privacy" className="transition hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-ink">
>>>>>>> heroku/main
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
