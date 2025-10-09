import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Membership", to: "/membership" },
  { label: "Registry Help", to: "/registry" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com", abbr: "IG" },
  { label: "Pinterest", href: "https://pinterest.com", abbr: "PT" },
  { label: "LinkedIn", href: "https://linkedin.com", abbr: "IN" },
];

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please share a valid email so we can reach you.");
      return;
    }
    setError(undefined);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-gold/25 bg-gradient-to-br from-[#FFF9F8] via-[#FEF3F2] to-[#FFFFFF] text-charcoal">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:px-10 md:gap-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-gold/35 bg-white shadow-elevated-sm">
                <img
                  src="/images/logo-mark.svg"
                  alt="Taylor-Made Baby Co."
                  className="h-8 w-8"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-heading text-2xl tracking-[0.12em]">Taylor-Made</span>
                <span className="text-xs font-heading uppercase tracking-[0.4em] text-charcoal/60">
                  Baby Co.
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-charcoal/70">
              Because parenthood should start with confidence, not confusion.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/60">Navigation</p>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center text-charcoal/80 transition hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/60">Connect</p>
            <ul className="flex items-center gap-4">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-charcoal transition hover:shadow-elevated-sm"
                  >
                    <span className="text-[0.7rem] font-heading uppercase tracking-[0.34em]">
                      {social.abbr}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/60">Newsletter</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
              <Input
                id="newsletter-email"
                label="Email"
                labelHidden
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubmitted(false);
                }}
                error={error}
              />
              <Button type="submit" variant="primary">
                Join The Circle
              </Button>
              {submitted && !error && (
                <span className="text-xs text-charcoal/70">
                  Welcome—Taylor will share concierge notes soon.
                </span>
              )}
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-charcoal/60">
          © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
