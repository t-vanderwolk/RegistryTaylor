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
    <footer className="border-t border-tmGold/25 bg-gradient-to-b from-tmMauve via-tmMauve/95 to-tmBlush/90 text-tmIvory shadow-soft">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:px-10 md:gap-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-tmMauve"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-tmIvory/40 bg-tmIvory/10 shadow-soft">
                <img
                  src="/images/logo-mark.svg"
                  alt="Taylor-Made Baby Co."
                  className="h-8 w-8"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </span>
              <span className="flex flex-col leading-tight text-tmIvory">
                <span className="font-heading text-2xl tracking-[0.12em]">Taylor-Made</span>
                <span className="text-xs font-heading uppercase tracking-[0.4em] text-tmIvory/70">
                  Baby Co.
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-tmIvory/80">
              Because parenthood should start with confidence, not confusion.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-heading uppercase tracking-[0.3em] text-tmIvory/70">Navigation</p>
            <ul className="space-y-3 text-sm text-tmIvory/80">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center transition hover:text-tmIvory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-heading uppercase tracking-[0.3em] text-tmIvory/70">Connect</p>
            <ul className="flex items-center gap-4">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-tmIvory/40 text-tmIvory transition hover:border-tmGold/50 hover:bg-tmIvory/10 hover:shadow-soft"
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
            <p className="text-sm font-heading uppercase tracking-[0.3em] text-tmIvory/70">Newsletter</p>
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
                <span className="text-xs text-tmIvory/80">
                  Welcome—Taylor will share concierge notes soon.
                </span>
              )}
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-tmIvory/70">
          © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
