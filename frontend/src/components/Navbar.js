import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "./UI/Button";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/taylor-made-logo.png";

const NAV_LINKS = [
  { to: "/membership", label: "Membership" },
  { to: "/add-ons", label: "Add-Ons" },
  { to: "/mentors", label: "Mentors" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const EnvelopeIcon = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25h16.5a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75zm0 0 8.25 6 8.25-6"
    />
  </svg>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { token, role, logout } = useAuth();

  const toggleMenu = () => setOpen((current) => !current);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (event) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navLinkClasses = ({ isActive }) =>
    `relative inline-flex items-center rounded-full px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.32em] transition-all duration-200 ${
      isActive
        ? 'bg-white/90 text-blueberry shadow-soft ring-1 ring-blueberry/20'
        : 'text-darkText/60 hover:text-blueberry hover:bg-white/70 hover:shadow-soft'
    }`;

  const portalDestinations = {
    admin: "/admin-portal",
    mentor: "/mentor-portal",
    client: "/client-portal",
  };

  const portalHome = portalDestinations[role] || "/portal";
  const messageDestinations = {
    admin: "/admin-portal/messages",
    mentor: "/mentor-portal/messages",
    client: "/client-portal/messages",
  };
  const messagesHome = messageDestinations[role] || null;

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-gradient-to-r from-white/85 via-cream/80 to-white/85 shadow-[0_12px_34px_-20px_rgba(15,23,42,0.5)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 lg:gap-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex h-16 w-20 items-center justify-center rounded-2xl border border-white/60 bg-white/80 p-1 shadow-soft backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 md:h-20 md:w-24"
          >
            <img
              src={logoImage}
              alt="Taylor-Made Baby Co. logo"
              className="h-full w-auto object-contain drop-shadow-sm scale-110 md:scale-125"
            />
          </Link>
          <div className="flex flex-col items-start leading-tight text-darkText">
            <span className="font-playful text-[1.45rem] sm:text-[1.7rem] text-blueberry">
              Taylor-Made Baby Co.
            </span>
            <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[0.55rem] font-heading uppercase tracking-[0.35em] text-darkText/60 shadow-inner">
              Invite-Only Concierge
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/40 px-3 py-2 shadow-inner backdrop-blur-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {token && messagesHome && (
            <Link
              to={messagesHome}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blueberry/20 bg-white/80 text-blueberry shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-dreamy"
              onClick={closeMenu}
              aria-label="Messages"
            >
              <EnvelopeIcon className="h-5 w-5" />
            </Link>
          )}
          {!token && (
            <Button
              as={Link}
              to="/request-invite"
              variant="purple"
              size="sm"
              className="tracking-[0.25em] uppercase"
              onClick={closeMenu}
            >
              Request Invite
            </Button>
          )}
          <Button
            as={Link}
            to={portalHome}
            variant="blue"
            size="sm"
            className="tracking-[0.25em] uppercase"
            onClick={closeMenu}
          >
            {token ? "Portal Home" : "Member Portal"}
          </Button>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-transparent px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] text-rose-500 shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-dreamy"
            >
              Log Out
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-blueberry shadow-soft transition duration-200 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="space-y-3 border-t border-white/40 bg-white/90 px-5 py-5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.55)] backdrop-blur">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-full px-4 py-3 font-heading text-xs uppercase tracking-[0.32em] transition duration-200 ${
                    isActive
                      ? 'bg-blueberry/10 text-blueberry shadow-soft'
                      : 'bg-white/70 text-darkText/70 hover:bg-blueberry/10 hover:text-blueberry'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!token && (
              <Button as={Link} to="/request-invite" variant="purple" size="md" className="w-full" onClick={closeMenu}>
                Request Invite
              </Button>
            )}
            <Button as={Link} to={portalHome} variant="blue" size="md" className="w-full" onClick={closeMenu}>
              {token ? "Portal Home" : "Member Portal"}
            </Button>
            {token && messagesHome && (
              <Link
                to={messagesHome}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-full border border-blueberry/20 bg-white px-4 py-3 text-sm font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
              >
                <EnvelopeIcon className="h-4 w-4" />
                Messages
              </Link>
            )}
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full border border-rose-200 bg-transparent px-6 py-3 text-sm font-heading uppercase tracking-[0.3em] text-rose-500 shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-dreamy"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
