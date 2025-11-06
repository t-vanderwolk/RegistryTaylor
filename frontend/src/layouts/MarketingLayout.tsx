<<<<<<< HEAD
import React from "react";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={["min-h-screen bg-ivory text-charcoal", className].filter(Boolean).join(" ")}>
      {children}
=======
import React, { useState } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import Footer from "./Footer";

type NavItem = {
  label: string;
  to: string;
  target?: string;
};

const navLinks: NavItem[] = [
  { label: "Home", to: "/", target: "home" },
  { label: "How It Works", to: "/#how-it-works", target: "how-it-works" },
  { label: "Membership", to: "/membership" },
  { label: "Blog", to: "/blog" },
  { label: "Request Invite", to: "/request-invite" },
  { label: "Member Login", to: "/portal" },
];

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAnchorNavigation = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: NavItem
  ) => {
    event.preventDefault();
    const { target, to } = link;
    closeMenu();

    if (target && location.pathname === "/") {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        section.focus?.({ preventScroll: true });
        return;
      }
    }

    if (to === "/") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToTop();
      }
      return;
    }

    navigate(to);
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow">
        Skip to content
      </a>
      <header className="border-b border-primary/40 bg-cream/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 rounded-[3rem] border border-primary/40 bg-white/95 px-3 py-2 shadow-[0_25px_55px_-28px_rgba(231,200,221,0.6)] sm:gap-4 sm:px-4 sm:py-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full bg-transparent px-2 py-1 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:gap-3 sm:px-3"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/30 shadow-inner">
                <span className="font-script text-xl" style={{ color: "rgb(166, 138, 178)" }}>TM</span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-script text-[1.1rem] sm:text-xl" style={{ color: "rgb(166, 138, 178)" }}>Taylor-Made</span>
                <span className="text-[0.52rem] font-heading uppercase tracking-[0.45em] text-ink/70 sm:text-[0.56rem]">Baby Co.</span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-4 lg:gap-5 md:flex" aria-label="Primary navigation">
              {navLinks.map((link) => {
                const isCta = link.label === "Request Invite" || link.label === "Member Login";
                const base =
                  "relative px-2 py-1 text-[0.62rem] font-heading uppercase tracking-[0.5em] transition sm:px-3 sm:text-[0.68rem] after:absolute after:left-2 after:right-2 after:-bottom-2 after:h-px after:rounded-full after:bg-primary/80 after:opacity-0 after:transition-opacity after:content-['']";
                const path = link.to.split("#")[0];
                const isActive =
                  (path === "/" && location.pathname === "/") ||
                  (path && path !== "/" && location.pathname.startsWith(path) && path.length > 1);
                const ctaClasses = isCta
                  ? "rounded-full bg-mauveDeep px-4 py-2 text-[0.62rem] font-heading uppercase tracking-[0.45em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] hover:brightness-105 after:hidden"
                  : `${base} ${isActive ? "text-ink after:opacity-100" : "text-ink/60 hover:text-ink hover:after:opacity-70"}`;
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    onClick={(event) => handleAnchorNavigation(event, link)}
                    className={ctaClasses}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 text-ink transition hover:bg-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div id="mobile-nav" className="md:hidden">
            <nav className="flex flex-wrap justify-center gap-3 border-t border-primary/30 bg-white px-4 py-6 sm:px-6" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const isCta = link.label === "Request Invite" || link.label === "Member Login";
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      isCta
                        ? "block rounded-full bg-mauveDeep px-5 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] text-white shadow-[0_10px_30px_-18px_rgba(166,138,178,0.65)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                        : [
                            "block rounded-full px-4 py-2 text-center text-xs font-heading uppercase tracking-[0.4em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                            isActive ? "bg-primary/30 text-ink" : "text-ink/80 hover:bg-primary/20",
                          ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <div id="content" role="main">
        {children}
      </div>
      <Footer />
>>>>>>> heroku/main
    </div>
  );
};

export default MarketingLayout;
