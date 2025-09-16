import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
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
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-softGold/30 shadow-soft">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 text-deepSlate">
        <div className="flex flex-1 items-center justify-start gap-6">
          <Link to="/" className="flex items-center gap-3 text-base sm:text-lg font-serif" onClick={closeMenu}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-softGold/60 bg-white text-sm font-semibold tracking-[0.3em] text-deepSlate">
              TM
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-cursive text-2xl sm:text-3xl">Taylor-Made</span>
              <span className="text-[0.7rem] uppercase tracking-[0.4em] text-cozyGray">
                Baby Planning
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-3 text-[0.75rem] xl:text-sm font-medium tracking-[0.2em] uppercase">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `pb-1 transition-colors duration-200 ${
                    isActive
                      ? "text-deepSlate border-b-2 border-softGold"
                      : "text-cozyGray hover:text-deepSlate"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex md:hidden items-center justify-center rounded-full border border-softGold/40 px-3 py-2 text-xs font-medium uppercase tracking-[0.3em] text-deepSlate"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          Menu
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-softGold/20 bg-white/95">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-4 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-deepSlate">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `py-2 transition-colors duration-200 ${
                    isActive ? "text-deepSlate" : "text-cozyGray hover:text-deepSlate"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
