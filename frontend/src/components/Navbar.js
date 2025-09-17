import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/membership", label: "Membership" },
  { to: "/add-ons", label: "Add-Ons" },
  { to: "/blog", label: "Journal" },
  { to: "/mentors", label: "Mentors" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMatchChange = (event) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMatchChange);
    return () => mediaQuery.removeEventListener("change", handleMatchChange);
  }, []);

  return (
    <nav className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-babyPink/30 shadow-soft">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 text-blueberry">
        <div className="flex flex-1 items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-4"
            onClick={closeMenu}
          >
            <div className="flex items-center gap-1">
              {['T', 'M', 'B'].map((letter, index) => (
                <span
                  key={letter}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg font-block text-base shadow-pop animate-bob`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    backgroundColor: index === 0 ? '#A7D8F7' : index === 1 ? '#FADADD' : '#C4E8C2',
                    color: '#3A3D4D',
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-playful text-lg sm:text-xl tracking-tight text-blueberry">
                Taylor-Made Baby Co.
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-pebble">
                Invite-Only Concierge for Modern Families
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-transform duration-200 ease-out ${
                    isActive
                      ? 'bg-babyBlue text-blueberry shadow-pop'
                      : 'bg-white/70 text-pebble hover:bg-babyPink/60 hover:text-blueberry hover:-translate-y-1'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/portal"
                className={({ isActive }) =>
                  `rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition-transform duration-200 ease-out ${
                    isActive
                      ? 'bg-pastelPurple text-blueberry shadow-pop'
                      : 'bg-white/80 text-blueberry hover:bg-pastelPurple/60 hover:-translate-y-1'
                  }`
                }
              >
                Portal
              </NavLink>
        </div>
        <button
          type="button"
          className="inline-flex md:hidden items-center justify-center rounded-full bg-babyBlue/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blueberry shadow-soft transition-transform duration-200"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-babyPink/40 bg-cream/95">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm font-semibold text-blueberry">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-full px-4 py-3 transition duration-200 ${
                    isActive
                      ? 'bg-babyPink/70 text-blueberry shadow-soft'
                      : 'bg-white/80 text-pebble hover:bg-pastelPurple/60 hover:text-blueberry'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/portal"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-full px-4 py-3 transition duration-200 ${
                  isActive
                    ? 'bg-pastelPurple/80 text-blueberry shadow-soft'
                    : 'bg-white/80 text-pebble hover:bg-pastelPurple/60 hover:text-blueberry'
                }`
              }
            >
              Portal
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
