import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "./UI/Button";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/membership", label: "Membership" },
  { to: "/add-ons", label: "Add-Ons" },
  { to: "/mentors", label: "Mentors" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const BLOCK_STACK = [
  {
    letter: "T",
    classes: "bg-babyBlue",
    style: {
      "--stack-shift": "-6px",
      "--stack-tilt": "2deg",
      "--drop-delay": "0.45s",
      "--wobble-delay": "1.4s",
    },
  },
  {
    letter: "M",
    classes: "bg-babyPink",
    style: {
      "--stack-shift": "4px",
      "--stack-tilt": "-1.5deg",
      "--drop-delay": "0.25s",
      "--wobble-delay": "1.15s",
    },
  },
  {
    letter: "B",
    classes: "bg-pastelPurple",
    style: {
      "--stack-shift": "-1px",
      "--stack-tilt": "1deg",
      "--drop-delay": "0.05s",
      "--wobble-delay": "0.95s",
    },
  },
];

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
    `rounded-full px-4 py-2 text-xs sm:text-sm font-heading tracking-[0.18em] transition duration-200 ease-out shadow-toy ${
      isActive
        ? "bg-babyBlue text-darkText"
        : "bg-cream/80 text-darkText/70 hover:bg-babyPink/70 hover:text-darkText"
    }`;

  const portalDestinations = {
    admin: "/admin-portal",
    mentor: "/mentor-portal",
    client: "/client-portal",
  };

  const portalHome = portalDestinations[role] || "/portal";

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-babyPink/40 bg-cream/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-4" onClick={closeMenu}>
          <div className="brand-stack flex flex-col items-center">
            {BLOCK_STACK.map(({ letter, classes, style }) => (
              <span
                key={letter}
                className={`stack-block inline-flex h-12 w-12 items-center justify-center font-heading text-xl text-cream uppercase ${classes}`}
                style={style}
                data-letter={letter}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex flex-col leading-tight text-darkText">
            <span className="font-playful text-xl sm:text-2xl">Taylor-Made Baby Co.</span>
            <span className="text-[0.6rem] font-heading uppercase tracking-[0.4em] text-darkText/60">
              Invite-Only Concierge
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-3 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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
              className="inline-flex items-center justify-center rounded-full border border-babyPink/60 bg-transparent px-4 py-2 text-xs font-heading uppercase tracking-[0.25em] text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
            >
              Log Out
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-babyPink/60 bg-cream/90 px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-darkText shadow-toy transition duration-200 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="space-y-2 border-t border-babyPink/40 bg-cream/95 px-4 py-4 shadow-toy">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-full px-4 py-3 font-heading text-sm tracking-[0.18em] transition duration-200 shadow-toy ${
                    isActive
                      ? "bg-babyPink text-darkText"
                      : "bg-cream/90 text-darkText/70 hover:bg-babyBlue/80 hover:text-darkText"
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
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full border border-babyPink/60 bg-transparent px-6 py-3 text-sm font-heading uppercase tracking-[0.3em] text-blueberry shadow-toy transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy"
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
