import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./UI/Button";

const NAV_LINKS = [
  { to: "/membership", label: "Membership" },
  { to: "/add-ons", label: "Add-Ons" },
  { to: "/mentors", label: "Mentors" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const BLOCK_STACK = [
  {
    letter: "T",
    classes:
      "self-start bg-gradient-to-br from-babyBlue via-cream to-babyBlue/80 -rotate-3 -translate-x-1",
  },
  {
    letter: "M",
    classes:
      "self-center bg-gradient-to-br from-babyPink via-cream to-babyPink/80",
  },
  {
    letter: "B",
    classes:
      "self-end bg-gradient-to-br from-pastelPurple via-cream to-pastelPurple/85 rotate-2 translate-x-1",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

  const navLinkClasses = ({ isActive }) =>
    `rounded-full px-4 py-2 text-xs sm:text-sm font-heading tracking-[0.18em] transition duration-200 ease-out shadow-toy ${
      isActive
        ? "bg-babyBlue text-darkText"
        : "bg-cream/80 text-darkText/70 hover:bg-babyPink/70 hover:text-darkText"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-babyPink/40 bg-cream/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-4"
          onClick={closeMenu}
        >
          <div className="flex flex-col items-center gap-1">
            {BLOCK_STACK.map(({ letter, classes }) => (
              <span
                key={letter}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border-4 border-cream font-heading text-xl text-darkText shadow-dreamy transition duration-200 ${classes}`}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex flex-col leading-tight text-darkText">
            <span className="font-playful text-xl sm:text-2xl">Taylor-Made Baby Planning</span>
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
          <Button as={Link} to="/contact" variant="purple" size="sm" className="tracking-[0.25em] uppercase">
            Request Invite
          </Button>
          <Button as={Link} to="/portal" variant="blue" size="sm" className="tracking-[0.25em] uppercase">
            Member Portal
          </Button>
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
            <Button as={Link} to="/contact" variant="purple" size="md" className="w-full">
              Request Invite
            </Button>
            <Button as={Link} to="/portal" variant="blue" size="md" className="w-full">
              Member Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
